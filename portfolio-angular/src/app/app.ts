import { Component } from '@angular/core';

import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { ProjectsComponent } from './components/projects/projects';
import { SkillsComponent } from './components/skills/skills';
import { CircuitBgComponent } from './components/circuit-bg/circuit-bg';
import { IncidentsComponent } from "./components/incidents/incidents";
import { ServicesComponent } from "./components/services/services";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    CircuitBgComponent,
    IncidentsComponent,
    ServicesComponent
],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title     = 'portfolio-angular';
}