import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
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
  private data = inject(DataService);

  categories = signal<SkillCategory[]>([]);

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
      this.categories.set(await this.data.getSkillCategories());
    } catch (e) {
      console.error('Error cargando skills:', e);
    }
  }
}