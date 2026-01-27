
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Injectable, signal } from '@angular/core';
import {  Project, ProjectsData } from '../interface/Project.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects = signal<Project[]>([]);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loadProjects(): Observable<ProjectsData> {
    return this.http.get<ProjectsData>(`${this.apiUrl}/projects`).pipe(
      tap(data => this.projects.set(data.projects))
    );
  }

  getProjects() {
    return this.projects();
  }

  getFeaturedProjects() {
    return this.projects().filter(p => p.featured);
  }

  getProjectsByCategory(category: string) {
    if (category === 'all') return this.projects();
    return this.projects().filter(p => p.category === category);
  }
}
