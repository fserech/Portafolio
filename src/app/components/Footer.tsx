import { Github, Linkedin, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 border-t border-gray-800 dark:border-gray-800 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">DEV<span className="text-blue-500">FOLIO</span></h3>
            <p className="text-sm text-gray-400">
              Construyendo el futuro de la web, un píxel a la vez.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 DevFolio. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Hecho con <Heart size={14} className="text-red-500 fill-red-500" /> usando React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};
