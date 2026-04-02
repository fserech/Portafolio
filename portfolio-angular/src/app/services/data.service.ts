import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// ─── Interfaces ───────────────────────────────────────────────────────────────
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

@Injectable({ providedIn: 'root' })
export class DataService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // ─── Headers con PIN para escritura ──────────────────────────────────
  private writeHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-admin-pin': this.auth.getPin() ?? ''
    });
  }

  // ─── ID único garantizado (timestamp + random) ────────────────────────
  // NO usar Math.random() solo — colisiona con json-server
  private genId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SKILLS
  // ═══════════════════════════════════════════════════════════════════════
  private skillsUrl(mode: ProfileMode) {
    return `${this.api}/skills_${mode}`;
  }

  getSkillCategories(mode: ProfileMode): Promise<SkillCategory[]> {
    return firstValueFrom(
      this.http.get<SkillCategory[]>(this.skillsUrl(mode))
    );
  }

  addSkillCategory(mode: ProfileMode, category: Omit<SkillCategory, 'id'>): Promise<SkillCategory> {
    // NO incluir id — dejar que json-server lo genere automáticamente
    const body = { ...category };
    return firstValueFrom(
      this.http.post<SkillCategory>(
        this.skillsUrl(mode),
        body,
        { headers: this.writeHeaders() }
      )
    );
  }

  updateSkillCategory(mode: ProfileMode, category: SkillCategory): Promise<SkillCategory> {
    return firstValueFrom(
      this.http.put<SkillCategory>(
        `${this.skillsUrl(mode)}/${category.id}`,
        category,
        { headers: this.writeHeaders() }
      )
    );
  }

  deleteSkillCategory(mode: ProfileMode, id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.skillsUrl(mode)}/${id}`,
        { headers: this.writeHeaders() }
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════════════
  private projectsUrl(mode: ProfileMode) {
    return `${this.api}/projects_${mode}`;
  }

  getProjects(mode: ProfileMode): Promise<Project[]> {
    return firstValueFrom(
      this.http.get<Project[]>(this.projectsUrl(mode))
    );
  }

  addProject(mode: ProfileMode, project: Omit<Project, 'id'>): Promise<Project> {
    // NO incluir id — dejar que json-server lo genere automáticamente
    const body = { ...project };
    return firstValueFrom(
      this.http.post<Project>(
        this.projectsUrl(mode),
        body,
        { headers: this.writeHeaders() }
      )
    );
  }

  updateProject(mode: ProfileMode, project: Project): Promise<Project> {
    return firstValueFrom(
      this.http.put<Project>(
        `${this.projectsUrl(mode)}/${project.id}`,
        project,
        { headers: this.writeHeaders() }
      )
    );
  }

  deleteProject(mode: ProfileMode, id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.projectsUrl(mode)}/${id}`,
        { headers: this.writeHeaders() }
      )
    );
  }
}
