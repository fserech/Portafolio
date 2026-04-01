// src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ─── Estado ───────────────────────────────────────────────────────────
  private _isAuthenticated = signal(false);
  private _sessionPin      = signal<string | null>(null);

  // Solo lectura para los componentes
  isAuthenticated = computed(() => this._isAuthenticated());
  isEditMode      = computed(() => this._isAuthenticated()); // alias semántico

  constructor(private http: HttpClient) {
    // Recuperar sesión de sessionStorage al refrescar la página
    // sessionStorage se borra al cerrar el navegador (más seguro que localStorage)
    const saved = sessionStorage.getItem('portfolio_auth');
    if (saved === 'true') {
      const pin = sessionStorage.getItem('portfolio_pin');
      if (pin) {
        this._isAuthenticated.set(true);
        this._sessionPin.set(pin);
      }
    }
  }

  // ─── Login: verifica PIN contra el servidor ────────────────────────────
  async login(pin: string): Promise<{ ok: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ ok: boolean; message: string }>(
          `${environment.apiUrl}/auth/verify`,
          { pin }
        )
      );
      if (res.ok) {
        this._isAuthenticated.set(true);
        this._sessionPin.set(pin);
        sessionStorage.setItem('portfolio_auth', 'true');
        sessionStorage.setItem('portfolio_pin', pin);
      }
      return res;
    } catch (err: any) {
      const msg = err?.error?.message ?? 'PIN incorrecto';
      return { ok: false, message: msg };
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────
  logout() {
    this._isAuthenticated.set(false);
    this._sessionPin.set(null);
    sessionStorage.removeItem('portfolio_auth');
    sessionStorage.removeItem('portfolio_pin');
  }

  // ─── Expone el PIN para adjuntarlo en headers (solo internamente) ──────
  getPin(): string | null {
    return this._sessionPin();
  }
}
