import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { StorybookService } from './storybook.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-storybook-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule],
  templateUrl: './storybook-form.component.html',
  styleUrl: './storybook-form.component.css'
})
export class StorybookFormComponent implements OnInit, OnDestroy {

  storyForm!: FormGroup;
    isSubmitting = false;
    submitError = '';
    generatedPdfUrl: string | null = null;
    isPdfReady = false;
    showSuccessPopup = false;
    showErrorDialog = false;
    errorDialogMessage = '';
    generationProgress = 0;
    private progressTimer: ReturnType<typeof setInterval> | null = null;
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
  
    constructor(private formBuilder: FormBuilder, private storybookService: StorybookService, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
  
    ngOnInit(): void {
      this.initializeForm();
      this.setupFilters();
      this.filteredEvents = this.events;
      this.filteredLocations = this.locations;
      this.generateCaptcha();
      // Listen for captcha input changes
      this.storyForm.get('captcha')?.valueChanges.subscribe(() => {
        this.checkCaptcha();
      });
    }

    ngOnDestroy(): void {
      this.stopProgressSimulation();
      this.cleanupGeneratedPdfUrl();
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
    }
  
    generateCaptcha(): void {
      this.captchaCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.storyForm.get('captcha')?.setValue('');
      this.captchaError = '';
    }
  
    checkCaptcha(): void {
      const input = this.storyForm.get('captcha')?.value;
      if (!input) {
        this.captchaError = '';
        return;
      }
      if (input.toUpperCase() !== this.captchaCode) {
        this.captchaError = 'Captcha does not match. Please try again.';
      } else {
        this.captchaError = '';
      }
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
      if (this.isSubmitting) {
        return;
      }

      this.submitError = '';
      this.isPdfReady = false;
      this.showSuccessPopup = false;
      this.cleanupGeneratedPdfUrl();
      this.checkCaptcha();
      if (!this.isCaptchaValid) {
        this.captchaError = 'Captcha does not match. Please try again.';
        this.storyForm.markAllAsTouched();
        return;
      }
      if (this.storyForm.valid) {
        const formValue = this.storyForm.value;
        const flattenedPayload = {
          ...formValue.hero,
          ...formValue.world,
          ...formValue.others
        };

        this.isSubmitting = true;
        this.startProgressSimulation();
        this.storyForm.disable({ emitEvent: false });
        this.storybookService.generateStorybookPdf(flattenedPayload)
          .pipe(finalize(() => {
            this.isSubmitting = false;
            this.stopProgressSimulation();
            this.storyForm.enable({ emitEvent: false });
          }))
          .subscribe({
            next: (pdfBlob: Blob) => {
              this.generationProgress = 100;
              console.log('PDF generation completed');
              console.log(pdfBlob);
              this.generatedPdfUrl = URL.createObjectURL(pdfBlob);
              console.log(this.generatedPdfUrl);
              this.isPdfReady = true;
              this.showSuccessPopup = true;

              this.generateCaptcha();
            },
            error: (_error: HttpErrorResponse) => {
              this.errorDialogMessage = 'Something went wrong while generating your storybook. Please try again after a few minutes.';
              this.showErrorDialog = true;
            }
          });
      } else {
        this.storyForm.markAllAsTouched();
        console.log('Form is invalid');
      }
    }

    downloadGeneratedPdf(): void {
      const url = this.generatedPdfUrl;
      this.generatedPdfUrl = null; // prevent closeSuccessPopup from revoking it
      this.closeSuccessPopup();
      if (!url) {
        return;
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = 'storybook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    closeErrorDialog(): void {
      this.showErrorDialog = false;
      this.errorDialogMessage = '';
    }

    closeSuccessPopup(): void {
      this.showSuccessPopup = false;
      this.stopProgressSimulation();
      this.generationProgress = 0;
      this.isSubmitting = false;
      this.isPdfReady = false;
      this.submitError = '';
      this.captchaError = '';
      this.cleanupGeneratedPdfUrl();
      this.storyForm.reset();
      this.storyForm.reset({
        hero: {
          name: '',
          gender: '',
          age: '',
          bodyTone: ''
        },
        world: {
          location: '',
          theme: '',
          event: '',
          mood: ''
        },
        others: {
          character: '',
          moral: '',
          language: ''
        },
        captcha: ''
      });
      this.storyForm.markAsPristine();
      this.storyForm.markAsUntouched();
      this.generateCaptcha();
      this.filteredLocations = this.locations;
      this.filteredEvents = this.events;
      setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
    }

    private startProgressSimulation(): void {
      this.stopProgressSimulation();
      this.generationProgress = 10;
      this.progressTimer = setInterval(() => {
        if (this.generationProgress < 90) {
          this.generationProgress += 5;
        }
      }, 300);
    }

    private stopProgressSimulation(): void {
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      }
    }

    private cleanupGeneratedPdfUrl(): void {
      if (this.generatedPdfUrl) {
        URL.revokeObjectURL(this.generatedPdfUrl);
        this.generatedPdfUrl = null;
      }
    }

}
