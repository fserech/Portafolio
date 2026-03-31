import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, MapPin, Send, Phone, Terminal, Shield } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_q93kz0o';
const EMAILJS_TEMPLATE_ID = 'template_hnalhkg';
const EMAILJS_PUBLIC_KEY  = '0YuyY7Zq_sL2hbsMs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent {
  readonly Mail     = Mail;
  readonly MapPin   = MapPin;
  readonly Send     = Send;
  readonly Phone    = Phone;
  readonly Terminal = Terminal;
  readonly Shield   = Shield;

  modeService  = inject(ModeService);
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  formData = { name: '', email: '', message: '' };

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  this.formData.name,
          from_email: this.formData.email,
          message:    this.formData.message,
          to_email:   'serech63@gmail.com',
          reply_to:   this.formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      this.submitStatus.set('success');
      this.formData = { name: '', email: '', message: '' };
      setTimeout(() => this.submitStatus.set('idle'), 5000);

    } catch (error) {
      console.error('EmailJS error:', error);
      this.submitStatus.set('error');
      setTimeout(() => this.submitStatus.set('idle'), 5000);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
