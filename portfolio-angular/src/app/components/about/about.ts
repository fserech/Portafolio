import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, Code, Layout, Smartphone, Shield, Terminal, Eye } from 'lucide-angular';
import { ModeService } from '../../services/mode.service';

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

interface AboutContentRaw {
  sectionTitle: string;
  sectionSubtitle: string;
  bannerTitle: string;
  bannerText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  features: FeatureRaw[];
}

interface AboutData {
  dev: AboutContentRaw;
  security: AboutContentRaw;
}

interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  bannerTitle: string;
  bannerText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

const ICONS: Record<string, any> = { Code, Layout, Smartphone, Shield, Terminal, Eye };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {
  modeService = inject(ModeService);
  private http = inject(HttpClient);

  private readonly emptyContent: AboutContent = {
    sectionTitle: '', sectionSubtitle: '',
    bannerTitle: '', bannerText: '',
    stat1Value: '', stat1Label: '',
    stat2Value: '', stat2Label: ''
  };

  devContent = signal<AboutContent>(this.emptyContent);
  secContent = signal<AboutContent>(this.emptyContent);
  devFeatures = signal<Feature[]>([]);
  secFeatures = signal<Feature[]>([]);

  get content(): AboutContent {
    return this.modeService.activeMode() === 'dev'
      ? this.devContent()
      : this.secContent();
  }

  get features(): Feature[] {
    return this.modeService.activeMode() === 'dev'
      ? this.devFeatures()
      : this.secFeatures();
  }

  async ngOnInit() {
    try {
      const data = await firstValueFrom(
        this.http.get<AboutData>('/assets/data/about.json')
      );

      this.devContent.set(data.dev);
      this.secContent.set(data.security);
      this.devFeatures.set(data.dev.features.map(f => ({ ...f, icon: ICONS[f.icon] })));
      this.secFeatures.set(data.security.features.map(f => ({ ...f, icon: ICONS[f.icon] })));
    } catch (err) {
      console.error('Error cargando about.json:', err);
    }
  }
}