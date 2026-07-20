import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ExternalLink, Github, Plus, X, Edit2, Check, Shield, Code2, Terminal, Lock } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { AuthService } from '../../services/auth.service';
import { EditGuardService } from '../../services/edit-guard.service';
import { DataService, Project } from '../../services/data.service';

export type { Project };

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
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

  private data      = inject(DataService);
  private auth      = inject(AuthService);
  private editGuard = inject(EditGuardService);
  modeService       = inject(ModeService);

  // El sitio ahora es estático (sin backend de escritura): se ocultan
  // los controles de edición en vivo. Para actualizar contenido, edita
  // src/assets/data/projects.json y vuelve a desplegar.
  readonly readOnly = true;

  get activeMode() { return this.modeService.activeMode; }

  // ─── Estado ────────────────────────────────────────────────────────
  devProjects = signal<Project[]>([]);
  secProjects = signal<Project[]>([]);
  loading     = signal(false);
  saving      = signal(false);
  saveMsg     = signal('');

  editingId = signal<string | null>(null);
  addingNew  = signal(false);
  tagInput   = '';

  emptyProject = (): Omit<Project, 'id'> => ({
    title: '', description: '', tags: [],
    image: '', demoUrl: '', repoUrl: '',
    status: 'active', cve: ''
  });

  editDraft = signal<Omit<Project, 'id'>>(this.emptyProject());

  currentProjects = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devProjects() : this.secProjects()
  );

  // ─── Polling para tiempo real ──────────────────────────────────────
  private pollInterval: any;
  private onFocus = () => this.reloadAll();

  async ngOnInit() {
    await this.reloadAll();

    // Polling cada 30 segundos
    this.pollInterval = setInterval(() => this.reloadAll(), 30_000);

    // Recarga al volver a la pestaña
    window.addEventListener('focus', this.onFocus);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
    window.removeEventListener('focus', this.onFocus);
  }

  // ─── Carga ambos modos en paralelo ────────────────────────────────
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

  // ─── Helpers ───────────────────────────────────────────────────────
  private showMsg(msg: string) {
    this.saveMsg.set(msg);
    setTimeout(() => this.saveMsg.set(''), 3000);
  }

  setMode(mode: 'dev' | 'security') {
    this.modeService.setMode(mode);
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingId.set(null);
    this.addingNew.set(false);
    this.tagInput = '';
    this.editDraft.set(this.emptyProject());
  }

  private requireAuth(action: () => void) {
    if (this.auth.isAuthenticated()) action();
    else this.editGuard.requestLogin(action);
  }

  // ─── CRUD ──────────────────────────────────────────────────────────
  startAdd() {
    this.requireAuth(() => {
      this.cancelEdit();
      this.addingNew.set(true);
    });
  }

  startEdit(project: Project) {
    this.requireAuth(() => {
      this.cancelEdit();
      this.editingId.set(project.id);
      this.editDraft.set({ ...project });
    });
  }

  async deleteProject(id: string) {
    this.requireAuth(async () => {
      this.saving.set(true);
      try {
        await this.data.deleteProject(this.modeService.activeMode(), id);
        // Actualizar local inmediatamente
        if (this.modeService.activeMode() === 'dev') {
          this.devProjects.set(this.devProjects().filter(p => p.id !== id));
        } else {
          this.secProjects.set(this.secProjects().filter(p => p.id !== id));
        }
        this.showMsg('✓ Proyecto eliminado');
      } catch (e) {
        console.error(e);
        this.showMsg('✗ Error al eliminar');
      } finally {
        this.saving.set(false);
      }
    });
  }

  async confirmSave() {
    const draft = this.editDraft();
    if (!draft.title.trim()) return;

    this.saving.set(true);
    const mode = this.modeService.activeMode();

    try {
      if (this.addingNew()) {
        // POST sin ID — json-server genera uno único automáticamente
        const saved = await this.data.addProject(mode, draft);
        if (mode === 'dev') this.devProjects.set([...this.devProjects(), saved]);
        else this.secProjects.set([...this.secProjects(), saved]);
        this.showMsg('✓ Proyecto agregado');
      } else {
        // PUT con ID existente
        const id = this.editingId()!;
        const updated = await this.data.updateProject(mode, { id, ...draft });
        if (mode === 'dev') {
          this.devProjects.set(this.devProjects().map(p => p.id === id ? updated : p));
        } else {
          this.secProjects.set(this.secProjects().map(p => p.id === id ? updated : p));
        }
        this.showMsg('✓ Proyecto guardado');
      }
      this.cancelEdit();
    } catch (e) {
      console.error(e);
      this.showMsg('✗ Error al guardar');
    } finally {
      this.saving.set(false);
    }
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
