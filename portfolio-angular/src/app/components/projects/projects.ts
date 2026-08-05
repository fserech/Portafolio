import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ExternalLink, Github } from 'lucide-angular';
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

  private data = inject(DataService);

  projects = signal<Project[]>([]);

  private pollInterval: any;
  private onFocus = () => this.reload();

  async ngOnInit() {
    await this.reload();
    this.pollInterval = setInterval(() => this.reload(), 30_000);
    window.addEventListener('focus', this.onFocus);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
    window.removeEventListener('focus', this.onFocus);
  }

  private async reload() {
    try {
      this.projects.set(await this.data.getProjects());
    } catch (e) {
      console.error('Error cargando proyectos:', e);
    }
  }
}