import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Layout, Smartphone, Shield, Terminal, Eye } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

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
  readonly Code       = Code;
  readonly Layout     = Layout;
  readonly Smartphone = Smartphone;
  readonly Shield     = Shield;
  readonly Terminal   = Terminal;
  readonly Eye        = Eye;

  modeService = inject(ModeService);

  devFeatures: Feature[] = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Escribo código legible, mantenible y escalable siguiendo las mejores prácticas de la industria.'
    },
    {
      icon: Layout,
      title: 'Diseño Responsivo',
      description: 'Mis aplicaciones se ven y funcionan perfectamente en cualquier dispositivo, desde móviles hasta pantallas grandes.'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Enfoque prioritario en la experiencia móvil para garantizar el mejor rendimiento y usabilidad.'
    }
  ];

  secFeatures: Feature[] = [
    {
      icon: Shield,
      title: 'Ethical Hacking',
      description: 'Evaluaciones de seguridad ofensiva: pentesting web, red e ingeniería social siguiendo metodologías PTES y OWASP.'
    },
    {
      icon: Terminal,
      title: 'Scripting & Exploit Dev',
      description: 'Desarrollo de exploits, automatización de ataques y herramientas de reconocimiento en Python y Bash.'
    },
    {
      icon: Eye,
      title: 'Threat Intelligence',
      description: 'Análisis de amenazas, OSINT y monitoreo de CVEs para identificar vectores de ataque antes que los atacantes.'
    }
  ];

  get features(): Feature[] {
    return this.modeService.activeMode() === 'dev'
      ? this.devFeatures
      : this.secFeatures;
  }
}
