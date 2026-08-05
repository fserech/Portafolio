import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  demoUrl: string;
  repoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getSkillCategories(): Promise<SkillCategory[]> {
    return firstValueFrom(
      this.http.get<SkillCategory[]>('/assets/data/skills.json')
    );
  }

  getProjects(): Promise<Project[]> {
    return firstValueFrom(
      this.http.get<Project[]>('/assets/data/projects.json')
    );
  }
}