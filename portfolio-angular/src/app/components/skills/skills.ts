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
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'Angular']
    },
    {
      title: 'Backend',
      skills: ['Spring Boot', 'Java', 'Postman', 'MySQL']
    },
    {
      title: 'Estilos & UI',
      skills: ['Tailwind CSS', 'SASS/SCSS', 'Framer Motion', 'Material UI', 'Bootstrap']
    },
    {
      title: 'DevOps & Herramientas',
      skills: ['Docker', 'Git & GitHub', 'VS Code', 'Figma']
    }
  ];
}
