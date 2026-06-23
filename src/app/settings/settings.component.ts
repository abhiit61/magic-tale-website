import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, API_ENDPOINTS } from '../api-endpoints.config';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  chatModelsAvailability: Record<string, string> | null = null;
    imageModelsAvailability: Record<string, string> | null = null;

  loading = true;
  error: string | null = null;
    loading1 = true;
    error1: string | null = null;

  imageModels = [
    { name: 'Stable Diffusion', status: 'Available', icon: '🖼️', iconClass: 'model-icon--stable' },
    { name: 'DALL·E', status: 'Unavailable', icon: '🎨', iconClass: 'model-icon--dalle' },
    { name: 'Midjourney', status: 'Available', icon: '🌌', iconClass: 'model-icon--midjourney' }
  ];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Record<string, string>>(
        `${API_BASE_URL.replace(/\/$/, '')}${API_ENDPOINTS.models.chatAvailability}`
      )
      .subscribe({
        next: (result) => {
          this.chatModelsAvailability = result;
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load chat model availability. Please try again later.';
          this.loading = false;
        }
      });
      this.http
      .get<Record<string, string>>(
        `${API_BASE_URL.replace(/\/$/, '')}${API_ENDPOINTS.models.imageAvailability}`
      )
      .subscribe({
        next: (result) => {
          this.imageModelsAvailability = result;
          this.loading1 = false;
        },
        error: () => {
          this.error1 = 'Unable to load image model availability. Please try again later.';
          this.loading1 = false;
        }
      });
  }

  getModelIcon(modelName: string): string {
    switch (modelName.toLowerCase()) {
      case 'gemini':
        return 'G';
      case 'anthropic':
        return 'A';
      case 'openai':
        return 'O';
    case 'leonardo':
        return 'L';
      default:
        return modelName.charAt(0).toUpperCase();
    }
  }

  getModelIconClass(modelName: string): string {
    switch (modelName.toLowerCase()) {
      case 'gemini':
        return 'model-icon--gemini';
      case 'anthropic':
        return 'model-icon--anthropic';
      case 'openai':
        return 'model-icon--openai';
      case 'leonardo':
        return 'model-icon--leonardo';
      default:
        return 'model-icon--default';
    }
  }
}
