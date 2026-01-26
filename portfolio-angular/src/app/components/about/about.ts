import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Layout, Smartphone } from 'lucide-angular';

interface Feature {
  icon: any;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent {
  readonly Code = Code;
  readonly Layout = Layout;
  readonly Smartphone = Smartphone;

  features: Feature[] = [
    {
      icon: this.Code,
      title: 'Clean Code',
      description: 'Escribo código legible, mantenible y escalable siguiendo las mejores prácticas de la industria.'
    },
    {
      icon: this.Layout,
      title: 'Diseño Responsivo',
      description: 'Mis aplicaciones se ven y funcionan perfectamente en cualquier dispositivo, desde móviles hasta pantallas grandes.'
    },
    {
      icon: this.Smartphone,
      title: 'Mobile First',
      description: 'Enfoque prioritario en la experiencia móvil para garantizar el mejor rendimiento y usabilidad.'
    }
  ];
}
