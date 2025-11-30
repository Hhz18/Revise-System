import React, { useState } from 'react';
import { PaperCard } from './ui/PaperCard';
import { PaperButton } from './ui/PaperButton';
import { X } from 'lucide-react';
import { ICON_MAP, THEME_PRESETS } from '../constants';
import { SystemConfig } from '../types';

interface AddSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: Omit<SystemConfig, 'id'>) => void;
}

export const AddSystemModal: React.FC<AddSystemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Heart');
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[4]); // Default to Red/Pinkish for "Love" example

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({
      label,
      description: description || 'Custom correction system',
      iconName: selectedIcon,
      color: selectedTheme.color,
      borderColor: selectedTheme.borderColor,
      accentColor: selectedTheme.accentColor,
      isCustom: true
    });
    // Reset
    setLabel('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <PaperCard className="w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-hand font-bold">创建新分类</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">名称 (比如：恋爱纠错)</label>
            <input 
              className="w-full p-2 border-2 border-gray-300 rounded focus:border-black focus:ring-0 transition-colors"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="输入名称..."
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">描述 (可选)</label>
            <input 
              className="w-full p-2 border-2 border-gray-300 rounded focus:border-black focus:ring-0 transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="一句话描述..."
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">选择图标</label>
            <div className="grid grid-cols-7 gap-2">
              {Object.keys(ICON_MAP).map(iconName => {
                const Icon = ICON_MAP[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`
                      p-2 flex items-center justify-center rounded border-2 transition-all
                      ${selectedIcon === iconName 
                        ? 'bg-black text-white border-black scale-110' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                      }
                    `}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">选择主题色</label>
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.label}
                  onClick={() => setSelectedTheme(theme)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-transform
                    ${theme.color}
                    ${selectedTheme.label === theme.label 
                      ? 'border-black scale-110 ring-2 ring-offset-2 ring-black' 
                      : 'border-transparent hover:scale-105 hover:border-gray-300'
                    }
                  `}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t-2 border-black bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <PaperButton variant="secondary" onClick={onClose}>取消</PaperButton>
          <PaperButton onClick={handleAdd}>创建</PaperButton>
        </div>
      </PaperCard>
    </div>
  );
};
