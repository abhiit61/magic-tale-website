export interface Story {
  id: string;
  title: string;
  name: string;
  gender: string;
  age: number;
  bodyTone?: string;
  location: string;
  theme: string;
  event: string;
  mood: string;
  companion: string;
  moralAttributes: string;
  language: string;
  notes?: string;
  status: 'COMPLETED' | 'GENERATING' | 'FAILED';
  createdAt: string;
  createdByEmail?: string;
  createdByName?: string;
}

export interface StoriesPage {
  content: Story[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
