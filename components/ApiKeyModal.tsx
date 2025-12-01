import React, { useState, useEffect } from 'react';
import { PaperCard } from './ui/PaperCard';
import { PaperButton } from './ui/PaperButton';
import { X } from 'lucide-react';
import { LS_KEYS } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'deepseek' | 'moonshot' | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, provider }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (isOpen && provider) {
      const lsKey = provider === 'deepseek' ? LS_KEYS.API_KEY_DEEPSEEK : LS_KEYS.API_KEY_MOONSHOT;
      setKey(localStorage.getItem(lsKey) || '');
    }
  }, [isOpen, provider]);

  if (!isOpen || !provider) return null;

  const handleSave = () => {
    const lsKey = provider === 'deepseek' ? LS_KEYS.API_KEY_DEEPSEEK : LS_KEYS.API_KEY_MOONSHOT;
    localStorage.setItem(lsKey, key.trim());
    onClose();
  };

  const providerName = provider === 'deepseek' ? 'DeepSeek' : 'Kimi (Moonshot)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <PaperCard className="w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-hand font-bold">配置 {providerName} Key</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            为了使用 {providerName} 进行翻译，请提供您的 API Key。Key 仅保存在您的本地浏览器中。
          </p>
          <input
            type="password"
            className="w-full p-3 border-2 border-black rounded font-mono text-sm focus:ring-0 bg-yellow-50"
            placeholder={`sk-...`}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>

        <div className="p-4 border-t-2 border-black bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <PaperButton variant="secondary" onClick={onClose}>取消</PaperButton>
          <PaperButton onClick={handleSave}>保存配置</PaperButton>
        </div>
      </PaperCard>
    </div>
  );
};