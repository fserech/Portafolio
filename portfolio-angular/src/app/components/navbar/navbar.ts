import { Component, HostListener, signal, OnInit, inject } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { LucideAngularModule, Menu, X, Moon, Sun, Code2, Shield } from 'lucide-angular';
import { ThemeService } from '../../services/theme';
import { ModeService } from '../../services/mode.service';

interface NavLink {
  name: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: '0', overflow: 'hidden' }),
        animate('200ms ease-out', style({ height: '*', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: '1', overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: '0', opacity: '0' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  readonly Menu   = Menu;
  readonly X      = X;
  readonly Moon   = Moon;
  readonly Sun    = Sun;
  readonly Code2  = Code2;
  readonly Shield = Shield;

  isOpen  = signal(false);
  scrolled = signal(false);

  navLinks: NavLink[] = [
    { name: 'Inicio',      href: '#home'     },
    { name: 'Sobre Mí',   href: '#about'    },
    { name: 'Habilidades', href: '#skills'   },
    { name: 'Proyectos',  href: '#projects' },
    { name: 'Contacto',   href: '#contact'  }
  ];

  constructor(
    public themeService: ThemeService,
    public modeService: ModeService
  ) {}

  ngOnInit() {
    this.themeService.initTheme();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu()  { this.isOpen.update(v => !v); }
  closeMenu()   { this.isOpen.set(false); }

  setMode(mode: 'dev' | 'security') {
    this.modeService.setMode(mode);
    this.closeMenu();
  }
}
