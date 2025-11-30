import React, { useState } from 'react';
import { PaperCard } from './ui/PaperCard';
import { PaperButton } from './ui/PaperButton';
import { X } from 'lucide-react';
import { SystemType } from '../types';

interface ImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (text: string) => void;
  systemType: SystemType;
}

const PEN_COLORS = [
  { value: '#fbbf24', class: 'bg-amber-400', label: 'Amber' }, // Default Orange-Yellow
  { value: '#38bdf8', class: 'bg-sky-400', label: 'Sky Blue' },
  { value: '#a3e635', class: 'bg-lime-400', label: 'Lime' },
  { value: '#f472b6', class: 'bg-pink-400', label: 'Pink' },
  { value: '#ffffff', class: 'bg-white', label: 'White' },
];

export const ImporterModal: React.FC<ImporterModalProps> = ({ isOpen, onClose, onImport, systemType }) => {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState(PEN_COLORS[0].value);

  if (!isOpen) return null;

  const handleImport = () => {
    onImport(text);
    setText('');
    onClose();
  };

  const placeholder = systemType === SystemType.VOCABULARY 
    ? "129章\n-------------\nsociology\nflee\n..." 
    : "Bug fixed in auth module\nRefactor user service\n...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <PaperCard className="w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-hand font-bold">批量导入</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col gap-2">
           <div className="flex items-center justify-between">
             <p className="text-sm text-gray-600">
              {systemType === SystemType.VOCABULARY 
                ? '请输入单词列表。' 
                : '每行一个条目。'}
             </p>
             
             {/* Color Picker */}
             <div className="flex gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200">
                {PEN_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTextColor(color.value)}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all duration-200
                      ${color.class}
                      ${textColor === color.value 
                        ? 'border-black scale-110 shadow-sm ring-1 ring-black ring-offset-1' 
                        : 'border-transparent hover:scale-105 hover:border-gray-300'
                      }
                    `}
                    title={color.label}
                  />
                ))}
             </div>
           </div>

          <textarea
            className="w-full h-64 p-4 border-2 border-black rounded-md focus:ring-0 font-mono text-base resize-none bg-gray-800 placeholder-gray-600 shadow-inner"
            style={{ color: textColor }}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="p-4 border-t-2 border-black bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <PaperButton variant="secondary" onClick={onClose}>取消</PaperButton>
          <PaperButton onClick={handleImport}>确认导入</PaperButton>
        </div>
      </PaperCard>
    </div>
  );
};