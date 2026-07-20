import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, X, Edit2, Check, Shield, Code2, ChevronRight } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { AuthService } from '../../services/auth.service';
import { EditGuardService } from '../../services/edit-guard.service';
import { DataService, SkillCategory, Skill } from '../../services/data.service';

export type { Skill, SkillCategory };

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {
  readonly Plus         = Plus;
  readonly X            = X;
  readonly Edit2        = Edit2;
  readonly Check        = Check;
  readonly Shield       = Shield;
  readonly Code2        = Code2;
  readonly ChevronRight = ChevronRight;

  private data      = inject(DataService);
  private auth      = inject(AuthService);
  private editGuard = inject(EditGuardService);
  modeService       = inject(ModeService);

  // El sitio ahora es estático (sin backend de escritura): se ocultan
  // los controles de edición en vivo. Para actualizar contenido, edita
  // src/assets/data/skills.json y vuelve a desplegar.
  readonly readOnly = true;

  get activeMode() { return this.modeService.activeMode; }

  // ─── Estado ────────────────────────────────────────────────────────
  devCategories = signal<SkillCategory[]>([]);
  secCategories = signal<SkillCategory[]>([]);
  loading       = signal(false);
  saving        = signal(false);
  saveMsg       = signal('');

  editingCategoryId     = signal<string | null>(null);
  editingSkillId        = signal<string | null>(null);
  newSkillName          = signal('');
  newSkillLevel         = signal(80);
  newCategoryName       = signal('');
  addingSkillInCategory = signal<string | null>(null);
  addingCategory        = signal(false);
  editCategoryName      = signal('');

  currentCategories = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devCategories() : this.secCategories()
  );

  // ─── Polling para tiempo real ──────────────────────────────────────
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
        this.data.getSkillCategories('dev'),
        this.data.getSkillCategories('security')
      ]);
      this.devCategories.set(dev);
      this.secCategories.set(sec);
    } catch (e) {
      console.error('Error cargando skills:', e);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────
  private showMsg(msg: string) {
    this.saveMsg.set(msg);
    setTimeout(() => this.saveMsg.set(''), 3000);
  }

  private get mode() { return this.modeService.activeMode(); }

  private genSkillId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  }

  setMode(mode: 'dev' | 'security') { this.modeService.setMode(mode); this.cancelAll(); }

  private requireAuth(action: () => void) {
    if (this.auth.isAuthenticated()) action();
    else this.editGuard.requestLogin(action);
  }

  cancelAll() {
    this.editingCategoryId.set(null);
    this.editingSkillId.set(null);
    this.addingSkillInCategory.set(null);
    this.addingCategory.set(false);
    this.newSkillName.set('');
    this.newCategoryName.set('');
    this.editCategoryName.set('');
  }

  private setLocal(cats: SkillCategory[]) {
    if (this.mode === 'dev') this.devCategories.set(cats);
    else this.secCategories.set(cats);
  }

  // ─── CATEGORY CRUD ─────────────────────────────────────────────────
  startAddCategory() {
    this.requireAuth(() => { this.cancelAll(); this.addingCategory.set(true); });
  }

  async confirmAddCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;
    this.saving.set(true);
    try {
      // POST sin ID — json-server genera uno único
      const saved = await this.data.addSkillCategory(this.mode, { title: name, skills: [] });
      this.setLocal([...this.currentCategories(), saved]);
      this.showMsg('✓ Categoría creada');
    } catch (e) {
      console.error(e);
      this.showMsg('✗ Error al crear');
    } finally {
      this.saving.set(false);
      this.cancelAll();
    }
  }

  startEditCategory(cat: SkillCategory) {
    this.requireAuth(() => {
      this.cancelAll();
      this.editingCategoryId.set(cat.id);
      this.editCategoryName.set(cat.title);
    });
  }

  async confirmEditCategory(catId: string) {
    const name = this.editCategoryName().trim();
    if (!name) return;
    const cat = this.currentCategories().find(c => c.id === catId)!;
    const updated = { ...cat, title: name };
    this.saving.set(true);
    try {
      await this.data.updateSkillCategory(this.mode, updated);
      this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
      this.showMsg('✓ Categoría actualizada');
    } catch (e) {
      console.error(e);
      this.showMsg('✗ Error al actualizar');
    } finally {
      this.saving.set(false);
      this.cancelAll();
    }
  }

  deleteCategory(catId: string) {
    this.requireAuth(async () => {
      this.saving.set(true);
      try {
        await this.data.deleteSkillCategory(this.mode, catId);
        this.setLocal(this.currentCategories().filter(c => c.id !== catId));
        this.showMsg('✓ Categoría eliminada');
      } catch (e) {
        console.error(e);
        this.showMsg('✗ Error al eliminar');
      } finally {
        this.saving.set(false);
      }
    });
  }

  // ─── SKILL CRUD ────────────────────────────────────────────────────
  startAddSkill(catId: string) {
    this.requireAuth(() => {
      this.cancelAll();
      this.addingSkillInCategory.set(catId);
      this.newSkillName.set('');
      this.newSkillLevel.set(80);
    });
  }

  async confirmAddSkill(catId: string) {
    const name = this.newSkillName().trim();
    if (!name) return;
    const cat = this.currentCategories().find(c => c.id === catId)!;
    // Las skills son objetos anidados dentro de la categoría
    // Generamos ID único para la skill y hacemos PUT en la categoría
    const newSkill: Skill = { id: this.genSkillId(), name, level: this.newSkillLevel() };
    const updated: SkillCategory = { ...cat, skills: [...cat.skills, newSkill] };
    this.saving.set(true);
    try {
      await this.data.updateSkillCategory(this.mode, updated);
      this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
      this.showMsg('✓ Skill agregado');
    } catch (e) {
      console.error(e);
      this.showMsg('✗ Error al agregar');
    } finally {
      this.saving.set(false);
      this.cancelAll();
    }
  }

  deleteSkill(catId: string, skillId: string) {
    this.requireAuth(async () => {
      const cat = this.currentCategories().find(c => c.id === catId)!;
      const updated: SkillCategory = { ...cat, skills: cat.skills.filter(s => s.id !== skillId) };
      this.saving.set(true);
      try {
        await this.data.updateSkillCategory(this.mode, updated);
        this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
        this.showMsg('✓ Skill eliminado');
      } catch (e) {
        console.error(e);
        this.showMsg('✗ Error al eliminar');
      } finally {
        this.saving.set(false);
      }
    });
  }

  startEditSkill(skill: Skill) {
    this.requireAuth(() => {
      this.cancelAll();
      this.editingSkillId.set(skill.id);
      this.newSkillName.set(skill.name);
      this.newSkillLevel.set(skill.level ?? 80);
    });
  }

  async confirmEditSkill(catId: string, skillId: string) {
    const name = this.newSkillName().trim();
    if (!name) return;
    const cat = this.currentCategories().find(c => c.id === catId)!;
    const updated: SkillCategory = {
      ...cat,
      skills: cat.skills.map(s =>
        s.id === skillId ? { ...s, name, level: this.newSkillLevel() } : s
      )
    };
    this.saving.set(true);
    try {
      await this.data.updateSkillCategory(this.mode, updated);
      this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
      this.showMsg('✓ Skill actualizado');
    } catch (e) {
      console.error(e);
      this.showMsg('✗ Error al actualizar');
    } finally {
      this.saving.set(false);
      this.cancelAll();
    }
  }
}
