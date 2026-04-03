import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Code, Layout, Smartphone, Shield, Terminal, Eye } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

interface Feature {
  icon: any;
  title: string;
  description: string;
}

interface AboutContent {
  id: string;
  mode: string;
  sectionTitle: string;
  sectionSubtitle: string;
  bannerTitle: string;
  bannerText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {
  readonly Code       = Code;
  readonly Layout     = Layout;
  readonly Smartphone = Smartphone;
  readonly Shield     = Shield;
  readonly Terminal   = Terminal;
  readonly Eye        = Eye;

  modeService = inject(ModeService);
  private http = inject(HttpClient);

  private readonly API = 'https://portfolio-backend-fredys.vercel.app';

  // Valores por defecto mientras carga
  devContent = signal<AboutContent>({
    id: 'about-dev', mode: 'dev',
    sectionTitle: 'Sobre Mí',
    sectionSubtitle: 'Más que un desarrollador, soy un apasionado por crear soluciones digitales que impactan.',
    bannerTitle: '¿Por qué trabajar conmigo?',
    bannerText: 'Combino habilidades técnicas sólidas con una gran capacidad de trabajo en equipo. Me mantengo actualizado con las últimas tendencias de Angular y el ecosistema web moderno.',
    stat1Value: '3+', stat1Label: 'AÑOS DE EXP.',
    stat2Value: '20+', stat2Label: 'PROYECTOS'
  });

  secContent = signal<AboutContent>({
    id: 'about-security', mode: 'security',
    sectionTitle: '$ whoami',
    sectionSubtitle: '[INFO] Cargando perfil de seguridad...',
    bannerTitle: '$ cat motivacion.txt',
    bannerText: 'Profesional en seguridad informática con enfoque en infraestructura y redes empresariales. Creo que la seguridad real se construye desde la arquitectura: segmentación, control de acceso y monitoreo continuo.',
    stat1Value: '3+', stat1Label: 'Años en Seguridad',
    stat2Value: '15+', stat2Label: 'Redes Configuradas'
  });

  get content(): AboutContent {
    return this.modeService.activeMode() === 'dev'
      ? this.devContent()
      : this.secContent();
  }

  ngOnInit() {
    this.http.get<AboutContent>(`${this.API}/about_content/dev`).subscribe({
      next: data => this.devContent.set(data),
      error: err => console.error('Error cargando about dev:', err)
    });
    this.http.get<AboutContent>(`${this.API}/about_content/security`).subscribe({
      next: data => this.secContent.set(data),
      error: err => console.error('Error cargando about security:', err)
    });
  }

  devFeatures: Feature[] = [
    { icon: Code, title: 'Clean Code', description: 'Escribo código legible, mantenible y escalable siguiendo las mejores prácticas de la industria.' },
    { icon: Layout, title: 'Diseño Responsivo', description: 'Mis aplicaciones se ven y funcionan perfectamente en cualquier dispositivo, desde móviles hasta pantallas grandes.' },
    { icon: Smartphone, title: 'Mobile First', description: 'Enfoque prioritario en la experiencia móvil para garantizar el mejor rendimiento y usabilidad.' }
  ];

  secFeatures: Feature[] = [
    { icon: Shield, title: 'Seguridad de Infraestructura', description: 'Administración de firewalls FortiGate, segmentación de redes y configuración de VLANs y VPNs en entornos empresariales.' },
    { icon: Terminal, title: 'Administración de Servidores', description: 'Instalación y gestión de Windows Server con Active Directory, así como servidores Linux (Ubuntu, Debian) en producción.' },
    { icon: Eye, title: 'Análisis de Seguridad', description: 'Monitoreo de redes con FortiAnalyzer, análisis de tráfico y detección de amenazas en infraestructuras corporativas.' }
  ];

  get features(): Feature[] {
    return this.modeService.activeMode() === 'dev'
      ? this.devFeatures
      : this.secFeatures;
  }
}
