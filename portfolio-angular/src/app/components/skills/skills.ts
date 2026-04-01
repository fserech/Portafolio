import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, X, Edit2, Check, Shield, Code2, ChevronRight } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { EditGuardService } from '../../services/edit-guard.service';

export interface Skill {
  id: string;
  name: string;
  level?: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

const DEFAULT_DEV_CATEGORIES: SkillCategory[] = [
  {
    id: 'dev-1', title: 'Frontend Core',
    skills: [
      { id: 's1', name: 'Angular',        level: 90 },
      { id: 's2', name: 'TypeScript',      level: 85 },
      { id: 's3', name: 'HTML5',           level: 95 },
      { id: 's4', name: 'CSS3',            level: 90 },
      { id: 's5', name: 'JavaScript ES6+', level: 85 },
    ]
  },
  {
    id: 'dev-2', title: 'Backend',
    skills: [
      { id: 's6', name: 'Spring Boot', level: 75 },
      { id: 's7', name: 'Java',        level: 75 },
      { id: 's8', name: 'MySQL',       level: 70 },
      { id: 's9', name: 'Postman',     level: 85 },
    ]
  },
  {
    id: 'dev-3', title: 'Estilos & UI',
    skills: [
      { id: 's10', name: 'Tailwind CSS', level: 90 },
      { id: 's11', name: 'SASS/SCSS',    level: 80 },
      { id: 's12', name: 'Material UI',  level: 75 },
      { id: 's13', name: 'Bootstrap',    level: 80 },
    ]
  },
  {
    id: 'dev-4', title: 'DevOps & Herramientas',
    skills: [
      { id: 's14', name: 'Docker',     level: 65 },
      { id: 's15', name: 'Git/GitHub', level: 85 },
      { id: 's16', name: 'VS Code',    level: 95 },
      { id: 's17', name: 'Figma',      level: 70 },
    ]
  }
];

const DEFAULT_SEC_CATEGORIES: SkillCategory[] = [
  {
    id: 'sec-1', title: 'Firewalls & Redes',
    skills: [
      { id: 'ss1',  name: 'FortiGate',           level: 85 },
      { id: 'ss2',  name: 'FortiAnalyzer',        level: 80 },
      { id: 'ss3',  name: 'Segmentación de Red',  level: 85 },
      { id: 'ss4',  name: 'VLANs',                level: 90 },
      { id: 'ss5',  name: 'Creación de VPNs',     level: 80 },
    ]
  },
  {
    id: 'sec-2', title: 'Servidores Windows',
    skills: [
      { id: 'ss6',  name: 'Windows Server',       level: 85 },
      { id: 'ss7',  name: 'Active Directory',      level: 85 },
      { id: 'ss8',  name: 'Group Policy (GPO)',    level: 80 },
      { id: 'ss9',  name: 'DNS / DHCP',            level: 75 },
    ]
  },
  {
    id: 'sec-3', title: 'Linux',
    skills: [
      { id: 'ss10', name: 'Ubuntu Server',         level: 80 },
      { id: 'ss11', name: 'Debian',                level: 75 },
      { id: 'ss12', name: 'Kali Linux',            level: 80 },
      { id: 'ss13', name: 'Bash Scripting',        level: 70 },
    ]
  },
  {
    id: 'sec-4', title: 'Ethical Hacking & Web Sec',
    skills: [
      { id: 'ss14', name: 'OWASP Top 10',          level: 85 },
      { id: 'ss15', name: 'Burp Suite',            level: 75 },
      { id: 'ss16', name: 'Nmap / Recon',          level: 85 },
      { id: 'ss17', name: 'Metasploit',            level: 70 },
      { id: 'ss18', name: 'Wireshark',             level: 80 },
    ]
  }
];

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent {
  readonly Plus         = Plus;
  readonly X            = X;
  readonly Edit2        = Edit2;
  readonly Check        = Check;
  readonly Shield       = Shield;
  readonly Code2        = Code2;
  readonly ChevronRight = ChevronRight;

  private storage   = inject(StorageService);
  private auth      = inject(AuthService);
  private editGuard = inject(EditGuardService);
  modeService       = inject(ModeService);

  // Alias para compatibilidad con el template existente
  get activeMode() { return this.modeService.activeMode; }

  // ─── Edit state ──────────────────────────────────────────────────────
  editingCategoryId     = signal<string | null>(null);
  editingSkillId        = signal<string | null>(null);
  newSkillName          = signal('');
  newSkillLevel         = signal(80);
  newCategoryName       = signal('');
  addingSkillInCategory = signal<string | null>(null);
  addingCategory        = signal(false);
  editCategoryName      = signal('');

  // ─── Datos con persistencia ──────────────────────────────────────────
  devCategories = signal<SkillCategory[]>(
    this.storage.get<SkillCategory[]>('portfolio_dev_skills', DEFAULT_DEV_CATEGORIES)
  );

  secCategories = signal<SkillCategory[]>(
    this.storage.get<SkillCategory[]>('portfolio_sec_skills', DEFAULT_SEC_CATEGORIES)
  );

  constructor() {
    effect(() => {
      this.storage.set('portfolio_dev_skills', this.devCategories());
    });
    effect(() => {
      this.storage.set('portfolio_sec_skills', this.secCategories());
    });
  }

  // ─── Computed ────────────────────────────────────────────────────────
  currentCategories = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devCategories() : this.secCategories()
  );

