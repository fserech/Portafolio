// src/core/services/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { personalData } from '../../utils/data/personal-data';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(private http: HttpClient) { }

    getBlogs(): Observable<any[]> {
        return this.http
            .get<any[]>(`https://dev.to/api/articles?username=${personalData.devUsername}`)
            .pipe(
                map(data =>
                    data
                        .filter(item => item?.cover_image)
                        .sort(() => Math.random() - 0.5)
                )
            );
    }
}