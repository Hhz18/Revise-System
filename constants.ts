import { SystemType, ModelConfig } from './types';
import { 
  BookOpen, Code, CheckSquare, Book, BrainCircuit, 
  Heart, Star, User, Music, Coffee, Zap, Smile, Gift, Flag
} from 'lucide-react';

// For rendering icons dynamically
export const ICON_MAP: Record<string, any> = {
  BookOpen, Code, CheckSquare, Book, BrainCircuit,
  Heart, Star, User, Music, Coffee, Zap, Smile, Gift, Flag
};

export const THEME_PRESETS = [
  { label: 'Yellow', color: 'bg-yellow-100', borderColor: 'border-yellow-400', accentColor: 'text-yellow-700' },
  { label: 'Blue', color: 'bg-blue-100', borderColor: 'border-blue-400', accentColor: 'text-blue-700' },
  { label: 'Green', color: 'bg-green-100', borderColor: 'border-green-400', accentColor: 'text-green-700' },
  { label: 'Purple', color: 'bg-purple-100', borderColor: 'border-purple-400', accentColor: 'text-purple-700' },
  { label: 'Red', color: 'bg-red-100', borderColor: 'border-red-400', accentColor: 'text-red-700' },
  { label: 'Pink', color: 'bg-pink-100', borderColor: 'border-pink-400', accentColor: 'text-pink-700' },
  { label: 'Orange', color: 'bg-orange-100', borderColor: 'border-orange-400', accentColor: 'text-orange-700' },
  { label: 'Gray', color: 'bg-gray-200', borderColor: 'border-gray-400', accentColor: 'text-gray-700' },
];

export const SYSTEM_CONFIG = {
  [SystemType.VOCABULARY]: {
    id: SystemType.VOCABULARY,
    label: '单词纠错',
    iconName: 'BookOpen',
    color: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    accentColor: 'text-yellow-700',
    description: 'Import words, flip to learn, check to master.'
  },
  [SystemType.ALGORITHM]: {
    id: SystemType.ALGORITHM,
    label: '算法纠错',
    iconName: 'Code',
    color: 'bg-blue-100',
    borderColor: 'border-blue-400',
    accentColor: 'text-blue-700',
    description: 'Track coding errors and review snippets.'
  },
  [SystemType.DAILY]: {
    id: SystemType.DAILY,
    label: '日常事务',
    iconName: 'CheckSquare',
    color: 'bg-green-100',
    borderColor: 'border-green-400',
    accentColor: 'text-green-700',
    description: 'Keep your daily habits on track.'
  },
  [SystemType.READING]: {
    id: SystemType.READING,
    label: '读书复盘',
    iconName: 'Book',
    color: 'bg-purple-100',
    borderColor: 'border-purple-400',
    accentColor: 'text-purple-700',
    description: 'Capture insights from your reading.'
  },
  [SystemType.MINDSET]: {
    id: SystemType.MINDSET,
    label: '思维纠错',
    iconName: 'BrainCircuit',
    color: 'bg-red-100',
    borderColor: 'border-red-400',
    accentColor: 'text-red-700',
    description: 'Refine your mental models.'
  }
};

export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30]; 
export const ARCHIVE_THRESHOLD = 3;

export const LLM_PROVIDERS: ModelConfig[] = [
  { id: 'gemini-flash', name: 'Gemini 2.5 Flash', provider: 'google', modelId: 'gemini-2.5-flash' },
  { id: 'gemini-pro', name: 'Gemini 2.5 Pro', provider: 'google', modelId: 'gemini-2.5-pro' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'deepseek', modelId: 'deepseek-chat' },
  { id: 'kimi', name: 'Kimi Moonshot', provider: 'moonshot', modelId: 'moonshot-v1-8k' },
];

export const LS_KEYS = {
  DATA: 'correction-loop-data',
  MODEL_CHOICE: 'correction-loop-model-choice',
  API_KEY_DEEPSEEK: 'correction-loop-key-deepseek',
  API_KEY_MOONSHOT: 'correction-loop-key-moonshot',
};