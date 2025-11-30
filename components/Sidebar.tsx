import React from 'react';
import { ICON_MAP } from '../constants';
import { SystemConfig } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  systems: SystemConfig[];
  activeSystem: string;
  onSelect: (systemId: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onAddSystem: () => void;
  onDeleteSystem?: (systemId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  systems, 
  activeSystem, 
  onSelect, 
  isOpen, 
  setIsOpen, 
  onAddSystem,
  onDeleteSystem 
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r-2 border-black
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b-2 border-black bg-gray-50">
          <h1 className="text-2xl font-hand font-bold text-gray-800">Correction Loop</h1>
          <p className="text-xs text-gray-500 mt-1">Efficient Iteration System</p>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {systems.map((config) => {
            const Icon = ICON_MAP[config.iconName] || ICON_MAP['CheckSquare'];
            const isActive = activeSystem === config.id;

            return (
              <div
                key={config.id}
                className={`
                  w-full flex items-center rounded-lg border-2 
                  transition-all duration-200 font-hand text-lg
                  ${isActive 
                    ? `${config.color} border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]` 
                    : 'bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }
                `}
              >
                <button
                  onClick={() => {
                    onSelect(config.id);
                    setIsOpen(false);
                  }}
                  className="flex-1 flex items-center gap-3 px-4 py-3 text-left outline-none"
                >
                  <Icon size={20} className={isActive ? 'text-black' : 'text-gray-500'} />
                  <span className={`truncate ${isActive ? 'font-bold' : 'text-gray-600'}`}>{config.label}</span>
                </button>

                {config.isCustom && onDeleteSystem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`确定要删除 "${config.label}" 吗？此操作无法撤销。`)) {
                        onDeleteSystem(config.id);
                      }
                    }}
                    className={`
                      p-3 mr-1 rounded-md transition-colors outline-none
                      ${isActive ? 'text-gray-600 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
                    `}
                    title="删除此分类"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-dashed border-gray-300 mt-2">
            <button
              onClick={() => {
                onAddSystem();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-all font-hand text-lg"
            >
              <Plus size={20} />
              <span>添加分类...</span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t-2 border-black text-xs text-gray-400 text-center font-hand">
            v1.1.0 • Customizable
        </div>
      </aside>
    </>
  );
};