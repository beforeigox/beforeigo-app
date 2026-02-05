export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  progress: number;
  totalQuestions: number;
  answeredQuestions: number;
  coverImage?: string;
  isPurchased: boolean;
  storyId: string;
  purchaseDate: string;
  status: 'active' | 'completed' | 'paused';
  role?: string;
  storytellerName?: string;
}

export interface UpsellFeature {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  icon: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}