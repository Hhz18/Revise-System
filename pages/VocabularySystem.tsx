import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PaperButton } from '../components/ui/PaperButton';
import { PaperCard } from '../components/ui/PaperCard';
import { ImporterModal } from '../components/ImporterModal';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { VocabularyItem, SystemType, LLMProvider } from '../types';
import { Check, RotateCw, Archive, Zap, Settings, ChevronDown } from 'lucide-react';
import { translateWord, translateBatch } from '../services/llmService'; // Changed service
import { getNextReviewDate, isDue } from '../utils/timeUtils';
import { ARCHIVE_THRESHOLD, LLM_PROVIDERS, LS_KEYS } from '../constants';

interface VocabularySystemProps {
  items: VocabularyItem[];
  setItems: React.Dispatch<React.SetStateAction<VocabularyItem[]>>;
}

export const VocabularySystem: React.FC<VocabularySystemProps> = ({ items, setItems }) => {
  const [isImporterOpen, setImporterOpen] = useState(false);
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const processingRef = useRef(false);

  // Model Selection State
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    return localStorage.getItem(LS_KEYS.MODEL_CHOICE) || LLM_PROVIDERS[0].id;
  });
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [configProvider, setConfigProvider] = useState<LLMProvider | null>(null);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.MODEL_CHOICE, selectedModelId);
  }, [selectedModelId]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedModelId(newId);
    
    // Check if key is needed
    const provider = LLM_PROVIDERS.find(p => p.id === newId)?.provider;
    if (provider === 'deepseek' || provider === 'moonshot') {
        const keyExists = provider === 'deepseek' 
            ? localStorage.getItem(LS_KEYS.API_KEY_DEEPSEEK)
            : localStorage.getItem(LS_KEYS.API_KEY_MOONSHOT);
            
        if (!keyExists) {
            setConfigProvider(provider);
            setKeyModalOpen(true);
        }
    }
  };

  const openKeyConfig = () => {
    const provider = LLM_PROVIDERS.find(p => p.id === selectedModelId)?.provider;
    if (provider === 'deepseek' || provider === 'moonshot') {
        setConfigProvider(provider);
        setKeyModalOpen(true);
    } else {
        alert("Google Gemini 使用系统内置 Key，无需配置。");
    }
  };

  // Sorting Logic
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
      const aDue = isDue(a.nextReviewDate);
      const bDue = isDue(b.nextReviewDate);
      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      return a.checkCount - b.checkCount;
    });
  }, [items]);

  // --- Background Batch Translation Logic ---
  useEffect(() => {
    const processBatch = async () => {
      if (processingRef.current) return;

      const candidates = items.filter(
        item => !item.translation && !item.isLoadingTranslation && !item.isArchived
      );

      if (candidates.length === 0) return;

      const BATCH_SIZE = 100;
      const batchItems = candidates.slice(0, BATCH_SIZE);
      const batchWords = batchItems.map(i => i.content);
      const batchIds = new Set(batchItems.map(i => i.id));

      processingRef.current = true;

      setItems(prev => prev.map(item => 
        batchIds.has(item.id) ? { ...item, isLoadingTranslation: true } : item
      ));

      // Pass selectedModelId to service
      const translationsMap = await translateBatch(batchWords, selectedModelId);

      setItems(prev => prev.map(item => {
        if (batchIds.has(item.id)) {
          const translatedText = translationsMap[item.content];
          return {
            ...item,
            translation: translatedText || item.translation, 
            isLoadingTranslation: false, 
          };
        }
        return item;
      }));

      processingRef.current = false;
    };

    const timer = setTimeout(processBatch, 2000);
    return () => clearTimeout(timer);
  }, [items, setItems, selectedModelId]); // Depend on selectedModelId


  const handleImport = (text: string) => {
    const lines = text.split('\n');
    let currentChapter = 'Uncategorized';
    const newItems: VocabularyItem[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('---')) return;

      if (trimmed.includes('章') || trimmed.includes('Chapter')) {
        currentChapter = trimmed;
      } else {
        newItems.push({
          id: crypto.randomUUID(),
          content: trimmed,
          chapter: currentChapter,
          checkCount: 0,
          lastReviewDate: null,
          nextReviewDate: Date.now(),
          isArchived: false,
          createdAt: Date.now(),
          isFlipped: false,
          isLoadingTranslation: false
        });
      }
    });

    setItems(prev => [...prev, ...newItems]);
  };

  const handleFlip = async (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (!item.isFlipped && !item.translation && !item.isLoadingTranslation) {
        fetchTranslation(id, item.content);
        return { ...item, isLoadingTranslation: true, isFlipped: true };
      }
      return { ...item, isFlipped: !item.isFlipped };
    }));
  };

  const fetchTranslation = async (id: string, word: string) => {
    const translation = await translateWord(word, selectedModelId);
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, translation, isLoadingTranslation: false } : item
    ));
  };

  const handleCheck = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (checkingIds.has(id)) return;
    setCheckingIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
    });
    await new Promise(resolve => setTimeout(resolve, 600));
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newCount = item.checkCount + 1;
      const isArchived = newCount >= ARCHIVE_THRESHOLD;
      return {
        ...item,
        checkCount: newCount,
        lastReviewDate: Date.now(),
        nextReviewDate: getNextReviewDate(newCount),
        isArchived: isArchived
      };
    }));
    setCheckingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });
  };

  const handleRestore = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isArchived: false, checkCount: 0, nextReviewDate: Date.now() } : item
    ));
  };

  const pendingTranslationCount = items.filter(i => !i.translation && !i.isArchived).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
            <h2 className="text-3xl font-hand font-bold text-gray-800">单词纠错本</h2>
            {pendingTranslationCount > 0 && (
                <span className="text-xs text-yellow-600 font-bold flex items-center gap-1 animate-pulse mt-1">
                    <Zap size={12} /> 后台正在翻译 {pendingTranslationCount} 个单词...
                </span>
            )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Model Selector */}
            <div className="relative flex-1 md:flex-none md:w-48 group">
                <select
                    value={selectedModelId}
                    onChange={handleModelChange}
                    className="w-full appearance-none bg-white border-2 border-black rounded-lg py-2 pl-3 pr-8 font-hand text-sm focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                    {LLM_PROVIDERS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Config Button for Custom Keys */}
            {(selectedModelId.startsWith('deepseek') || selectedModelId.startsWith('kimi')) && (
                 <button 
                    onClick={openKeyConfig}
                    className="p-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="配置 API Key"
                 >
                    <Settings size={20} />
                 </button>
            )}

            <PaperButton onClick={() => setImporterOpen(true)} className="whitespace-nowrap flex-shrink-0">
                + 批量导入
            </PaperButton>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {sortedItems.map(item => {
           const due = isDue(item.nextReviewDate);
           const isChecking = checkingIds.has(item.id);
           
           if (item.isArchived) return null;

           return (
            <div key={item.id} className="relative group perspective-1000 h-24 w-full">
              <div 
                onClick={() => !isChecking && handleFlip(item.id)}
                className={`
                  w-full h-full relative transform-style-3d transition-transform duration-500 cursor-pointer
                  ${item.isFlipped ? 'rotate-y-180' : ''}
                `}
              >
                {/* Front Side */}
                <PaperCard className="absolute inset-0 backface-hidden flex items-center justify-between px-6 bg-white hover:bg-gray-50">
                  <div className="flex items-center gap-6 overflow-hidden">
                    <span className="hidden sm:inline-block text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500 border-2 border-gray-200 font-hand min-w-[80px] text-center shrink-0">
                      {item.chapter || 'Uncategorized'}
                    </span>
                    <h3 className="text-2xl font-hand font-bold text-gray-800 tracking-wide truncate">
                      {item.content}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0">
                     {!due && !isChecking && (
                        <span className="text-xs text-gray-400 font-hand hidden md:inline-block bg-gray-50 px-2 py-1 rounded border border-gray-100">
                           Wait until {new Date(item.nextReviewDate).toLocaleDateString()}
                        </span>
                     )}

                    <div className="flex gap-1">
                      {Array.from({length: item.checkCount}).map((_, i) => (
                        <Check key={i} size={18} className="text-green-500" strokeWidth={3} />
                      ))}
                    </div>

                    <button 
                      onClick={(e) => handleCheck(e, item.id)}
                      disabled={!due || isChecking}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                        ${isChecking 
                           ? "bg-green-500 border-black scale-110 shadow-none text-white" 
                           : due 
                             ? "bg-white border-black hover:bg-green-100 text-green-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95" 
                             : "bg-gray-100 border-gray-300 text-gray-300 cursor-default opacity-50 shadow-none"
                        }
                      `}
                      title={due ? "Mark as remembered" : "Not due yet"}
                    >
                      <Check 
                        size={20} 
                        strokeWidth={3} 
                        className={`transition-transform duration-300 ${isChecking ? "scale-125 text-white" : ""}`} 
                      />
                    </button>
                  </div>
                </PaperCard>

                {/* Back Side */}
                <PaperCard className="absolute inset-0 backface-hidden rotate-y-180 bg-yellow-50 flex items-center justify-center px-6 text-center border-yellow-400 shadow-[4px_4px_0px_0px_#ca8a04]">
                  {item.isLoadingTranslation ? (
                    <div className="animate-spin text-yellow-600"><RotateCw /></div>
                  ) : (
                    <div className="prose w-full">
                      <p className="text-xl font-hand font-bold text-yellow-900 truncate">
                        {item.translation || "点击尝试重新翻译"}
                      </p>
                    </div>
                  )}
                </PaperCard>
              </div>
            </div>
           );
        })}
        
        {sortedItems.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-hand text-xl border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            空空如也~ 点击右上角导入单词
          </div>
        )}
      </div>

      {/* Archived Section */}
      {sortedItems.some(i => i.isArchived) && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300">
          <h3 className="text-xl font-hand font-bold text-gray-500 flex items-center gap-2 mb-6">
            <Archive size={20} /> 已斩杀区 (Archived)
          </h3>
          <div className="flex flex-col space-y-2 opacity-60">
             {sortedItems.filter(i => i.isArchived).map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 bg-gray-100 rounded border border-gray-300">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.chapter}</span>
                    <span className="text-lg text-gray-500 line-through font-hand decoration-2 decoration-gray-400 truncate">{item.content}</span>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                    <div className="flex">
                      {Array.from({length: item.checkCount}).map((_, i) => (
                          <Check key={i} size={14} className="text-gray-400" />
                      ))}
                    </div>
                    <button 
                        onClick={() => handleRestore(item.id)}
                        className="text-xs text-blue-400 hover:text-blue-600 underline ml-2"
                    >
                        Restore
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      <ImporterModal 
        isOpen={isImporterOpen} 
        onClose={() => setImporterOpen(false)} 
        onImport={handleImport}
        systemType={SystemType.VOCABULARY}
      />

      {/* Config Modal for DeepSeek/Kimi */}
      <ApiKeyModal 
        isOpen={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        provider={configProvider === 'deepseek' || configProvider === 'moonshot' ? configProvider : null}
      />
    </div>
  );
};