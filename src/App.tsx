import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Bot, LineChart, Users, FileText, ArrowRight, ChevronRight } from 'lucide-react';




// --- ANIMATION VARIANTS ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUpSpring: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
};

const springHover: Variants = {
  hover: { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 30 } },
  tap: { scale: 0.98 }
};

// --- COMPONENTS ---



// 2. FÍSICAS DE ANIMACIÓN: Spotlight Hover Effect
const FeatureCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      variants={fadeUpSpring}
      whileHover="hover"
      whileTap="tap"
      className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between h-full backdrop-blur-xl group cursor-pointer"
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 rounded-3xl"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(12,171,227,0.15), transparent 40%)`,
        }}
      />
      <div className="z-10 relative">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-white/[0.1]">
          <Icon className="w-6 h-6 text-brand-light" />
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-neutral-400 leading-relaxed text-sm">{description}</p>
      </div>
      <div className="z-10 mt-8 relative flex items-center text-sm font-medium text-brand-light opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Conocer más <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  );
};

// A. Navbar (Sticky & Glass)
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/50 border-b border-white/5">
      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <img src="/logo.png" alt="HERMAR Logo" className="h-8 w-auto object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          {['Servicios', 'Soluciones', 'Casos de Éxito', 'Compañía'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200">
              {item}
            </a>
          ))}
        </div>
      </div>
      <motion.button
        variants={springHover}
        whileHover="hover"
        whileTap="tap"
        className="relative overflow-hidden px-5 py-2.5 rounded-full bg-brand-dark/20 border border-brand-light/30 text-white text-sm font-medium transition-all hover:bg-brand-dark/40 shadow-[0_0_15px_rgba(12,171,227,0.15)] hover:shadow-[0_0_25px_rgba(12,171,227,0.3)]"
      >
        <span className="relative z-10">Agendar Demo</span>
      </motion.button>
    </nav>
  );
};

// B. Hero Section (Inmersivo)
const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center min-h-screen justify-center overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-dark opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-light opacity-15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto z-10 flex flex-col items-center"
      >
        <motion.div variants={fadeUpSpring} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-8">
          <span className="text-sm font-medium text-neutral-300">✨ Transformación Digital Empresarial</span>
        </motion.div>
        
        <motion.h1 variants={fadeUpSpring} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none font-display mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
          Escala tu operación con precisión milimétrica.
        </motion.h1>
        
        <motion.p variants={fadeUpSpring} className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          Digitalización, automatización (RPA), y optimización de procesos contables, financieros y de RRHH para empresas que exigen la excelencia.
        </motion.p>
        
        <motion.div variants={fadeUpSpring} className="flex flex-col sm:flex-row items-center gap-4">
          <motion.button 
            variants={springHover}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-dark text-white font-medium shadow-[0_0_30px_rgba(12,171,227,0.3)] hover:shadow-[0_0_40px_rgba(12,171,227,0.5)] transition-shadow duration-300"
          >
            Iniciar Transformación <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button 
            variants={springHover}
            whileHover="hover"
            whileTap="tap"
            className="px-8 py-4 rounded-full border border-white/10 bg-transparent text-white font-medium hover:bg-white/[0.03] transition-colors"
          >
            Explorar Servicios
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};



// C. Bento Grid Section (Características/Servicios)
const BentoGrid = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="mb-16 md:text-center"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tighter text-white mb-4">
          Automatización a la medida de tu realidad
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Arquitectura modular para modernizar cada área crítica de tu negocio.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]"
      >
        <div className="md:col-span-2 md:row-span-1">
          <FeatureCard
            title="Automatización de Tareas (RPA)"
            description="Elimina la fricción operativa. Diseñamos robots de software que ejecutan procesos repetitivos con 100% de precisión y cero fatiga."
            icon={Bot}
          />
        </div>
        <div className="md:col-span-1 md:row-span-2">
          <FeatureCard
            title="Gestión Financiera"
            description="Visibilidad total. Conciliaciones bancarias automatizadas, reportes en tiempo real y proyecciones basadas en datos puros."
            icon={LineChart}
          />
        </div>
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Recursos Humanos"
            description="Nóminas inteligentes, onboarding automatizado y gestión del talento centralizada en una única fuente de verdad."
            icon={Users}
          />
        </div>
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Procesamiento Documental"
            description="Extracción de datos mediante IA. Convierte facturas, recibos y contratos en datos estructurados al instante."
            icon={FileText}
          />
        </div>
      </motion.div>
    </section>
  );
};

// D. Call To Action Final & Footer
const CTAAndFooter = () => {
  return (
    <footer className="relative pt-32 border-t border-white/5 mt-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-brand-dark/20 blur-[150px] rounded-t-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center mb-32 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold font-display tracking-tighter text-white mb-6"
        >
          Listo para el siguiente nivel
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-neutral-400 text-lg mb-10"
        >
          Únete a las empresas que ya están definiendo el futuro operativo.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover="hover"
          whileTap="tap"
          variants={springHover}
          className="px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-xl"
        >
          Contactar a Ventas
        </motion.button>
      </div>

      <div className="border-t border-white/10 flex flex-col md:flex-row items-center justify-between px-6 py-8 max-w-7xl mx-auto text-sm text-neutral-500 relative z-10">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} HERMAR Business Solutions. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <div className="min-h-screen relative selection:bg-brand-light/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
      </main>
      <CTAAndFooter />
    </div>
  );
}

export default App;
