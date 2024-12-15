import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMailForward } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ContactForm } from '@/core/models/contact.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  mailIcon = faMailForward;
  error = { email: false, required: false };
  isLoading = false;
  userInput: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private http: HttpClient) { }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  checkRequired() {
    if (this.userInput.email && this.userInput.message && this.userInput.name) {
      this.error = { ...this.error, required: false };
    }
  }

  async handleSendMail(e: Event) {
    e.preventDefault();

    if (!this.userInput.email || !this.userInput.message || !this.userInput.name) {
      this.error = { ...this.error, required: true };
      return;
    } else if (this.error.email) {
      return;
    }

    this.error = { ...this.error, required: false };

    try {
      this.isLoading = true;
      await this.http.post('/api/contact', this.userInput).toPromise();
      // You might want to add a toast notification here
      this.userInput = {
        name: '',
        email: '',
        message: ''
      };
    } catch (error) {
      // Handle error (maybe show toast)
      console.error('Failed to send message:', error);
    } finally {
      this.isLoading = false;
    }
  }
}