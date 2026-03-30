import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, MapPin, Send, Phone, Terminal, Shield } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

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

  formData = { name: '', email: '', message: '' };

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      alert('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.');
      this.formData = { name: '', email: '', message: '' };
    }, 1500);
  }
}
