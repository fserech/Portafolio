// src/app/services/data.service.ts
//
// CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR:
//   - Inyecta ChangelogService
//   - Cada método de escritura (add/update/delete) llama al changelog
//     de forma "fire-and-forget" para no bloquear la UI
//   - Se mantiene toda la lógica previa sin romper nada
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ChangelogMode, ChangelogService } from './change.service';


// ─── Interfaces (sin cambios) ─────────────────────────────────────────────────

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

export type ProfileMode = 'dev' | 'security';

// ─── Helper: convierte ProfileMode → ChangelogMode ────────────────────────────

function toChangelogMode(mode: ProfileMode): ChangelogMode {
  return mode as ChangelogMode;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class DataService {
  private api = environment.apiUrl;

  constructor(
    private http:      HttpClient,
    private auth:      AuthService,
    private changelog: ChangelogService,   // ← NUEVO
  ) {}

  // ─── Headers con PIN para escritura ──────────────────────────────────

  private writeHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-admin-pin':  this.auth.getPin() ?? '',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SKILLS
  // ═══════════════════════════════════════════════════════════════════════

  private skillsUrl(mode: ProfileMode): string {
    return `${this.api}/skills_${mode}`;
  }

  getSkillCategories(mode: ProfileMode): Promise<SkillCategory[]> {
    return firstValueFrom(
      this.http.get<SkillCategory[]>(this.skillsUrl(mode))
    );
  }

  async addSkillCategory(
    mode: ProfileMode,
    category: Omit<SkillCategory, 'id'>,
  ): Promise<SkillCategory> {
    const saved = await firstValueFrom(
      this.http.post<SkillCategory>(
        this.skillsUrl(mode),
        category,
        { headers: this.writeHeaders() },
      )
    );

    // Registrar en changelog (no bloquea)
    this.changelog.recordSkillCategoryAdded(toChangelogMode(mode), {
      id:    saved.id,
      title: saved.title,
    });

    return saved;
  }

  async updateSkillCategory(
    mode: ProfileMode,
    category: SkillCategory,
  ): Promise<SkillCategory> {
    const saved = await firstValueFrom(
      this.http.put<SkillCategory>(
        `${this.skillsUrl(mode)}/${category.id}`,
        category,
        { headers: this.writeHeaders() },
      )
    );

    this.changelog.recordSkillCategoryUpdated(toChangelogMode(mode), {
      id:    saved.id,
      title: saved.title,
    });

    return saved;
  }

  async deleteSkillCategory(mode: ProfileMode, id: string): Promise<void> {
    // Necesitamos el título antes de eliminar para el registro
    let title = id;
    try {
      const cats = await this.getSkillCategories(mode);
      title = cats.find(c => c.id === id)?.title ?? id;
    } catch { /* no crítico */ }

    await firstValueFrom(
      this.http.delete<void>(
        `${this.skillsUrl(mode)}/${id}`,
        { headers: this.writeHeaders() },
      )
    );

    this.changelog.recordSkillCategoryDeleted(toChangelogMode(mode), { id, title });
  }

  /**
   * Registra la adición de un skill individual dentro de una categoría.
   * Llamar DESPUÉS de updateSkillCategory cuando el cambio es agregar un skill.
   */
  recordSkillAdded(mode: ProfileMode, categoryTitle: string, skillName: string): void {
    this.changelog.recordSkillAdded(toChangelogMode(mode), categoryTitle, skillName);
  }

  recordSkillUpdated(mode: ProfileMode, categoryTitle: string, skillName: string): void {
    this.changelog.recordSkillUpdated(toChangelogMode(mode), categoryTitle, skillName);
  }

  recordSkillDeleted(mode: ProfileMode, categoryTitle: string, skillName: string): void {
    this.changelog.recordSkillDeleted(toChangelogMode(mode), categoryTitle, skillName);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════════════

  private projectsUrl(mode: ProfileMode): string {
    return `${this.api}/projects_${mode}`;
  }

  getProjects(mode: ProfileMode): Promise<Project[]> {
    return firstValueFrom(
      this.http.get<Project[]>(this.projectsUrl(mode))
    );
  }

  async addProject(
    mode: ProfileMode,
    project: Omit<Project, 'id'>,
  ): Promise<Project> {
    const saved = await firstValueFrom(
      this.http.post<Project>(
        this.projectsUrl(mode),
        project,
        { headers: this.writeHeaders() },
      )
    );

    this.changelog.recordProjectAdded(toChangelogMode(mode), {
      id:    saved.id,
      title: saved.title,
    });

    return saved;
  }

  async updateProject(
    mode: ProfileMode,
    project: Project,
  ): Promise<Project> {
    const saved = await firstValueFrom(
      this.http.put<Project>(
        `${this.projectsUrl(mode)}/${project.id}`,
        project,
        { headers: this.writeHeaders() },
      )
    );

    this.changelog.recordProjectUpdated(toChangelogMode(mode), {
      id:    saved.id,
      title: saved.title,
    });

    return saved;
  }

  async deleteProject(mode: ProfileMode, id: string): Promise<void> {
    let title = id;
    try {
      const projects = await this.getProjects(mode);
      title = projects.find(p => p.id === id)?.title ?? id;
    } catch { /* no crítico */ }

    await firstValueFrom(
      this.http.delete<void>(
        `${this.projectsUrl(mode)}/${id}`,
        { headers: this.writeHeaders() },
      )
    );

    this.changelog.recordProjectDeleted(toChangelogMode(mode), { id, title });
  }
}
