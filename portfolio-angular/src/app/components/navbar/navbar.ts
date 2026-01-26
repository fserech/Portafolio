import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LucideAngularModule, Menu, X, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../services/theme';

interface NavLink {
  name: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  readonly Menu = Menu;
  readonly X = X;
  readonly Moon = Moon;
  readonly Sun = Sun;

  isOpen = signal(false);
  scrolled = signal(false);

  navLinks: NavLink[] = [
    { name: 'Inicio', href: '#home' },
    { name: 'Sobre Mí', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Contacto', href: '#contact' }
  ];

  constructor(public themeService: ThemeService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.isOpen.update(value => !value);
  }

  closeMenu() {
    this.isOpen.set(false);
  }
}
