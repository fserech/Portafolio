import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminProjectsService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  createProject(projectData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  updateProject(id: number, projectData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projectData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
