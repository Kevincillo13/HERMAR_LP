import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate, type Variants } from 'framer-motion';
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
  const divRef = useRef<HTMLAnchorElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current || isFocused) return;
    const { left, top } = divRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleFocus = () => { setIsFocused(true); setOpacity(1); };
  const handleBlur = () => { setIsFocused(false); setOpacity(0); };
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  // 3D Tilt calculations
  const rotateX = useTransform(mouseY, [0, 400], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 600], [-5, 5]);

  return (
    <motion.a
      href={`https://wa.me/526361325388?text=Hola%20H%C3%A9ctor,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20el%20servicio%20de%20${encodeURIComponent(title)}.`}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUpSpring}
      style={{
        rotateX: isFocused ? 0 : rotateX,
        rotateY: isFocused ? 0 : rotateY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/10 p-10 flex flex-col justify-between h-full backdrop-blur-2xl group cursor-pointer block transition-colors hover:border-brand-light/30"
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 rounded-[2rem]"
        style={{
          opacity,
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(12,171,227,0.1), transparent 80%)`,
        }}
      />
      
      <div className="z-10 relative" style={{ transform: "translateZ(50px)" }}>
        <div className="w-14 h-14 rounded-2xl bg-brand-dark/20 border border-brand-light/20 flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-dark/40 group-hover:border-brand-light/50 group-hover:shadow-[0_0_30px_rgba(12,171,227,0.2)]">
          <Icon className="w-7 h-7 text-brand-light" />
        </div>
        <h3 className="text-2xl font-bold font-display text-white mb-4 tracking-tight group-hover:text-brand-light transition-colors">
          {title}
        </h3>
        <p className="text-neutral-400 leading-relaxed text-base group-hover:text-neutral-300 transition-colors">
          {description}
        </p>
      </div>

      <div className="z-10 mt-10 relative flex items-center text-sm font-bold uppercase tracking-widest text-brand-light opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
        <span className="mr-2">Saber más</span> <ChevronRight className="w-4 h-4" />
      </div>
    </motion.a>
  );
};

// A. Navbar (Sticky & Glass)
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-background/50 border-b border-white/5">
      <div className="flex items-center">
        <img src="/logo.png" alt="HERMAR Logo" className="h-12 w-auto object-contain" />
      </div>
      <motion.a
        href="https://wa.me/526361325388?text=Hola%20H%C3%A9ctor,%20vengo%20de%20la%20Landing%20Page%20y%20me%20gustar%C3%ADa%20agendar%20una%20Demo%20de%20sus%20servicios."
        target="_blank"
        rel="noopener noreferrer"
        variants={springHover}
        whileHover="hover"
        whileTap="tap"
        className="relative overflow-hidden px-5 py-2.5 rounded-full bg-brand-dark/20 border border-brand-light/30 text-white text-sm font-medium transition-all hover:bg-brand-dark/40 shadow-[0_0_15px_rgba(12,171,227,0.15)] hover:shadow-[0_0_25px_rgba(12,171,227,0.3)] block cursor-pointer"
      >
        <span className="relative z-10">Agendar Demo</span>
      </motion.a>
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
            <motion.a
              href="https://wa.me/526361325388?text=Hola%20H%C3%A9ctor,%20vengo%20de%20la%20Landing%20Page%20y%20me%20gustar%C3%ADa%20iniciar%20el%20proceso%20de%20Transformaci%C3%B3n%20Digital%20en%20mi%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              variants={springHover}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-brand-dark text-white font-medium shadow-[0_0_30px_rgba(12,171,227,0.3)] hover:shadow-[0_0_40px_rgba(12,171,227,0.5)] transition-shadow duration-300 cursor-pointer"
            >
              Iniciar Transformación <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#servicios"
              variants={springHover}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-4 rounded-full border border-white/10 bg-transparent text-white font-medium hover:bg-white/[0.03] transition-colors w-full sm:w-auto text-center cursor-pointer"
            >
              Explorar Servicios
            </motion.a>
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
    <section id="servicios" className="py-40 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24 overflow-hidden">
      
      {/* --- BACKGROUND TECH ELEMENTS --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* 2. Animated Energy Beams */}
      <motion.div 
        animate={{ 
          top: ["-10%", "110%"],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-[20%] w-[1px] h-[20%] bg-gradient-to-b from-transparent via-brand-light/40 to-transparent blur-sm pointer-events-none"
      />
      <motion.div 
        animate={{ 
          top: ["110%", "-10%"],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute right-[15%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-brand-light/30 to-transparent blur-sm pointer-events-none"
      />

      {/* 3. Floating Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-dark/10 blur-[150px] rounded-full pointer-events-none" />

      {/* --- CONTENT --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="mb-24 md:text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-light/20 bg-brand-light/5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-light"></span>
          </span>
          Servicios Especializados
        </div>
        <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white mb-6 leading-tight">
          Automatización a la medida <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-white">de tu realidad</span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-xl leading-relaxed">
          Arquitectura modular para modernizar cada área crítica de tu negocio con tecnología de vanguardia.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:auto-rows-[400px] relative z-10"
      >
        {/* Tarjeta 1 (Destacada) */}
        <div className="md:col-span-2 md:row-span-1">
          <FeatureCard
            title="Análisis Documental y PDFs"
            description="Extracción inteligente de datos de facturas y reportes pesados. Convertimos documentos no estructurados en bases de datos limpias sin intervención humana, reduciendo errores en un 99%."
            icon={FileText}
          />
        </div>
        
        {/* Tarjeta 2 */}
        <div className="md:col-span-1 md:row-span-2">
          <FeatureCard
            title="Gestión de Tickets"
            description="Automatización de flujos para departamentos de Global Business Services. Clasificación inteligente, enrutamiento dinámico y resolución acelerada mediante agentes digitales."
            icon={Briefcase}
          />
        </div>

        {/* Tarjeta 3 */}
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Automatización Web"
            description="Agentes autónomos diseñados para interactuar con portales profesionales heredados, extrayendo y procesando información crítica en tiempo real."
            icon={GlobeIcon}
          />
        </div>

        {/* Tarjeta 4 */}
        <div className="md:col-span-1 md:row-span-1">
          <FeatureCard
            title="Normalización Financiera"
            description="Sustituimos el caos de macros en Excel por arquitecturas de datos sólidas, escalables y normalizadas para el área contable y fiscal."
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
        
        <motion.a
          href="https://wa.me/526361325388?text=Hola,%20me%20interesa%20agendar%20la%20Auditor%C3%ADa%20Gratuita%20para%20automatizar%20mi%20empresa."
          target="_blank"
          rel="noopener noreferrer"
          variants={springHover}
          whileHover="hover"
          whileTap="tap"
          className="inline-block px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] cursor-pointer"
        >
          Agendar Auditoría Gratuita
        </motion.a>
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
