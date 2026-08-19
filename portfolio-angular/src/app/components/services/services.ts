import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, LifeBuoy, ArrowLeftRight, Eye, Code2 } from 'lucide-angular';

export interface Service {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  badge: string;
}

interface ServicesContent {
  sectionTitle: string;
  sectionSubtitle: string;
  services: Service[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss']
})
export class ServicesComponent implements OnInit {
  private http = inject(HttpClient);

  readonly icons: Record<string, any> = { LifeBuoy, ArrowLeftRight, Eye, Code2 };

  content = signal<ServicesContent>({
    sectionTitle: '',
    sectionSubtitle: '',
    services: []
  });

  async ngOnInit() {
    try {
      const data = await firstValueFrom(
        this.http.get<ServicesContent>('/assets/data/services.json')
      );
      this.content.set(data);
    } catch (err) {
      console.error('Error cargando services.json:', err);
    }
  }
}