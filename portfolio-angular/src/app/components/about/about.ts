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
      title: 'Seguridad de Infraestructura',
      description: 'Administración de firewalls FortiGate, segmentación de redes y configuración de VLANs y VPNs en entornos empresariales.'
    },
    {
      icon: Terminal,
      title: 'Administración de Servidores',
      description: 'Instalación y gestión de Windows Server con Active Directory, así como servidores Linux (Ubuntu, Debian) en producción.'
    },
    {
      icon: Eye,
      title: 'Análisis de Seguridad',
      description: 'Monitoreo de redes con FortiAnalyzer, análisis de tráfico y detección de amenazas en infraestructuras corporativas.'
    }
  ];

  get features(): Feature[] {
    return this.modeService.activeMode() === 'dev'
      ? this.devFeatures
      : this.secFeatures;
  }
}
