
export type Emotion = 'Happy' | 'Anxious' | 'Sad' | 'Stressed' | 'Angry' | 'Neutral';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: Emotion;
  timestamp: number;
}

export interface Birthday {
  id: string;
  name: string;
  date: string;
  notes?: string;
}

export interface AnalysisResult {
  emotion: Emotion;
  advice: string;
  grootTranslation: string;
  extractedFacts?: string[]; // New facts to move to subconscious
}

export interface SubconsciousMemory {
  userFacts: string[];
  conversationCount: number;
  lastAnalysisDate: number;
  userProfile: {
    name?: string;
    preferences?: string[];
    importantEvents?: string[];
  };
}
