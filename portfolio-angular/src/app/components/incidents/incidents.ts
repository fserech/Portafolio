import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, ShieldAlert, ChevronDown, Search, Activity, CheckCircle2, Terminal } from 'lucide-angular';

export interface Incident {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  detection: string;
  analysis: string;
  response: string;
  outcome: string;
  commands?: string[];
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

  readonly ShieldAlert  = ShieldAlert;
  readonly ChevronDown  = ChevronDown;
  readonly Search       = Search;
  readonly Activity     = Activity;
  readonly CheckCircle2 = CheckCircle2;
  readonly Terminal     = Terminal;

  content = signal<IncidentsContent>({
    sectionTitle: '',
    sectionSubtitle: '',
    incidents: []
  });

  expandedId = signal<string | null>(null);

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

  toggle(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  isExpanded(id: string): boolean {
    return this.expandedId() === id;
  }
}