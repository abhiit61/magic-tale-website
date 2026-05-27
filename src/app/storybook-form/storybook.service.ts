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
  character: string;
  moral: string;
  language: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorybookService {
  private readonly generatePdfApiUrl: string;
  private readonly storiesApiUrl: string;

  constructor(private readonly http: HttpClient) {
    this.generatePdfApiUrl = this.buildApiUrl(API_ENDPOINTS.storybook.generatePdf);
    this.storiesApiUrl = this.buildApiUrl(API_ENDPOINTS.storybook.stories);
  }

  private buildApiUrl(endpoint: string): string {
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${endpointPath}`;
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
