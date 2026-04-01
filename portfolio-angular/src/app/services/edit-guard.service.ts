import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EditGuardService {
  // Emite true cuando algún componente necesita que se abra el login
  readonly loginRequested = signal(false);

  // Acción pendiente a ejecutar tras login exitoso
  private pendingAction: (() => void) | null = null;

  requestLogin(afterLogin: () => void) {
    this.pendingAction = afterLogin;
    this.loginRequested.set(true);
  }

  consumePending() {
    const action = this.pendingAction;
    this.pendingAction = null;
    this.loginRequested.set(false);
    action?.();
  }

  clearPending() {
    this.pendingAction = null;
    this.loginRequested.set(false);
  }
}
