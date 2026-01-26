import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    // Leer preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    this.darkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

    effect(() => {
      if (this.darkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.darkMode.update(value => !value);
  }
}
