import { Component, ViewChild } from '@angular/core';
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
import { inject } from '@angular/core';

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
    AdminLogin,           // ← modal global
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title    = 'portfolio-angular';
  heroImage = 'assets/DEV.png';

  @ViewChild(AdminLogin) loginModal!: AdminLogin;

  auth = inject(AuthService);

  openLogin() {
    this.loginModal.open();
  }

  onLoginSuccess() {
    // Auth state se actualiza automáticamente via AuthService signal
    // Todos los componentes que leen auth.isAuthenticated() reaccionan solos
  }

  logout() {
    this.auth.logout();
  }
}
