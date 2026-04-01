// src/app/services/data.service.ts
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

  // ─── Headers privados (incluye PIN para escritura) ────────────────────
  private writeHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-admin-pin': this.auth.getPin() ?? ''
    });
  }

  // ─── SKILLS ──────────────────────────────────────────────────────────
  private skillsEndpoint(mode: ProfileMode) {
    return `${this.api}/skills_${mode}`;
  }

  getSkillCategories(mode: ProfileMode): Promise<SkillCategory[]> {
    return firstValueFrom(
      this.http.get<SkillCategory[]>(this.skillsEndpoint(mode))
    );
  }

  addSkillCategory(mode: ProfileMode, category: Omit<SkillCategory, 'id'>): Promise<SkillCategory> {
    const body: SkillCategory = { id: this.genId(), ...category };
    return firstValueFrom(
      this.http.post<SkillCategory>(
        this.skillsEndpoint(mode), body,
        { headers: this.writeHeaders() }
      )
    );
  }

  updateSkillCategory(mode: ProfileMode, category: SkillCategory): Promise<SkillCategory> {
    return firstValueFrom(
      this.http.put<SkillCategory>(
        `${this.skillsEndpoint(mode)}/${category.id}`, category,
        { headers: this.writeHeaders() }
      )
    );
  }

  deleteSkillCategory(mode: ProfileMode, id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.skillsEndpoint(mode)}/${id}`,
        { headers: this.writeHeaders() }
      )
    );
  }

  // ─── PROJECTS ────────────────────────────────────────────────────────
  private projectsEndpoint(mode: ProfileMode) {
    return `${this.api}/projects_${mode}`;
  }

  getProjects(mode: ProfileMode): Promise<Project[]> {
    return firstValueFrom(
      this.http.get<Project[]>(this.projectsEndpoint(mode))
    );
  }

  addProject(mode: ProfileMode, project: Omit<Project, 'id'>): Promise<Project> {
    const body: Project = { id: this.genId(), ...project };
    return firstValueFrom(
      this.http.post<Project>(
        this.projectsEndpoint(mode), body,
        { headers: this.writeHeaders() }
      )
    );
  }

  updateProject(mode: ProfileMode, project: Project): Promise<Project> {
    return firstValueFrom(
      this.http.put<Project>(
        `${this.projectsEndpoint(mode)}/${project.id}`, project,
        { headers: this.writeHeaders() }
      )
    );
  }

  deleteProject(mode: ProfileMode, id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.projectsEndpoint(mode)}/${id}`,
        { headers: this.writeHeaders() }
      )
    );
  }

  // ─── Helper ──────────────────────────────────────────────────────────
  private genId(): string {
    return Math.random().toString(36).slice(2, 9);
  }
}
