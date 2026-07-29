import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ExternalLink, Github, Shield, Code2, Terminal } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { DataService, Project } from '../../services/data.service';

export type { Project };

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  readonly ExternalLink = ExternalLink;
  readonly Github       = Github;
  readonly Shield       = Shield;
  readonly Code2        = Code2;
  readonly Terminal     = Terminal;

  private data = inject(DataService);
  modeService  = inject(ModeService);

  get activeMode() { return this.modeService.activeMode; }

  // ─── Estado ────────────────────────────────────────────────────────
  devProjects = signal<Project[]>([]);
  secProjects = signal<Project[]>([]);
  loading     = signal(false);

  currentProjects = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devProjects() : this.secProjects()
  );

  // ─── Polling opcional para reflejar cambios en el JSON estático ────
  private pollInterval: any;
  private onFocus = () => this.reloadAll();

  async ngOnInit() {
    await this.reloadAll();
    this.pollInterval = setInterval(() => this.reloadAll(), 30_000);
    window.addEventListener('focus', this.onFocus);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
    window.removeEventListener('focus', this.onFocus);
  }

  private async reloadAll() {
    try {
      const [dev, sec] = await Promise.all([
        this.data.getProjects('dev'),
        this.data.getProjects('security')
      ]);
      this.devProjects.set(dev);
      this.secProjects.set(sec);
    } catch (e) {
      console.error('Error cargando proyectos:', e);
    }
  }

  setMode(mode: 'dev' | 'security') {
    this.modeService.setMode(mode);
  }

  getStatusClass(status?: string) {
    switch (status) {
      case 'active':     return 'text-green-400 border-green-500/40 bg-green-900/20';
      case 'classified': return 'text-yellow-400 border-yellow-500/40 bg-yellow-900/20';
      case 'archived':   return 'text-gray-500 border-gray-600/40 bg-gray-800/20';
      default:           return 'text-green-400 border-green-500/40 bg-green-900/20';
    }
  }
}