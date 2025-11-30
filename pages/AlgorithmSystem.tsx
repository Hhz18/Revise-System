import React, { useState } from 'react';
import { PaperButton } from '../components/ui/PaperButton';
import { PaperCard } from '../components/ui/PaperCard';
import { ImporterModal } from '../components/ImporterModal';
import { MarkdownModal } from '../components/MarkdownModal';
import { AlgorithmItem, SystemType } from '../types';
import { Check, FileText } from 'lucide-react';

interface AlgorithmSystemProps {
  items: AlgorithmItem[];
  setItems: React.Dispatch<React.SetStateAction<AlgorithmItem[]>>;
}

export const AlgorithmSystem: React.FC<AlgorithmSystemProps> = ({ items, setItems }) => {
  const [isImporterOpen, setImporterOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<AlgorithmItem | null>(null);

  // Simple sort: Check count
  const sortedItems = [...items].sort((a, b) => a.checkCount - b.checkCount);

  const handleImport = (text: string) => {
    const lines = text.split('\n');
    const newItems: AlgorithmItem[] = lines
      .filter(l => l.trim())
      .map(line => ({
        id: crypto.randomUUID(),
        content: line.trim(),
        checkCount: 0,
        lastReviewDate: null,
        nextReviewDate: Date.now(),
        isArchived: false,
        createdAt: Date.now(),
        markdownNote: ''
      }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleCheck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checkCount: item.checkCount + 1 } : item
    ));
  };

  const handleSaveNote = (note: string) => {
    if (!activeItem) return;
    setItems(prev => prev.map(item => 
      item.id === activeItem.id ? { ...item, markdownNote: note } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-hand font-bold text-gray-800">算法错题集</h2>
        <PaperButton onClick={() => setImporterOpen(true)} className="bg-blue-300 hover:bg-blue-400">+ 添加题目</PaperButton>
      </div>

      <div className="space-y-3">
        {sortedItems.map(item => (
          <PaperCard 
            key={item.id} 
            onClick={() => setActiveItem(item)}
            className="flex items-center justify-between p-4 bg-blue-50 border-blue-900 hover:bg-blue-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white border-2 border-blue-200 rounded-md">
                <FileText className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-gray-800">{item.content}</h3>
                <span className="text-xs text-blue-400 font-bold">
                  {item.markdownNote ? 'Has Notes' : 'No Notes'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                 {Array.from({length: item.checkCount}).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />
                  ))}
              </div>
              <button 
                onClick={(e) => handleCheck(e, item.id)}
                className="p-2 rounded-full hover:bg-blue-200 border border-transparent hover:border-blue-400 transition-colors"
              >
                <Check size={20} className="text-blue-600" />
              </button>
            </div>
          </PaperCard>
        ))}
      </div>

      <ImporterModal 
        isOpen={isImporterOpen} 
        onClose={() => setImporterOpen(false)} 
        onImport={handleImport}
        systemType={SystemType.ALGORITHM}
      />
      
      <MarkdownModal 
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        title={activeItem?.content || ''}
        initialContent={activeItem?.markdownNote || ''}
        onSave={handleSaveNote}
      />
    </div>
  );
};
