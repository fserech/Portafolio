import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ExternalLink, Github, Plus, X, Edit2, Check, Shield, Code2, Terminal, Lock } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { StorageService } from '../../services/storage.service';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl: string;
  repoUrl: string;
  status?: 'active' | 'classified' | 'archived';
  cve?: string;
}

const DEFAULT_DEV_PROJECTS: Project[] = [
  {
    id: 'dp1',
    title: 'Dashboard Analítico',
    description: 'Panel de control administrativo con gráficos interactivos, tablas de datos y gestión de usuarios. Optimizado para rendimiento y accesibilidad.',
    tags: ['Angular', 'Tailwind CSS', 'TypeScript', 'Recharts'],
    image: 'https://images.unsplash.com/photo-1641567535859-c58187ac4954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#'
  },
  {
    id: 'dp2',
    title: 'E-commerce Moderno',
    description: 'Tienda en línea con carrito de compras, pasarela de pago simulada y filtrado avanzado de productos. Diseño totalmente responsivo.',
    tags: ['Angular', 'RxJS', 'Stripe API', 'SCSS'],
    image: 'https://images.unsplash.com/photo-1661870139279-95fecab7c53a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#'
  },
  {
    id: 'dp3',
    title: 'Landing Page Corporativa',
    description: 'Página de aterrizaje de alta conversión para una startup tecnológica. Incluye animaciones suaves y formularios integrados.',
    tags: ['Angular', 'Animations', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1561291349-2f23e640ac9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#'
  }
];

const DEFAULT_SEC_PROJECTS: Project[] = [
  {
    id: 'sp1',
    title: 'Web Vuln Scanner',
    description: 'Herramienta automatizada para detección de vulnerabilidades OWASP Top 10. Reportes en JSON/HTML con severidad CVSS.',
    tags: ['Python', 'Nmap', 'OWASP', 'Burp Suite'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#',
    status: 'active', cve: 'CVE-2023-XXXX'
  },
  {
    id: 'sp2',
    title: 'Network Traffic Analyzer',
    description: 'Captura y análisis en tiempo real de tráfico de red. Detección de patrones anómalos y alertas automáticas via Slack.',
    tags: ['Wireshark', 'Python', 'Scapy', 'ELK Stack'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#',
    status: 'active'
  },
  {
    id: 'sp3',
    title: 'CTF Write-ups Repository',
    description: 'Colección documentada de resoluciones de CTF. Categorizado por tipo: crypto, forensics, pwn, web, reversing.',
    tags: ['CTF', 'Crypto', 'Forensics', 'Pwn'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    demoUrl: '#', repoUrl: '#',
    status: 'archived'
  }
];

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent {
  readonly ExternalLink = ExternalLink;
  readonly Github       = Github;
  readonly Plus         = Plus;
  readonly X            = X;
  readonly Edit2        = Edit2;
  readonly Check        = Check;
  readonly Shield       = Shield;
  readonly Code2        = Code2;
  readonly Terminal     = Terminal;
  readonly Lock         = Lock;

  private storage = inject(StorageService);
  modeService     = inject(ModeService);

  // Alias para compatibilidad con el template existente
  get activeMode() { return this.modeService.activeMode; }

  // ─── Edit state ──────────────────────────────────────────────────────
  editingId = signal<string | null>(null);
  addingNew  = signal(false);
  tagInput   = '';

  emptyProject = (): Omit<Project, 'id'> => ({
    title: '', description: '', tags: [],
    image: '', demoUrl: '', repoUrl: '',
    status: 'active', cve: ''
  });

  editDraft = signal<Omit<Project, 'id'>>(this.emptyProject());

  // ─── Datos con persistencia ──────────────────────────────────────────
  devProjects = signal<Project[]>(
    this.storage.get<Project[]>('portfolio_dev_projects', DEFAULT_DEV_PROJECTS)
  );

  secProjects = signal<Project[]>(
    this.storage.get<Project[]>('portfolio_sec_projects', DEFAULT_SEC_PROJECTS)
  );

  constructor() {
    // Persistir automáticamente cada vez que cambien
    effect(() => {
      this.storage.set('portfolio_dev_projects', this.devProjects());
    });
    effect(() => {
      this.storage.set('portfolio_sec_projects', this.secProjects());
    });
  }

  // ─── Computed ────────────────────────────────────────────────────────
  currentProjects = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devProjects() : this.secProjects()
  );

  setMode(mode: 'dev' | 'security') { this.modeService.setMode(mode); this.cancelEdit(); }

  private genId() { return Math.random().toString(36).slice(2, 9); }

  private updateProjects(projects: Project[]) {
    if (this.modeService.activeMode() === 'dev') this.devProjects.set(projects);
    else this.secProjects.set(projects);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.addingNew.set(false);
    this.tagInput = '';
    this.editDraft.set(this.emptyProject());
  }

  startAdd()  { this.cancelEdit(); this.addingNew.set(true); }

  startEdit(project: Project) {
    this.cancelEdit();
    this.editingId.set(project.id);
    this.editDraft.set({ ...project });
  }

  deleteProject(id: string) {
    this.updateProjects(this.currentProjects().filter(p => p.id !== id));
  }

  addTag() {
    const t = this.tagInput.trim();
    if (!t) return;
    const draft = this.editDraft();
    this.editDraft.set({ ...draft, tags: [...draft.tags, t] });
    this.tagInput = '';
  }

  removeTag(tag: string) {
    const draft = this.editDraft();
    this.editDraft.set({ ...draft, tags: draft.tags.filter(t => t !== tag) });
  }

  confirmSave() {
    const draft = this.editDraft();
    if (!draft.title.trim()) return;
    if (this.addingNew()) {
      this.updateProjects([...this.currentProjects(), { id: this.genId(), ...draft }]);
    } else {
      this.updateProjects(
        this.currentProjects().map(p =>
          p.id === this.editingId() ? { id: p.id, ...draft } : p
        )
      );
    }
    this.cancelEdit();
  }

  updateDraft(key: keyof Omit<Project, 'id'>, value: string) {
    this.editDraft.set({ ...this.editDraft(), [key]: value });
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
