import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      title: "Dashboard Analítico",
      description: "Un panel de control administrativo completo con gráficos interactivos, tablas de datos y gestión de usuarios. Optimizado para rendimiento y accesibilidad.",
      tags: ["React", "Tailwind CSS", "Recharts", "TypeScript"],
      image: "https://images.unsplash.com/photo-1641567535859-c58187ac4954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2UlMjBtb2JpbGUlMjBhcHB8ZW58MXx8fHwxNzY5NDUyNjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      title: "E-commerce Moderno",
      description: "Tienda en línea con carrito de compras, pasarela de pago simulada y filtrado avanzado de productos. Diseño totalmente responsivo.",
      tags: ["React", "Redux", "Stripe API", "Styled Components"],
      image: "https://images.unsplash.com/photo-1661870139279-95fecab7c53a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlLWNvbW1lcmNlJTIwd2Vic2l0ZSUyMG1vZGVybnxlbnwxfHx8fDE3Njk0NTI2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      title: "Landing Page Corporativa",
      description: "Página de aterrizaje de alta conversión para una startup tecnológica. Incluye animaciones suaves y formularios integrados.",
      tags: ["React", "Framer Motion", "Tailwind CSS"],
      image: "https://images.unsplash.com/photo-1561291349-2f23e640ac9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kaW5nJTIwcGFnZSUyMGNyZWF0aXZlJTIwZGVzaWduJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Njk0NTI2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      demoUrl: "#",
      repoUrl: "#"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl transition-colors">Proyectos Destacados</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-colors">
            Una selección de mis trabajos recientes donde aplico mis conocimientos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={project.demoUrl} className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-colors transform hover:scale-110" title="Ver Demo">
                    <ExternalLink size={24} />
                  </a>
                  <a href={project.repoUrl} className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition-colors transform hover:scale-110" title="Ver Código">
                    <Github size={24} />
                  </a>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 transition-colors flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  {project.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
