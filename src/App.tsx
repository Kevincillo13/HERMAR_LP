import React, { useState, useRef, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { FileText, ArrowRight, ChevronRight, Briefcase, Globe as GlobeIcon, Database } from 'lucide-react';
import Globe from 'react-globe.gl';




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
// --- COMPONENTE GLOBO 3D (react-globe.gl) ---
const HeroGlobe = () => {
  const [countries, setCountries] = useState({ features: [] });
  const globeRef = useRef<any>(null);

  useEffect(() => {
    // Descargar GeoJSON de países
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Posición inicial
      globeRef.current.pointOfView({ lat: 23.6345, lng: -102.5528, altitude: 2 }, 1000);
      
      // Configurar rotación automática
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [countries]);

  const handleMouseEnter = () => {
    if (globeRef.current) {
      // Detener rotación y centrar en México suavemente
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({ lat: 23.6345, lng: -102.5528, altitude: 2 }, 1000);
    }
  };

  const handleMouseLeave = () => {
    if (globeRef.current) {
      // Reanudar rotación automática
      globeRef.current.controls().autoRotate = true;
    }
  };

  return (
    // pointer-events-auto permite detectar el mouse
    // agregamos transición de hover:scale-105 para dar feedback visual
    <div 
      className="absolute right-[-60%] md:-right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] pointer-events-auto flex items-center justify-center z-0 opacity-30 md:opacity-100 mix-blend-screen md:mix-blend-normal transition-transform duration-700 ease-out hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Globe
        ref={globeRef}
        width={typeof window !== 'undefined' && window.innerWidth < 1024 ? 600 : 800}
        height={typeof window !== 'undefined' && window.innerWidth < 1024 ? 600 : 800}
        backgroundColor="rgba(0,0,0,0)"

        // Configuración de Países y resaltado fijo para México
        polygonsData={countries.features}
        polygonAltitude={(d: any) => (d.properties.ISO_A2 === 'MX' || d.properties.ADMIN === 'Mexico') ? 0.05 : 0.01}
        polygonCapColor={(d: any) => (d.properties.ISO_A2 === 'MX' || d.properties.ADMIN === 'Mexico') ? '#0CABE3' : 'rgba(10, 84, 168, 0.2)'}
        polygonSideColor={() => 'rgba(10, 84, 168, 0.1)'}
        polygonStrokeColor={() => '#0A54A8'}
      />
    </div>
  );
};


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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-background/50 border-b border-white/5">
      <div className="flex items-center">
        <img src="/logo.png" alt="HERMAR Logo" className="h-12 w-auto object-contain" />
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
    // 1. Contenedor Padre: Ocupa el 100% del ancho (w-full). Aquí va el overflow-hidden.
    <section className="relative pt-40 pb-20 flex flex-col items-center min-h-screen justify-center overflow-hidden w-full">

      {/* 2. Fondos y Globos: Al estar directos en el padre, se expanden sin cortarse */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-dark opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <HeroGlobe />

      {/* 3. Contenedor de Contenido: Restringido a max-w-7xl y centrado (mx-auto) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start text-left">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-3xl flex flex-col items-start"
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

          <motion.div variants={fadeUpSpring} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <motion.button
              variants={springHover}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-brand-dark text-white font-medium shadow-[0_0_30px_rgba(12,171,227,0.3)] hover:shadow-[0_0_40px_rgba(12,171,227,0.5)] transition-shadow duration-300"
            >
              Iniciar Transformación <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              variants={springHover}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-4 rounded-full border border-white/10 bg-transparent text-white font-medium hover:bg-white/[0.03] transition-colors w-full sm:w-auto text-center"
            >
              Explorar Servicios
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// 1. TechStackTicker (Prueba de Autoridad)
const TechStackTicker = () => {
  const techs = ["Python", "SAP", "Excel Avanzado", "Puppeteer", "Web Automation", "SQL Databases", "RPA Solutions"];
  
  return (
    <div className="w-full py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 text-center">
          Integración fluida con tu ecosistema tecnológico
        </p>
      </div>
      
      <div className="flex overflow-hidden group">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center pr-20"
        >
          {[...techs, ...techs].map((tech, idx) => (
            <span 
              key={idx} 
              className="text-2xl md:text-3xl font-display font-bold text-neutral-700 hover:text-brand-light transition-colors duration-500 cursor-default"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// C. Services Bento Grid (El Core del Negocio)
const ServicesBento = () => {
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[350px]"
      >
        {/* Tarjeta 1 (Destacada) */}
        <div className="md:col-span-2 md:row-span-1">
          <FeatureCard
            title="Análisis Documental y PDFs"
            description="Extracción inteligente de datos de facturas y reportes pesados. Convertimos documentos no estructurados en bases de datos limpias sin intervención humana."
            icon={FileText}
          />
        </div>
        
        {/* Tarjeta 2 */}
        <div className="md:col-span-1 md:row-span-2">
          <FeatureCard
            title="Gestión de Tickets"
            description="Automatización de flujos para departamentos de Global Business Services. Clasificación, enrutamiento y resolución rápida."
            icon={Briefcase}
          />
        </div>

        {/* Tarjeta 3 */}
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Automatización Web"
            description="Scripts a medida para interactuar con portales profesionales heredados, extrayendo información crítica al instante."
            icon={GlobeIcon}
          />
        </div>

        {/* Tarjeta 4 */}
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Normalización Financiera"
            description="Sustituimos el caos de macros en Excel por arquitecturas de datos sólidas y normalizadas para el área contable."
            icon={Database}
          />
        </div>
      </motion.div>
    </section>
  );
};

// 3. MetricsROI (El Cierre Analítico)
const MetricsROI = () => {
  const metrics = [
    { value: "99%", label: "Precisión en el procesamiento de datos" },
    { value: "10x", label: "Aceleración en ciclos operativos contables" },
    { value: "24/7", label: "Disponibilidad de procesos robotizados" }
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
          >
            <h2 className="text-7xl md:text-8xl font-black font-display tracking-tighter mb-4 bg-gradient-to-b from-brand-light to-white text-transparent bg-clip-text">
              {metric.value}
            </h2>
            <p className="text-neutral-400 font-medium max-w-[200px] mx-auto text-sm uppercase tracking-widest leading-relaxed">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// D. Final CTA & Professional Footer
const FinalCTA = () => {
  return (
    <section className="py-40 px-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-dark/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white mb-8"
        >
          Lleva tu administración a la nube y automatiza lo repetitivo.
        </motion.h2>
        
        <motion.button
          variants={springHover}
          whileHover="hover"
          whileTap="tap"
          className="px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
        >
          Agendar Auditoría Gratuita
        </motion.button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="text-xl font-display font-bold text-white tracking-tight">
            HERMAR Business Solutions
          </h3>
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
          <span className="hover:text-brand-light transition-colors">Innovación</span>
          <span className="text-white/10">•</span>
          <span className="hover:text-brand-light transition-colors">Calidad</span>
          <span className="text-white/10">•</span>
          <span className="hover:text-brand-light transition-colors">Honestidad</span>
          <span className="text-white/10">•</span>
          <span className="hover:text-brand-light transition-colors">Eficiencia</span>
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
        <TechStackTicker />
        <ServicesBento />
        <MetricsROI />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
