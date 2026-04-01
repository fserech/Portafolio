import { Component, signal, ViewChild, ElementRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Shield, Eye, EyeOff, AlertCircle } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLogin {
  readonly Shield      = Shield;
  readonly Eye         = Eye;
  readonly EyeOff      = EyeOff;
  readonly AlertCircle = AlertCircle;

  @ViewChild('pinInput') pinInput!: ElementRef<HTMLInputElement>;

  loginSuccess = output<void>();
  loginClose   = output<void>();

  visible      = signal(false);
  showPin      = signal(false);
  loading      = signal(false);
  errorMsg     = signal('');
  attempts     = signal(0);
  isBlocked    = signal(false);
  blockSeconds = signal(0);

  pinValue = '';

  private auth = inject(AuthService);
  private blockTimer: any;

  // ── Método para toggle del ojo (NO usar arrow functions en templates) ──
  toggleShowPin() {
    this.showPin.set(!this.showPin());
  }

  open() {
    this.pinValue = '';
    this.errorMsg.set('');
    this.showPin.set(false);
    this.visible.set(true);
    setTimeout(() => this.pinInput?.nativeElement?.focus(), 100);
  }

  close() {
    this.visible.set(false);
    this.pinValue = '';
    this.errorMsg.set('');
    this.loginClose.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }

  async submit() {
    if (this.isBlocked() || this.loading()) return;

    const pin = this.pinValue.trim();
    if (!pin) {
      this.errorMsg.set('Ingresa tu PIN');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const result = await this.auth.login(pin);

    this.loading.set(false);

    if (result.ok) {
      this.attempts.set(0);
      this.visible.set(false);
      this.pinValue = '';
      this.loginSuccess.emit();
    } else {
      this.attempts.update(n => n + 1);
      this.errorMsg.set(result.message);
      if (this.attempts() >= 3) {
        this.blockUser(30);
      }
    }
  }

  private blockUser(seconds: number) {
    this.isBlocked.set(true);
    this.blockSeconds.set(seconds);
    clearInterval(this.blockTimer);
    this.blockTimer = setInterval(() => {
      this.blockSeconds.update(s => s - 1);
      if (this.blockSeconds() <= 0) {
        clearInterval(this.blockTimer);
        this.isBlocked.set(false);
        this.attempts.set(0);
        this.errorMsg.set('');
      }
    }, 1000);
  }
}
