import { Component, HostListener, signal, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LucideAngularModule, Menu, X, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../services/theme';

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
  readonly Menu = Menu;
  readonly X    = X;
  readonly Moon = Moon;
  readonly Sun  = Sun;

  isOpen   = signal(false);
  scrolled = signal(false);

  navLinks: NavLink[] = [
    { name: 'Inicio',      href: '#home'     },
    { name: 'Sobre Mí',    href: '#about'    },
    { name: 'Habilidades', href: '#skills'   },
    { name: 'Proyectos',   href: '#projects' },
     { name: 'Servicios',   href: '#services' },
    { name: 'Contacto',    href: '#contact'  },
    { name: 'Incidentes', href: '#incidents' }
  ];

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initTheme();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() { this.isOpen.update(v => !v); }
  closeMenu()  { this.isOpen.set(false); }
}