import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navItems = [
    { path: '/#about', label: 'SOBRE MI' },
    { path: '/#experience', label: 'EXPERIENCIA' },
    { path: '/#skills', label: 'HABILIDADES' },
    { path: '/#education', label: 'EDUCACION' },
    { path: '/#projects', label: 'PROYECTOS' }
  ];
}
