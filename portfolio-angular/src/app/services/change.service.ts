// src/app/services/changelog.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ChangelogAction =
  | 'project_added'
  | 'project_updated'
  | 'project_deleted'
  | 'skill_category_added'
  | 'skill_category_updated'
  | 'skill_category_deleted'
  | 'skill_added'
  | 'skill_updated'
  | 'skill_deleted'
  | 'contact_message_sent';

export type ChangelogMode = 'dev' | 'security' | 'global';

export interface ChangelogEntry {
  /** ID incremental generado por json-server (numérico auto-increment) */
  id: number;
  /** Acción semántica realizada */
  action: ChangelogAction;
  /** Modo del portfolio donde ocurrió */
  mode: ChangelogMode;
  /** Título legible del cambio */
  title: string;
  /** Descripción detallada opcional */
  description?: string;
  /** Payload con datos relevantes del objeto modificado */
  payload: Record<string, unknown>;
  /** ID del objeto afectado (proyecto, categoría, etc.) */
  targetId?: string | number;
  /** Timestamp ISO 8601 */
  createdAt: string;
  /** Versión incremental global (se calcula en el servicio) */
  version: number;
}

/** Datos para crear un nuevo entry (sin id/createdAt/version, los asigna el servicio) */
export type CreateChangelogEntry = Omit<ChangelogEntry, 'id' | 'createdAt' | 'version'>;

// ─── Labels legibles por acción ──────────────────────────────────────────────

const ACTION_LABELS: Record<ChangelogAction, string> = {
  project_added:             'Proyecto agregado',
  project_updated:           'Proyecto actualizado',
  project_deleted:           'Proyecto eliminado',
  skill_category_added:      'Categoría de skill creada',
  skill_category_updated:    'Categoría de skill actualizada',
  skill_category_deleted:    'Categoría de skill eliminada',
  skill_added:               'Skill agregado',
  skill_updated:             'Skill actualizado',
  skill_deleted:             'Skill eliminado',
  contact_message_sent:      'Mensaje de contacto enviado',
};

