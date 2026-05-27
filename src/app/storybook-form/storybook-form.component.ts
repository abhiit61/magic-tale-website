import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { StorybookService } from './storybook.service';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { Story } from '../models/story.model';

@Component({
  selector: 'app-storybook-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent],
  templateUrl: './storybook-form.component.html',
  styleUrl: './storybook-form.component.css'
})
export class StorybookFormComponent implements OnInit {

  storyForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  showSuccessPopup = false;
  showErrorDialog = false;
  errorDialogMessage = '';

  locations: string[] = [
    'Ancient Egypt',
    'Cyberpunk City',
    'Enchanted Forest',
    'Underwater Kingdom',
    'Mountain Realm',
    'Steampunk Metropolis',
    'Desert Oasis',
    'Sky Islands'
  ];

  events: string[] = [
    'Lost Treasure',
    'Royal Coronation',
    'Mysterious Disappearance',
    'Epic Battle',
    'Festival of Lights',
    'Time Travel Accident',
    'Secret Mission',
    'Unexpected Reunion'
  ];
  filteredLocations: string[] = [];
  filteredEvents: string[] = [];
  captchaCode: string = '';
  captchaError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private storybookService: StorybookService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFilters();
    this.filteredEvents = this.events;
    this.filteredLocations = this.locations;
    this.generateCaptcha();
    this.storyForm.get('captcha')?.valueChanges.subscribe(() => {
      this.checkCaptcha();
    });
  }

  initializeForm(): void {
    this.storyForm = this.formBuilder.group({
      hero: this.formBuilder.group({
        name: ['', Validators.required],
        gender: ['', Validators.required],
        age: ['', Validators.required],
        bodyTone: ['']
      }),
      world: this.formBuilder.group({
        location: ['', Validators.required],
        theme: ['', Validators.required],
        event: ['', Validators.required],
        mood: ['', Validators.required]
      }),
      others: this.formBuilder.group({
        character: ['', Validators.required],
        moral: ['', Validators.required],
        language: ['', Validators.required]
      }),
      captcha: ['', Validators.required]
    });

    const prefill = (window.history.state as { prefill?: Story }).prefill;
    if (prefill) {
      this.storyForm.patchValue({
        hero: {
          name: prefill.name,
          gender: prefill.gender,
          age: prefill.age,
          bodyTone: prefill.bodyTone ?? ''
        },
        world: {
          location: prefill.location,
          theme: prefill.theme,
          event: prefill.event,
          mood: prefill.mood
        },
        others: {
          character: prefill.character,
          moral: prefill.moral,
          language: prefill.language
        }
      });
    }
  }

  generateCaptcha(): void {
    this.captchaCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.storyForm.get('captcha')?.setValue('');
    this.captchaError = '';
  }

  checkCaptcha(): void {
    const input = this.storyForm.get('captcha')?.value;
    if (!input) { this.captchaError = ''; return; }
    this.captchaError = input.toUpperCase() !== this.captchaCode
      ? 'Captcha does not match. Please try again.'
      : '';
  }

  get isCaptchaValid(): boolean {
    return this.storyForm.get('captcha')?.value?.toUpperCase() === this.captchaCode;
  }

  setupFilters(): void {
    this.storyForm.get('world.location')?.valueChanges.subscribe(value => {
      this.filteredLocations = this.locations.filter(loc =>
        loc.toLowerCase().includes((value || '').toLowerCase())
      );
    });
    this.storyForm.get('world.event')?.valueChanges.subscribe(value => {
      this.filteredEvents = this.events.filter(ev =>
        ev.toLowerCase().includes((value || '').toLowerCase())
      );
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.submitError = '';
    this.showSuccessPopup = false;
    this.checkCaptcha();

    if (!this.isCaptchaValid) {
      this.captchaError = 'Captcha does not match. Please try again.';
      this.storyForm.markAllAsTouched();
      return;
    }

    if (!this.storyForm.valid) {
      this.storyForm.markAllAsTouched();
      return;
    }

    const formValue = this.storyForm.value;
    const payload = { ...formValue.hero, ...formValue.world, ...formValue.others };

    this.isSubmitting = true;
    this.storyForm.disable({ emitEvent: false });

    this.storybookService.submitStory(payload)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.storyForm.enable({ emitEvent: false });
      }))
      .subscribe({
        next: () => {
          this.showSuccessPopup = true;
          this.generateCaptcha();
        },
        error: (_error: HttpErrorResponse) => {
          this.errorDialogMessage = 'Something went wrong while submitting your story. Please try again.';
          this.showErrorDialog = true;
        }
      });
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
    this.errorDialogMessage = '';
  }

  goToMyStories(): void {
    this.router.navigate(['/my-stories']);
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.submitError = '';
    this.captchaError = '';
    this.storyForm.reset({
      hero: { name: '', gender: '', age: '', bodyTone: '' },
      world: { location: '', theme: '', event: '', mood: '' },
      others: { character: '', moral: '', language: '' },
      captcha: ''
    });
    this.storyForm.markAsPristine();
    this.storyForm.markAsUntouched();
    this.generateCaptcha();
    this.filteredLocations = this.locations;
    this.filteredEvents = this.events;
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  }
}
