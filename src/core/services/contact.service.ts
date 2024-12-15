import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from '../models/contact.interface';
import { environment } from '../../environments/environment';

interface ContactResponse {
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = `${environment.apiUrl}/api/contact`;

    constructor(private http: HttpClient) { }

    sendMessage(payload: ContactForm): Observable<ContactResponse> {
        return this.http.post<ContactResponse>(this.apiUrl, payload);
    }
}