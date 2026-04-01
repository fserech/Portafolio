import { Component, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { AdminLogin } from './components/admin-login/admin-login';
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
    AdminLogin,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title     = 'portfolio-angular';
  heroImage = 'assets/DEV.png';

  @ViewChild(AdminLogin) loginModal!: AdminLogin;

  auth      = inject(AuthService);
  editGuard = inject(EditGuardService);

  constructor() {
    // Cuando skills o projects pidan login, abrir el modal automáticamente
    effect(() => {
      if (this.editGuard.loginRequested()) {
        setTimeout(() => this.loginModal?.open(), 50);
      }
    });
  }

  openLogin() {
    this.loginModal.open();
  }

  onLoginSuccess() {
    // Ejecutar la acción pendiente (editar skill/proyecto) tras login exitoso
    this.editGuard.consumePending();
  }

  logout() {
    this.auth.logout();
  }
}
