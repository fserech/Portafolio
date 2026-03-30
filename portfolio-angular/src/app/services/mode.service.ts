import { Injectable, signal } from '@angular/core';

export type ProfileMode = 'dev' | 'security';

@Injectable({ providedIn: 'root' })
export class ModeService {
  activeMode = signal<ProfileMode>('dev');

  setMode(mode: ProfileMode) {
    this.activeMode.set(mode);
  }
}
