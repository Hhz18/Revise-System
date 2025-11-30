import React, { useState } from 'react';
import { PaperButton } from '../components/ui/PaperButton';
import { PaperCard } from '../components/ui/PaperCard';
import { ImporterModal } from '../components/ImporterModal';
import { GenericItem, SystemType, SystemConfig } from '../types';
import { Check, Trash2, XCircle } from 'lucide-react';

interface GenericSystemProps {
  config: SystemConfig;
  items: GenericItem[];
  setItems: (items: GenericItem[]) => void;
  onDeleteSystem?: () => void;
}

export const GenericSystem: React.FC<GenericSystemProps> = ({ config, items, setItems, onDeleteSystem }) => {
  const [isImporterOpen, setImporterOpen] = useState(false);

  // Sort by check count
  const sortedItems = [...items].sort((a, b) => a.checkCount - b.checkCount);

  const handleImport = (text: string) => {
    const lines = text.split('\n');
    const newItems: GenericItem[] = lines
      .filter(l => l.trim())
      .map(line => ({
        id: crypto.randomUUID(),
        content: line.trim(),
        checkCount: 0,
        lastReviewDate: null,
        nextReviewDate: Date.now(),
        isArchived: false,
        createdAt: Date.now()
      }));
    setItems([...items, ...newItems]);
  };

  const handleCheck = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checkCount: item.checkCount + 1 } : item
    ));
  };
  
  const handleDeleteItem = (id: string) => {
    if(confirm('确定删除这个事项吗？')) {
        setItems(items.filter(item => item.id !== id));
    }
  }

  const handleDeleteSystem = () => {
    if (confirm(`确定要删除整个 "${config.label}" 分类吗？里面的数据也会被清空。`)) {
      if (onDeleteSystem) onDeleteSystem();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h2 className="text-3xl font-hand font-bold text-gray-800">{config.label}</h2>
             {config.isCustom && (
               <button 
                onClick={handleDeleteSystem}
                className="text-gray-300 hover:text-red-400 transition-colors p-1"
                title="删除分类"
               >
                 <XCircle size={20} />
               </button>
             )}
           </div>
           <p className="text-gray-500 text-sm mt-1">{config.description}</p>
        </div>
        <PaperButton 
          onClick={() => setImporterOpen(true)}
          className={`border-2 ${config.borderColor} ${config.color} hover:brightness-95`}
        >
          + 添加事项
        </PaperButton>
      </div>

      <div className="space-y-3">
        {sortedItems.map(item => (
          <PaperCard 
            key={item.id} 
            className={`flex items-center justify-between p-4 ${config.color} bg-opacity-30 border-black`}
          >
            <span className="text-lg font-hand font-bold text-gray-800 flex-1">{item.content}</span>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 hidden sm:inline-block">
                Count: {item.checkCount}
              </span>
              <button 
                onClick={() => handleCheck(item.id)}
                className="p-2 rounded-full bg-white border-2 border-black hover:bg-gray-100 transition-all active:translate-y-1"
              >
                <Check size={18} className="text-green-600" />
              </button>
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </PaperCard>
        ))}
         {sortedItems.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-hand text-xl border-2 border-dashed border-gray-300 rounded-lg">
            暂无记录，快去添加吧！
          </div>
        )}
      </div>

      <ImporterModal 
        isOpen={isImporterOpen} 
        onClose={() => setImporterOpen(false)} 
        onImport={handleImport}
        systemType={SystemType.DAILY} // Just for placeholder text logic
      />
    </div>
  );
};
