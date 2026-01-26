import { motion } from "motion/react";
import { Mail, MapPin, Send, Phone } from "lucide-react";
import { useState, FormEvent } from "react";

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.");
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl transition-colors">Hablemos</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-colors">
            ¿Tienes un proyecto en mente o quieres colaborar? ¡Me encantaría escucharte!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl overflow-hidden relative transition-colors h-full"
          >
            <h3 className="text-3xl font-bold mb-6">Información de Contacto</h3>
            <p className="text-blue-100 mb-12 text-lg">
              Estoy disponible para trabajos freelance y oportunidades a tiempo completo.
              ¡No dudes en contactarme para discutir tu próximo proyecto!
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-white/10 p-4 rounded-xl shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1">Email</h4>
                  <p className="text-blue-100 text-lg">hola@tu-email.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/10 p-4 rounded-xl shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1">Teléfono</h4>
                  <p className="text-blue-100 text-lg">+34 123 456 789</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/10 p-4 rounded-xl shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1">Ubicación</h4>
                  <p className="text-blue-100 text-lg">Madrid, España (Remoto)</p>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors h-full"
          >
            <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-center">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Enviando..." : (
                  <>
                    Enviar Mensaje <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
