import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, ShieldAlert, Search, Wrench, CheckCircle2 } from 'lucide-angular';

export interface Incident {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  featured?: boolean;
  problem?: string;
  diagnosis?: string;
  solution?: string;
  result?: string;
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
  readonly Search = Search;
  readonly Wrench = Wrench;
  readonly CheckCircle2 = CheckCircle2;

  content = signal<IncidentsContent>({
    sectionTitle: '',
    sectionSubtitle: '',
    incidents: []
  });

  featuredIncident = computed(() =>
    this.content().incidents.find(i => i.featured)
  );

  otherIncidents = computed(() =>
    this.content().incidents.filter(i => !i.featured)
  );

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