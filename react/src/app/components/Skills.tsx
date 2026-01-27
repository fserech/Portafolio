import { motion } from "motion/react";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Core",
      skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Angular (Básico)"]
    },
    {
      title: "Estilos & UI",
      skills: ["Tailwind CSS", "SASS/SCSS", "Framer Motion", "Material UI", "Bootstrap"]
    },
    {
      title: "Herramientas",
      skills: ["Git & GitHub", "VS Code", "Vite", "Webpack", "NPM/Yarn", "Figma"]
    },
    {
      title: "Otros",
      skills: ["REST APIs", "GraphQL", "SEO Básico", "Accesibilidad (a11y)", "Performance"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl transition-colors">Habilidades Técnicas</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-colors">
            Mi stack tecnológico actual y herramientas que utilizo en mi día a día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-none transition-all p-8 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gray-700 transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
