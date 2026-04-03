import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  History,
  X,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-angular';

import {
  ChangelogAction,
  ChangelogEntry,
  ChangelogMode,
  ChangelogService
} from '../../services/change.service';

import { ModeService } from '../../services/mode.service';

type FilterMode = 'all' | 'dev' | 'security' | 'global';
type FilterAction = 'all' | ChangelogAction;

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './changelog.html',
  // ← sin styleUrls, no existe el .scss
})
export class ChangelogComponent implements OnInit, OnDestroy {

  readonly History     = History;
  readonly X           = X;
  readonly Filter      = Filter;
  readonly RefreshCw   = RefreshCw;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp   = ChevronUp;

  changelog   = inject(ChangelogService);
  modeService = inject(ModeService);

  isOpen        = signal(false);
  filterMode    = signal<FilterMode>('all');
  filterAction  = signal<FilterAction>('all');
  showFilters   = signal(false);
  refreshing    = signal(false);
  expandedIds   = signal<Set<number>>(new Set());

  devCount = computed(() =>
    this.changelog.entries().filter(e => e.mode === 'dev').length
  );

  secCount = computed(() =>
    this.changelog.entries().filter(e => e.mode === 'security').length
  );

  globalCount = computed(() =>
    this.changelog.entries().filter(e => e.mode === 'global').length
  );

  filteredEntries = computed(() => {
    let list = this.changelog.entries();
    const globalMode = this.modeService.activeMode();
    const filterMode = this.filterMode();

    if (filterMode === 'all') {
      list = list.filter(e => e.mode === globalMode || e.mode === 'global');
    } else {
      list = list.filter(e => e.mode === filterMode);
    }

    const action = this.filterAction();
    if (action !== 'all') {
      list = list.filter(e => e.action === action);
    }

    return list;
  });

  readonly modeOptions = [
    { value: 'all',      label: 'Todos los modos' },
    { value: 'dev',      label: '👨‍💻 Developer' },
    { value: 'security', label: '🛡️ Security' },
    { value: 'global',   label: '🌐 Global' },
  ];

  readonly actionOptions = [
    { value: 'all',                    label: 'Todas las acciones' },
    { value: 'project_added',          label: '🚀 Proyecto agregado' },
    { value: 'project_updated',        label: '✏️ Proyecto actualizado' },
    { value: 'project_deleted',        label: '🗑️ Proyecto eliminado' },
    { value: 'skill_category_added',   label: '📂 Categoría creada' },
    { value: 'skill_category_updated', label: '📝 Categoría actualizada' },
    { value: 'skill_category_deleted', label: '📁 Categoría eliminada' },
    { value: 'skill_added',            label: '➕ Skill agregado' },
    { value: 'skill_updated',          label: '🔄 Skill actualizado' },
    { value: 'skill_deleted',          label: '❌ Skill eliminado' },
    { value: 'contact_message_sent',   label: '📧 Mensaje enviado' },
  ];

  private pollInterval: any;

  async ngOnInit(): Promise<void> {
    await this.changelog.loadAll();
    this.pollInterval = setInterval(() => this.changelog.refresh(), 20000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  async manualRefresh() {
    this.refreshing.set(true);
    await this.changelog.refresh();
    await new Promise(r => setTimeout(r, 400));
    this.refreshing.set(false);
  }

  resetFilters() {
    this.filterMode.set('all');
    this.filterAction.set('all');
  }

  hasActiveFilters() {
    return this.filterMode() !== 'all' || this.filterAction() !== 'all';
  }

  toggleExpand(id: number) {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isExpanded(id: number) {
    return this.expandedIds().has(id);
  }

  trackById(index: number, item: { id: number }) {
    return item.id;
  }

  getPayloadKeys(payload: Record<string, unknown>) {
    return Object.keys(payload).filter(k => payload[k]);
  }

  getIcon(action: ChangelogAction)   { return this.changelog.getIcon(action); }
  getLabel(action: ChangelogAction)  { return this.changelog.getLabel(action); }
  getBadge(action: ChangelogAction)  { return this.changelog.getBadgeClass(action); }
  getModeColor(mode: ChangelogMode)  { return this.changelog.getModeColor(mode); }
  relTime(iso: string)               { return this.changelog.getRelativeTime(iso); }
  fullDate(iso: string)              { return this.changelog.getFullDate(iso); }
}
