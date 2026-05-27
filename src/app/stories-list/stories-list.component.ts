import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StorybookService, StorybookPayload } from '../storybook-form/storybook.service';
import { AuthService } from '../services/auth.service';
import { Story, StoriesPage } from '../models/story.model';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-stories-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './stories-list.component.html',
  styleUrl: './stories-list.component.css'
})
export class StoriesListComponent implements OnInit {
  stories: Story[] = [];
  loading = true;
  errorMessage = '';
  selectedStory: Story | null = null;
  actionInProgress: string | null = null;
  regenError: string | null = null;
  regenSuccess: string | null = null;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  readonly isAdmin: boolean;

  constructor(
    private readonly storybookService: StorybookService,
    authService: AuthService,
    private readonly router: Router
  ) {
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.loading = true;
    this.errorMessage = '';
    this.storybookService.getStories(this.currentPage, this.pageSize).subscribe({
      next: (page: StoriesPage) => {
        this.stories = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load stories. Please try again.';
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadStories();
  }

  get pageRange(): (number | string)[] {
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }
    const range: (number | string)[] = [];
    const cur = this.currentPage;
    const last = this.totalPages - 1;
    range.push(0);
    if (cur > 2) range.push('...');
    for (let i = Math.max(1, cur - 1); i <= Math.min(last - 1, cur + 1); i++) {
      range.push(i);
    }
    if (cur < last - 2) range.push('...');
    range.push(last);
    return range;
  }

  openDetails(story: Story): void {
    this.selectedStory = story;
  }

  closeDetails(): void {
    this.selectedStory = null;
  }

  downloadStory(story: Story, event: Event): void {
    event.stopPropagation();
    if (this.actionInProgress) return;
    this.actionInProgress = `download-${story.id}`;
    this.storybookService.downloadStory(story.id).subscribe({
      next: (blob: Blob) => {
        this.triggerDownload(blob, `storybook-${story.name}.pdf`);
        this.actionInProgress = null;
      },
      error: () => {
        this.actionInProgress = null;
      }
    });
  }

  regenerateSame(story: Story, event: Event): void {
    event.stopPropagation();
    if (this.actionInProgress) return;
    this.regenError = null;
    this.regenSuccess = null;
    this.actionInProgress = `regen-${story.id}`;
    const payload: StorybookPayload = {
      name: story.name,
      gender: story.gender,
      age: story.age,
      bodyTone: story.bodyTone,
      location: story.location,
      theme: story.theme,
      event: story.event,
      mood: story.mood,
      character: story.character,
      moral: story.moral,
      language: story.language,
      notes: story.notes
    };
    this.storybookService.submitStory(payload).subscribe({
      next: () => {
        this.regenSuccess = `Story for "${story.name}" queued for generation. Refreshing list...`;
        this.actionInProgress = null;
        this.loadStories();
      },
      error: () => {
        this.regenError = `Failed to regenerate story for "${story.name}". Please try again.`;
        this.actionInProgress = null;
      }
    });
  }

  editAndRegenerate(story: Story, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/storybook-form'], { state: { prefill: story } });
  }

  isActing(key: string): boolean {
    return this.actionInProgress === key;
  }

  isNumber(val: number | string): val is number {
    return typeof val === 'number';
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}
