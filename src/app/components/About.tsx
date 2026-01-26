import { motion } from "motion/react";
import { Code, Layout, Smartphone } from "lucide-react";

export const About = () => {
  const features = [
    {
      icon: <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Clean Code",
      description: "Escribo código legible, mantenible y escalable siguiendo las mejores prácticas de la industria."
    },
    {
      icon: <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Diseño Responsivo",
      description: "Mis aplicaciones se ven y funcionan perfectamente en cualquier dispositivo, desde móviles hasta pantallas grandes."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Mobile First",
      description: "Enfoque prioritario en la experiencia móvil para garantizar el mejor rendimiento y usabilidad."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl transition-colors">Sobre Mí</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-colors">
            Más que un desarrollador, soy un apasionado por crear soluciones digitales que impactan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 sm:p-12 text-white overflow-hidden relative transition-colors">
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
               <h3 className="text-2xl font-bold mb-4">¿Por qué trabajar conmigo?</h3>
               <p className="text-blue-100 mb-6 text-lg">
                 Combino habilidades técnicas sólidas con una gran capacidad de comunicación y trabajo en equipo. Me mantengo actualizado con las últimas tendencias de React y el ecosistema web moderno.
               </p>
             </div>
             <div className="grid grid-cols-2 gap-8">
               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                 <span className="block text-4xl font-bold mb-2">3+</span>
                 <span className="text-sm text-blue-100 uppercase tracking-wider">Años de Exp.</span>
               </div>
               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                 <span className="block text-4xl font-bold mb-2">20+</span>
                 <span className="text-sm text-blue-100 uppercase tracking-wider">Proyectos</span>
               </div>
             </div>
           </div>
           
           {/* Decorative circle */}
           <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};
