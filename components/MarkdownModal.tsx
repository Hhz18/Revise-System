import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PaperCard } from './ui/PaperCard';
import { PaperButton } from './ui/PaperButton';
import { X, Edit2, Eye } from 'lucide-react';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialContent: string;
  onSave: (content: string) => void;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({ isOpen, onClose, title, initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(initialContent || '# Notes\n\nAdd your notes here...');
  }, [initialContent, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <PaperCard className="w-full max-w-3xl flex flex-col h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-hand font-bold truncate pr-4">{title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="p-2 hover:bg-gray-200 rounded border-2 border-transparent hover:border-black transition-all"
              title={isEditing ? "Preview" : "Edit"}
            >
              {isEditing ? <Eye size={20} /> : <Edit2 size={20} />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {isEditing ? (
            <textarea
              className="flex-1 w-full p-4 border-none focus:ring-0 font-mono text-sm resize-none bg-yellow-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type markdown here..."
            />
          ) : (
            <div className="flex-1 w-full p-6 overflow-y-auto prose prose-sm max-w-none prose-p:font-hand prose-headings:font-hand">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="p-4 border-t-2 border-black bg-gray-50 rounded-b-lg flex justify-end gap-3">
             <PaperButton onClick={handleSave}>保存笔记</PaperButton>
          </div>
        )}
      </PaperCard>
    </div>
  );
};
