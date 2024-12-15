import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMailForward } from '@fortawesome/free-solid-svg-icons';
import { ContactForm } from '@/core/models/contact.interface';
import { ContactService } from '@/core/services/contact.service';

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
  statusMessage = '';
  isSuccess = false;
  userInput: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private contactService: ContactService) { }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  checkRequired() {
    if (this.userInput.email && this.userInput.message && this.userInput.name) {
      this.error = { ...this.error, required: false };
    }
  }

  private resetForm() {
    this.userInput = {
      name: '',
      email: '',
      message: ''
    };
    this.error = { email: false, required: false };
  }

  private showMessage(message: string, success: boolean) {
    this.statusMessage = message;
    this.isSuccess = success;
    if (success) {
      setTimeout(() => {
        this.statusMessage = '';
      }, 5000); // Clear success message after 5 seconds
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
    this.statusMessage = '';
    
    try {
      this.isLoading = true;
      const result = await this.contactService.sendMessage(this.userInput);
      
      if (result.success) {
        this.showMessage('Message sent successfully!', true);
        this.resetForm();
      } else {
        this.showMessage('Failed to send message. Please try again.', false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      this.showMessage('An error occurred while sending the message. Please try again.', false);
    } finally {
      this.isLoading = false;
    }
  }
}