import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillCategory {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent {
  skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Core',
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React', 'Angular']
    },
    {
      title: 'Estilos & UI',
      skills: ['Tailwind CSS', 'SASS/SCSS', 'Framer Motion', 'Material UI', 'Bootstrap']
    },
    {
      title: 'Herramientas',
      skills: ['Git & GitHub', 'VS Code', 'Vite', 'Webpack', 'NPM/Yarn', 'Figma']
    },
    {
      title: 'Otros',
      skills: ['REST APIs', 'GraphQL', 'SEO Básico', 'Accesibilidad (a11y)', 'Performance']
    }
  ];
}
