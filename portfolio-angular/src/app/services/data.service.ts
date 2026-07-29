import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

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
  constructor(private http: HttpClient) {}

  getSkillCategories(mode: ProfileMode): Promise<SkillCategory[]> {
    return firstValueFrom(
      this.http.get<{ dev: SkillCategory[]; security: SkillCategory[] }>(
        '/assets/data/skills.json'
      )
    ).then(data => data[mode]);
  }

  getProjects(mode: ProfileMode): Promise<Project[]> {
    return firstValueFrom(
      this.http.get<{ dev: Project[]; security: Project[] }>(
        '/assets/data/projects.json'
      )
    ).then(data => data[mode]);
  }
}