const ACTION_ICONS: Record<ChangelogAction, string> = {
  project_added:             '🚀',
  project_updated:           '✏️',
  project_deleted:           '🗑️',
  skill_category_added:      '📂',
  skill_category_updated:    '📝',
  skill_category_deleted:    '📁',
  skill_added:               '➕',
  skill_updated:             '🔄',
  skill_deleted:             '❌',
  contact_message_sent:      '📧',
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ChangelogService {
  /** Lista reactiva de todos los entries (más reciente primero) */
  readonly entries = signal<ChangelogEntry[]>([]);
  /** Si está cargando desde el servidor */
  readonly loading = signal(false);
  /** Versión actual (= total de entradas) */
  readonly currentVersion = signal(0);

  private readonly apiUrl = `${environment.apiUrl}/changelog`;

  constructor(private http: HttpClient) {}

  // ─── Headers ──────────────────────────────────────────────────────────

  private headers(): HttpHeaders {
    const pin = sessionStorage.getItem('portfolio_pin') ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-admin-pin': pin,
    });
  }

  // ─── Carga inicial y polling ───────────────────────────────────────────

  /**
   * Carga todos los entries del servidor ordenados por ID descendente.
   * Llamar en ngOnInit del componente raíz o AppComponent.
   */
  async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      // json-server soporta _sort y _order como query params
      const data = await firstValueFrom(
        this.http.get<ChangelogEntry[]>(`${this.apiUrl}?_sort=id&_order=desc`)
      );
      this.entries.set(data);
      this.currentVersion.set(data.length > 0 ? Math.max(...data.map(e => e.version)) : 0);
    } catch (err) {
      console.error('[ChangelogService] Error cargando changelog:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Recarga silenciosa (para polling).
   * Solo actualiza si hay entradas nuevas (evita re-renders innecesarios).
   */
  async refresh(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<ChangelogEntry[]>(`${this.apiUrl}?_sort=id&_order=desc`)
      );
      const currentIds = new Set(this.entries().map(e => e.id));
      const hasNew = data.some(e => !currentIds.has(e.id));
      if (hasNew || data.length !== this.entries().length) {
        this.entries.set(data);
        this.currentVersion.set(data.length > 0 ? Math.max(...data.map(e => e.version)) : 0);
      }
    } catch {
      // Silencioso — no interrumpir al usuario
    }
  }

  // ─── Crear un nuevo entry ─────────────────────────────────────────────

  /**
   * Registra un cambio en el backend con ID incremental automático.
   *
   * json-server auto-incrementa el campo `id` cuando se hace POST sin `id`.
   * El campo `version` lo calculamos nosotros como entries.length + 1
   * para tener un número de versión semántico independiente del ID de DB.
   */
  async record(entry: CreateChangelogEntry): Promise<ChangelogEntry | null> {
    try {
      const nextVersion = this.entries().length + 1;

      const body: Omit<ChangelogEntry, 'id'> = {
        ...entry,
        version:   nextVersion,
        createdAt: new Date().toISOString(),
      };

      const saved = await firstValueFrom(
        this.http.post<ChangelogEntry>(this.apiUrl, body, { headers: this.headers() })
      );

      // Insertar al inicio del array reactivo (orden descendente)
      this.entries.set([saved, ...this.entries()]);
      this.currentVersion.set(saved.version);

      return saved;
    } catch (err) {
      console.error('[ChangelogService] Error guardando entry:', err);
      return null;
    }
  }

  // ─── Helpers de conveniencia (factory methods) ────────────────────────

  recordProjectAdded(mode: ChangelogMode, project: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'project_added',
      mode,
      title:       `Proyecto "${project.title}" agregado`,
      description: `Nuevo proyecto creado en modo ${mode}`,
      payload:     { projectId: project.id, projectTitle: project.title },
      targetId:    project.id,
    });
  }

  recordProjectUpdated(mode: ChangelogMode, project: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'project_updated',
      mode,
      title:       `Proyecto "${project.title}" actualizado`,
      description: `Se modificaron los datos del proyecto`,
      payload:     { projectId: project.id, projectTitle: project.title },
      targetId:    project.id,
    });
  }

  recordProjectDeleted(mode: ChangelogMode, project: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'project_deleted',
      mode,
      title:       `Proyecto "${project.title}" eliminado`,
      payload:     { projectId: project.id, projectTitle: project.title },
      targetId:    project.id,
    });
  }

  recordSkillCategoryAdded(mode: ChangelogMode, category: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_category_added',
      mode,
      title:       `Categoría "${category.title}" creada`,
      payload:     { categoryId: category.id, categoryTitle: category.title },
      targetId:    category.id,
    });
  }

  recordSkillCategoryUpdated(mode: ChangelogMode, category: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_category_updated',
      mode,
      title:       `Categoría "${category.title}" actualizada`,
      payload:     { categoryId: category.id, categoryTitle: category.title },
      targetId:    category.id,
    });
  }

  recordSkillCategoryDeleted(mode: ChangelogMode, category: { id: string; title: string }): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_category_deleted',
      mode,
      title:       `Categoría "${category.title}" eliminada`,
      payload:     { categoryId: category.id, categoryTitle: category.title },
      targetId:    category.id,
    });
  }

  recordSkillAdded(mode: ChangelogMode, categoryTitle: string, skillName: string): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_added',
      mode,
      title:       `Skill "${skillName}" agregado`,
      description: `Agregado a la categoría "${categoryTitle}"`,
      payload:     { categoryTitle, skillName },
    });
  }

  recordSkillUpdated(mode: ChangelogMode, categoryTitle: string, skillName: string): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_updated',
      mode,
      title:       `Skill "${skillName}" actualizado`,
      description: `En la categoría "${categoryTitle}"`,
      payload:     { categoryTitle, skillName },
    });
  }

  recordSkillDeleted(mode: ChangelogMode, categoryTitle: string, skillName: string): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'skill_deleted',
      mode,
      title:       `Skill "${skillName}" eliminado`,
      description: `De la categoría "${categoryTitle}"`,
      payload:     { categoryTitle, skillName },
    });
  }

  recordContactMessage(senderName: string, senderEmail: string): Promise<ChangelogEntry | null> {
    return this.record({
      action:      'contact_message_sent',
      mode:        'global',
      title:       `Mensaje de ${senderName}`,
      description: `Email: ${senderEmail}`,
      payload:     { senderName, senderEmail },
    });
  }

  // ─── Utilidades de presentación ───────────────────────────────────────

  getLabel(action: ChangelogAction): string {
    return ACTION_LABELS[action] ?? action;
  }

  getIcon(action: ChangelogAction): string {
    return ACTION_ICONS[action] ?? '📋';
  }

  /**
   * Formatea la fecha de un entry de forma legible.
   * Ejemplo: "hace 5 minutos", "hace 2 horas", "ayer"
   */
  getRelativeTime(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours   = Math.floor(diff / 3_600_000);
    const days    = Math.floor(diff / 86_400_000);

    if (minutes < 1)   return 'ahora mismo';
    if (minutes < 60)  return `hace ${minutes} min`;
    if (hours   < 24)  return `hace ${hours}h`;
    if (days    === 1) return 'ayer';
    if (days    < 7)   return `hace ${days} días`;

    return new Date(isoDate).toLocaleDateString('es-GT', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  /**
   * Formatea fecha completa para tooltip.
   */
  getFullDate(isoDate: string): string {
    return new Date(isoDate).toLocaleString('es-GT', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  /**
   * Filtra entries por modo.
   */
  getByMode(mode: ChangelogMode): ChangelogEntry[] {
    return this.entries().filter(e => e.mode === mode || e.mode === 'global');
  }

  /**
   * Color de badge según acción.
   */
  getBadgeClass(action: ChangelogAction): string {
    if (action.includes('deleted')) return 'badge-danger';
    if (action.includes('updated')) return 'badge-warning';
    if (action.includes('added') || action.includes('sent')) return 'badge-success';
    return 'badge-info';
  }

  getModeColor(mode: ChangelogMode): string {
    switch (mode) {
      case 'dev':      return 'mode-dev';
      case 'security': return 'mode-sec';
      default:         return 'mode-global';
    }
  }
}
