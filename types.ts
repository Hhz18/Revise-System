export enum SystemType {
  VOCABULARY = 'VOCABULARY',
  ALGORITHM = 'ALGORITHM',
  DAILY = 'DAILY',
  READING = 'READING',
  MINDSET = 'MINDSET'
}

export interface SystemConfig {
  id: string;
  label: string;
  iconName: string; // Key in ICON_MAP
  color: string;
  borderColor: string;
  accentColor: string;
  description: string;
  isCustom?: boolean;
}

export interface BaseItem {
  id: string;
  content: string; 
  chapter?: string; 
  checkCount: number;
  lastReviewDate: number | null; 
  nextReviewDate: number; 
  isArchived: boolean;
  createdAt: number;
}

export interface VocabularyItem extends BaseItem {
  translation?: string;
  isFlipped?: boolean; 
  isLoadingTranslation?: boolean; 
}

export interface AlgorithmItem extends BaseItem {
  markdownNote?: string; 
}

export interface GenericItem extends BaseItem {
  // Generic items just use content
}

export type AppState = {
  activeSystem: string; // Changed from SystemType to string to support custom IDs
  vocabulary: VocabularyItem[];
  algorithms: AlgorithmItem[];
  daily: GenericItem[];
  reading: GenericItem[];
  mindset: GenericItem[];
  customSystemsConfig: SystemConfig[]; // List of user-created systems
  customData: Record<string, GenericItem[]>; // Map of system ID to items
};

export type LLMProvider = 'google' | 'deepseek' | 'moonshot';

export interface ModelConfig {
  id: string;
  name: string;
  provider: LLMProvider;
  modelId: string;
}