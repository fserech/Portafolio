import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, Code, Layout, Smartphone, Shield, Terminal, Eye, Network } from 'lucide-angular';

interface FeatureRaw {
  icon: string;
  title: string;
  description: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
}

interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  bannerTitle: string;
  bannerText: string;
  features: FeatureRaw[];
}

const ICONS: Record<string, any> = { Code, Layout, Smartphone, Shield, Terminal, Eye, Network };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {
  private http = inject(HttpClient);

  content = signal<AboutContent>({
    sectionTitle: '', sectionSubtitle: '', bannerTitle: '', bannerText: '', features: []
  });

  features = signal<Feature[]>([]);

  async ngOnInit() {
    try {
      const data = await firstValueFrom(
        this.http.get<AboutContent>('/assets/data/about.json')
      );
      this.content.set(data);
      this.features.set(data.features.map(f => ({ ...f, icon: ICONS[f.icon] })));
    } catch (err) {
      console.error('Error cargando about.json:', err);
    }
  }
}