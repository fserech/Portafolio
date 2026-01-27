export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'enterprise' | 'ecommerce' | 'landing' | 'dashboard' | 'api' | 'other';
  technologies: string[];
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  year: number;
}

export interface ProjectsData {
  projects: Project[];
}
