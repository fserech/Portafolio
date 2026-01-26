import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

interface HeroProps {
  imageUrl: string;
}

export const Hero = ({ imageUrl }: HeroProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 lg:pr-12"
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 transition-colors">
              Front-End Developer
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 transition-colors">
              Creando experiencias web <span className="text-blue-600 dark:text-blue-500">modernas</span> y <span className="text-blue-600 dark:text-blue-500">eficientes</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl transition-colors">
              Especializado en construir interfaces de usuario excepcionales y accesibles. 
              Transformo diseños en código limpio y escalable usando tecnologías de vanguardia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#projects" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                Ver Proyectos <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#contact" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Contactar
              </a>
            </div>

            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors"><Github size={24} /></a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin size={24} /></a>
              <a href="#" className="hover:text-red-500 dark:hover:text-red-400 transition-colors"><Mail size={24} /></a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] lg:aspect-auto lg:h-[80vh] w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-overlay z-10"></div>
              <img 
                src={imageUrl} 
                alt="Developer Workspace" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-dots-pattern opacity-50 dark:opacity-20 hidden lg:block"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full -z-10 blur-3xl transition-colors"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
