import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../api-endpoints.config';
import { Story, StoriesPage } from '../models/story.model';

export interface StorybookPayload {
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
}

@Injectable({
  providedIn: 'root'
})
export class StorybookService {
  private readonly generatePdfApiUrl: string;
  private readonly storiesApiUrl: string;

  readonly locations: string[] = [
    'Mystical Varanasi Ghats',
    'Enchanted Rajasthan Desert',
    'Magical Kerala Backwaters',
    'Sacred Vrindavan Forests',
    'Ancient Hampi Ruins',
    'Himalayan Snow Kingdom',
    'Royal Mysore Palace',
    'Sundarbans Jungle'
  ];

  readonly events: string[] = [
    'Diwali Celebration',
    'Holi Festival of Colours',
    'Lost Temple Discovery',
    'Royal Navratri Dance',
    'Kumbh Mela Adventure',
    'Village Mela Mystery',
    'Ancient Treasure Hunt',
    'Magical Train Journey'
  ];

  private readonly sampleNames    = ['Aarav', 'Diya', 'Ishaan', 'Kavya', 'Vivaan', 'Ananya', 'Arjun', 'Meera', 'Dev', 'Riya', 'Kabir', 'Siya'];
  private readonly sampleThemes   = ['fantasy', 'scifi', 'adventure', 'mystery', 'romance'];
  private readonly sampleMoods    = ['exciting', 'mysterious', 'peaceful', 'tense', 'playful'];
  private readonly sampleChars    = ['dragon', 'robot', 'fairy', 'dog', 'cat', 'friend'];
  private readonly sampleMorals   = ['courage', 'kindness', 'friendship', 'perseverance', 'honesty', 'teamwork'];
  private readonly sampleGenders  = ['male', 'female'];
  private readonly sampleTones    = ['Athletic', 'Slim', 'Average', 'Muscular', 'Curvy'];
  private readonly sampleLangs    = ['hindi', 'hindi', 'gujarati', 'gujarati', 'english'];

  constructor(private readonly http: HttpClient) {
    this.generatePdfApiUrl = this.buildApiUrl(API_ENDPOINTS.storybook.generatePdf);
    this.storiesApiUrl = this.buildApiUrl(API_ENDPOINTS.storybook.stories);
  }

  private buildApiUrl(endpoint: string): string {
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${endpointPath}`;
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getAutoFillPayload(): StorybookPayload {
    return {
      name:      this.pick(this.sampleNames),
      gender:    this.pick(this.sampleGenders),
      age:       Math.floor(Math.random() * 10) + 5,
      bodyTone:  this.pick(this.sampleTones),
      location:  this.pick(this.locations),
      theme:     this.pick(this.sampleThemes),
      event:     this.pick(this.events),
      mood:      this.pick(this.sampleMoods),
      companion:       this.pick(this.sampleChars),
      moralAttributes: this.pick(this.sampleMorals),
      language:  this.pick(this.sampleLangs)
    };
  }

  submitStory(payload: StorybookPayload): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(this.generatePdfApiUrl, payload);
  }

  getStories(page: number, size: number): Observable<StoriesPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<StoriesPage>(this.storiesApiUrl, { params });
  }

  getStoryById(id: string): Observable<Story> {
    return this.http.get<Story>(`${this.storiesApiUrl}/${id}`);
  }

  downloadStory(id: string): Observable<Blob> {
    return this.http.get(`${this.storiesApiUrl}/${id}/download`, { responseType: 'blob' });
  }
}
