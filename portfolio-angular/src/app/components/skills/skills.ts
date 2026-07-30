import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';

import { LucideAngularModule, Shield, Code2, ChevronRight } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';
import { DataService, SkillCategory, Skill } from '../../services/data.service';

export type { Skill, SkillCategory };

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {
  readonly Shield       = Shield;
  readonly Code2        = Code2;
  readonly ChevronRight = ChevronRight;

  private data = inject(DataService);
  modeService  = inject(ModeService);

  get activeMode() { return this.modeService.activeMode; }

  // ─── Estado ────────────────────────────────────────────────────────
  devCategories = signal<SkillCategory[]>([]);
  secCategories = signal<SkillCategory[]>([]);
  loading       = signal(false);

  currentCategories = computed(() =>
    this.modeService.activeMode() === 'dev' ? this.devCategories() : this.secCategories()
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
        this.data.getSkillCategories('dev'),
        this.data.getSkillCategories('security')
      ]);
      this.devCategories.set(dev);
      this.secCategories.set(sec);
    } catch (e) {
      console.error('Error cargando skills:', e);
    }
  }

  setMode(mode: 'dev' | 'security') {
    this.modeService.setMode(mode);
  }
}