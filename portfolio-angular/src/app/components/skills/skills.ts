import { Component, signal, computed, inject, OnInit } from '@angular/core';
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
export class SkillsComponent implements OnInit {
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

  get activeMode() { return this.modeService.activeMode; }

  // ─── Estado ────────────────────────────────────────────────────────
  devCategories  = signal<SkillCategory[]>([]);
  secCategories  = signal<SkillCategory[]>([]);
  loading        = signal(false);
  saving         = signal(false);
  saveMsg        = signal('');

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

  // ─── Init: carga desde el backend ──────────────────────────────────
  async ngOnInit() {
    this.loading.set(true);
    try {
      const [dev, sec] = await Promise.all([
        this.data.getSkillCategories('dev'),
        this.data.getSkillCategories('security')
      ]);
      this.devCategories.set(dev);
      this.secCategories.set(sec);
    } catch (e) {
      console.error('Error cargando skills:', e);
    } finally {
      this.loading.set(false);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────
  private showMsg(msg: string) {
    this.saveMsg.set(msg);
    setTimeout(() => this.saveMsg.set(''), 3000);
  }

  private get mode() { return this.modeService.activeMode(); }

  private setLocal(cats: SkillCategory[]) {
    if (this.mode === 'dev') this.devCategories.set(cats);
    else this.secCategories.set(cats);
  }

  setMode(mode: 'dev' | 'security') { this.modeService.setMode(mode); this.cancelAll(); }

  private genId() { return Math.random().toString(36).slice(2, 9); }

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

  // ─── CATEGORY CRUD ─────────────────────────────────────────────────
  startAddCategory() {
    this.requireAuth(() => { this.cancelAll(); this.addingCategory.set(true); });
  }

  async confirmAddCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;
    this.saving.set(true);
    try {
      const saved = await this.data.addSkillCategory(this.mode, { title: name, skills: [] });
      this.setLocal([...this.currentCategories(), saved]);
      this.showMsg('✓ Categoría creada');
    } catch (e) { this.showMsg('✗ Error al crear'); }
    finally { this.saving.set(false); this.cancelAll(); }
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
    } catch (e) { this.showMsg('✗ Error al actualizar'); }
    finally { this.saving.set(false); this.cancelAll(); }
  }

  deleteCategory(catId: string) {
    this.requireAuth(async () => {
      this.saving.set(true);
      try {
        await this.data.deleteSkillCategory(this.mode, catId);
        this.setLocal(this.currentCategories().filter(c => c.id !== catId));
        this.showMsg('✓ Categoría eliminada');
      } catch (e) { this.showMsg('✗ Error al eliminar'); }
      finally { this.saving.set(false); }
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
    const newSkill: Skill = { id: this.genId(), name, level: this.newSkillLevel() };
    const updated: SkillCategory = { ...cat, skills: [...cat.skills, newSkill] };
    this.saving.set(true);
    try {
      await this.data.updateSkillCategory(this.mode, updated);
      this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
      this.showMsg('✓ Skill agregado');
    } catch (e) { this.showMsg('✗ Error al agregar'); }
    finally { this.saving.set(false); this.cancelAll(); }
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
      } catch (e) { this.showMsg('✗ Error al eliminar'); }
      finally { this.saving.set(false); }
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
      skills: cat.skills.map(s => s.id === skillId ? { ...s, name, level: this.newSkillLevel() } : s)
    };
    this.saving.set(true);
    try {
      await this.data.updateSkillCategory(this.mode, updated);
      this.setLocal(this.currentCategories().map(c => c.id === catId ? updated : c));
      this.showMsg('✓ Skill actualizado');
    } catch (e) { this.showMsg('✗ Error al actualizar'); }
    finally { this.saving.set(false); this.cancelAll(); }
  }
}
