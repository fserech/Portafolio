import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, ShieldAlert } from 'lucide-angular';

export interface Incident {
  id: string;
  title: string;
  date: string;      // ej. "2026" o "Reciente" — evita fechas exactas si es sensible
  category: string;   // ej. "Firewall / Red", "Virtualización", "Acceso No Autorizado"
  summary: string;    // resumen breve, 2-3 líneas
}

interface IncidentsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  incidents: Incident[];
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './incidents.html',
  styleUrls: ['./incidents.scss']
})
export class IncidentsComponent implements OnInit {
  private http = inject(HttpClient);

  readonly ShieldAlert = ShieldAlert;

  content = signal<IncidentsContent>({
    sectionTitle: '',
    sectionSubtitle: '',
    incidents: []
  });

  async ngOnInit() {
    try {
      const data = await firstValueFrom(
        this.http.get<IncidentsContent>('/assets/data/incidents.json')
      );
      this.content.set(data);
    } catch (err) {
      console.error('Error cargando incidents.json:', err);
    }
  }
}