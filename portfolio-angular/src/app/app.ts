import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { AuthService } from './services/auth.service';
import { EditGuardService } from './services/edit-guard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title     = 'portfolio-angular';
  heroImage = 'assets/DEV.jpg';

  auth      = inject(AuthService);
  editGuard = inject(EditGuardService);

  // Panel de admin desactivado (sitio estático). Ver app.html.

  onLoginSuccess() {
    // Ejecutar la acción pendiente (editar skill/proyecto) tras login exitoso
    this.editGuard.consumePending();
  }

  logout() {
    this.auth.logout();
  }
}
