export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  active: boolean;
  createdAt: string;
  pictureUrl?: string;
}
