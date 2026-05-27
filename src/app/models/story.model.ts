export interface Story {
  id: string;
  name: string;
  gender: string;
  age: number;
  bodyTone?: string;
  location: string;
  theme: string;
  event: string;
  mood: string;
  character: string;
  moral: string;
  language: string;
  notes?: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
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
