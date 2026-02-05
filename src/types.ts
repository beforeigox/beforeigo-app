export type StorytellerRole = 'mom' | 'dad' | 'son' | 'daughter' | 'grandma' | 'grandpa' | 'aunt_uncle' | 'sibling';
export type RecipientRole = 'Son' | 'Daughter' | 'Grandchild' | 'Family' | 'Friend' | 'Multiple People' | 'Other';

export interface Question {
  id: string;
  role: StorytellerRole;
  category: string;
  categoryQuote?: string;
  question: string;
  placeholder?: string;
}

export interface Story {
  id: string;
  storyteller_role: StorytellerRole;
  recipient_role: RecipientRole | null;
  plan?: 'storyteller' | 'keepsake' | 'legacy';
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: string;
  story_id: string;
  question_id: string;
  answer: string;
  image_urls: string[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
