import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ExternalLink, Github } from 'lucide-angular';

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl: string;
  repoUrl: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent {
  readonly ExternalLink = ExternalLink;
  readonly Github = Github;

  projects: Project[] = [
    {
      title: 'Dashboard Analítico',
      description: 'Un panel de control administrativo completo con gráficos interactivos, tablas de datos y gestión de usuarios. Optimizado para rendimiento y accesibilidad.',
      tags: ['Angular', 'Tailwind CSS', 'Recharts', 'TypeScript'],
      image: 'https://images.unsplash.com/photo-1641567535859-c58187ac4954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      demoUrl: '#',
      repoUrl: '#'
    },
    {
      title: 'E-commerce Moderno',
      description: 'Tienda en línea con carrito de compras, pasarela de pago simulada y filtrado avanzado de productos. Diseño totalmente responsivo.',
      tags: ['Angular', 'RxJS', 'Stripe API', 'SCSS'],
      image: 'https://images.unsplash.com/photo-1661870139279-95fecab7c53a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      demoUrl: '#',
      repoUrl: '#'
    },
    {
      title: 'Landing Page Corporativa',
      description: 'Página de aterrizaje de alta conversión para una startup tecnológica. Incluye animaciones suaves y formularios integrados.',
      tags: ['Angular', 'Animations', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1561291349-2f23e640ac9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      demoUrl: '#',
      repoUrl: '#'
    }
  ];
}