  setMode(mode: 'dev' | 'security') { this.modeService.setMode(mode); this.cancelAll(); }

  private genId() { return Math.random().toString(36).slice(2, 9); }

  private updateCategories(cats: SkillCategory[]) {
    if (this.modeService.activeMode() === 'dev') this.devCategories.set(cats);
    else this.secCategories.set(cats);
  }

  // ─── Guard: si no autenticado, pide PIN y guarda la acción ──────────
  private requireAuth(action: () => void) {
    if (this.auth.isAuthenticated()) {
      action();
    } else {
      this.editGuard.requestLogin(action);
    }
  }

  // ─── Acciones ────────────────────────────────────────────────────────
  cancelAll() {
    this.editingCategoryId.set(null);
    this.editingSkillId.set(null);
    this.addingSkillInCategory.set(null);
    this.addingCategory.set(false);
    this.newSkillName.set('');
    this.newCategoryName.set('');
    this.editCategoryName.set('');
  }

  startAddCategory() {
    this.requireAuth(() => {
      this.cancelAll();
      this.addingCategory.set(true);
    });
  }

  confirmAddCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;
    this.updateCategories([...this.currentCategories(), { id: this.genId(), title: name, skills: [] }]);
    this.cancelAll();
  }

  startEditCategory(cat: SkillCategory) {
    this.requireAuth(() => {
      this.cancelAll();
      this.editingCategoryId.set(cat.id);
      this.editCategoryName.set(cat.title);
    });
  }

  confirmEditCategory(catId: string) {
    const name = this.editCategoryName().trim();
    if (!name) return;
    this.updateCategories(
      this.currentCategories().map(c => c.id === catId ? { ...c, title: name } : c)
    );
    this.cancelAll();
  }

  deleteCategory(catId: string) {
    this.requireAuth(() => {
      this.updateCategories(this.currentCategories().filter(c => c.id !== catId));
    });
  }

  startAddSkill(catId: string) {
    this.requireAuth(() => {
      this.cancelAll();
      this.addingSkillInCategory.set(catId);
      this.newSkillName.set('');
      this.newSkillLevel.set(80);
    });
  }

  confirmAddSkill(catId: string) {
    const name = this.newSkillName().trim();
    if (!name) return;
    this.updateCategories(this.currentCategories().map(c => {
      if (c.id !== catId) return c;
      return { ...c, skills: [...c.skills, { id: this.genId(), name, level: this.newSkillLevel() }] };
    }));
    this.cancelAll();
  }

  deleteSkill(catId: string, skillId: string) {
    this.requireAuth(() => {
      this.updateCategories(this.currentCategories().map(c => {
        if (c.id !== catId) return c;
        return { ...c, skills: c.skills.filter(s => s.id !== skillId) };
      }));
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

  confirmEditSkill(catId: string, skillId: string) {
    const name = this.newSkillName().trim();
    if (!name) return;
    this.updateCategories(this.currentCategories().map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        skills: c.skills.map(s =>
          s.id === skillId ? { ...s, name, level: this.newSkillLevel() } : s
        )
      };
    }));
    this.cancelAll();
  }
}
