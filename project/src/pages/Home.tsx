import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Shield, Brain, Database, Activity } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef(null);
  
  
  const heroTextControls = useAnimation();
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      
      setMousePosition({ x, y });
      
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animate features section when in view
  useEffect(() => {
    if (featuresInView) {
      heroTextControls.start({ opacity: 1, y: 0 });
    }
  }, [featuresInView, heroTextControls]);
  
  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };
  
  // Feature card animation variants
  const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Hero text animation variants
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay) => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay: delay,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  // Enhanced floating elements for hero section
  const FloatingElements = () => {
    const elements = [
      { size: 60, delay: 0, speed: 25, startPos: { x: "10%", y: "20%" }, color: "teal" },
      { size: 40, delay: 5, speed: 20, startPos: { x: "80%", y: "10%" }, color: "cyan" },
      { size: 30, delay: 10, speed: 30, startPos: { x: "70%", y: "60%" }, color: "indigo" },
      { size: 50, delay: 7, speed: 35, startPos: { x: "20%", y: "70%" }, color: "purple" },
      { size: 25, delay: 2, speed: 40, startPos: { x: "40%", y: "30%" }, color: "teal" },
    ];

    return elements.map((el, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full bg-${el.color}-500 opacity-10 blur-lg`}
        style={{
          width: el.size,
          height: el.size,
          left: el.startPos.x,
          top: el.startPos.y,
        }}
        animate={{
          x: [0, 20, -20, 10, -10, 0],
          y: [0, -20, 20, -10, 10, 0],
          scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
          opacity: [0.1, 0.15, 0.1, 0.12, 0.08, 0.1],
        }}
        transition={{
          duration: el.speed,
          repeat: Infinity,
          delay: el.delay,
          ease: "linear",
        }}
      />
    ));
  };

  // Enhanced wave animation for hero section
  const WaveAnimation = () => {
    return (
      <svg 
        className="absolute bottom-0 left-0 w-full h-32 opacity-30 pointer-events-none" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <motion.path 
          d="M0,40 C280,80 720,0 1440,60 L1440,100 L0,100 Z"
          fill="url(#hero-gradient)"
          animate={{
            d: [
              "M0,40 C280,80 720,0 1440,60 L1440,100 L0,100 Z",
              "M0,60 C360,20 720,100 1440,40 L1440,100 L0,100 Z",
              "M0,40 C280,80 720,0 1440,60 L1440,100 L0,100 Z"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <defs>
          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Enhanced glowing orb animation
  const GlowingOrbs = () => {
    const orbs = [
      { size: 180, delay: 0, x: "10%", y: "20%", color: "from-teal-500/20 to-transparent" },
      { size: 220, delay: 2, x: "80%", y: "50%", color: "from-indigo-500/20 to-transparent" },
      { size: 150, delay: 1, x: "30%", y: "70%", color: "from-purple-500/20 to-transparent" },
    ];

    return orbs.map((orb, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full bg-gradient-radial ${orb.color} blur-xl`}
        style={{
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: orb.delay,
          ease: "easeInOut",
        }}
      />
    ));
  };

  // Background particle effect
  const ParticleBackground = () => {
    const particles = Array(50).fill().map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 opacity-30"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{
          x: [
            Math.random() * window.innerWidth,
            Math.random() * window.innerWidth,
            Math.random() * window.innerWidth
          ],
          y: [
            Math.random() * window.innerHeight,
            Math.random() * window.innerHeight,
            Math.random() * window.innerHeight
          ],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: Math.random() * 20 + 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
        }}
      />
    ));
    
    return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
  };
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Enhanced Interactive Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0" ref={backgroundRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-indigo-900 to-purple-900 opacity-80" />
        <ParticleBackground />
        <GlowingOrbs />
        <WaveAnimation />
        <FloatingElements />
        
        {/* Add animated mesh grid for tech feel */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* Content with higher z-index to appear above the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Enhanced Hero Section */}
        <motion.section 
          className="text-white py-20 pt-32 relative"
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-200 to-white"
                  custom={0.3}
                  variants={heroTextVariants}
                  initial="hidden"
                  animate={heroInView ? "visible" : "hidden"}
                >
                  Personalized Drug Dosage Recommendations
                </motion.h1>
                
                <motion.div 
                  className="h-1 w-20 bg-gradient-to-r from-teal-400 to-indigo-500 mb-6 rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  animate={heroInView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                
                <motion.p 
                  className="text-xl mb-8 text-gray-200"
                  custom={0.5}
                  variants={heroTextVariants}
                  initial="hidden"
                  animate={heroInView ? "visible" : "hidden"}
                >
                  <span className="font-medium text-teal-300">Leveraging AI</span> and 
                  <span className="font-medium text-indigo-300"> blockchain technology</span> to 
                  provide precise, personalized medication dosages for improved patient outcomes.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link 
                      to="/predict" 
                      className="block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-md font-medium text-center transition relative overflow-hidden group"
                    >
                      <span className="relative z-10">Get Started</span>
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Add subtle pulsing glow effect */}
                      <motion.span 
                        className="absolute -inset-1 rounded-md opacity-0 group-hover:opacity-40 bg-white blur-md"
                        animate={{
                          opacity: [0, 0.2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link 
                      to="/about" 
                      className="block border border-teal-400 text-teal-300 hover:text-white px-6 py-3 rounded-md font-medium text-center relative overflow-hidden group"
                    >
                      <span className="relative z-10">Learn More</span>
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-teal-500/50 to-indigo-500/50 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* Add tech-inspired decorative element */}
                <motion.div
                  className="hidden sm:block absolute -bottom-16 -left-24 opacity-20"
                  initial={{ opacity: 0, rotate: -20 }}
                  animate={heroInView ? { opacity: 0.2, rotate: 0 } : { opacity: 0, rotate: -20 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="url(#tech-gradient)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="url(#tech-gradient)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="url(#tech-gradient)" strokeWidth="1" />
                    <path d="M20,100 H180" stroke="url(#tech-gradient)" strokeWidth="0.5" />
                    <path d="M100,20 V180" stroke="url(#tech-gradient)" strokeWidth="0.5" />
                    <defs>
                      <linearGradient id="tech-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0D9488" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
              
              <motion.div 
                className="hidden md:block relative"
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {/* Add decorative floating elements around the image */}
                <motion.div 
                  className="absolute -top-6 -left-6 w-12 h-12 rounded-lg border border-teal-400/30 z-10"
                  animate={{
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full border border-indigo-400/30 z-10"
                  animate={{
                    rotate: [0, -90, -180, -270, -360],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Floating data points to enhance the medical tech theme */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-teal-400"
                    style={{
                      top: `${15 + i * 10}%`,
                      right: `${-5 + (i % 3) * 2}%`,
                    }}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2 + i,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                ))}
                
                {/* Main image with 3D tilt effect */}
                <motion.div
                  className="relative rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                  }}
                >
                  {/* Gradient overlay for the image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 via-transparent to-indigo-900/40 z-10" />
                  
                  {/* Glowing edges */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg blur opacity-30 z-0"
                    animate={{
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Medical Technology" 
                    className="relative z-0 object-cover w-full h-full rounded-lg shadow-inner"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Add tech-inspired floating elements at the bottom of the hero */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20 pointer-events-none">
            {Array(6).fill().map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-gradient-to-r from-teal-500 to-indigo-500 opacity-40"
                style={{
                  width: 100 + i * 50,
                  bottom: 10 + i * 3,
                  left: `${10 + i * 15}%`,
                  borderRadius: '4px',
                }}
                animate={{
                  x: [-20, 20, -20],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.section>

        {/* Features Section (preserved from original) */}
        <motion.section 
          className="py-16 bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg"
          ref={featuresRef}
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines machine learning with blockchain technology to deliver 
                accurate, transparent, and secure drug dosage recommendations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Database className="h-6 w-6 text-indigo-700" />,
                  title: "Data Collection",
                  description: "Securely input patient data including age, weight, genetic markers, and medical history."
                },
                {
                  icon: <Brain className="h-6 w-6 text-indigo-700" />,
                  title: "AI Analysis",
                  description: "Our machine learning models analyze the data to determine optimal drug dosages."
                },
                {
                  icon: <Shield className="h-6 w-6 text-indigo-700" />,
                  title: "Blockchain Verification",
                  description: "Recommendations are securely recorded on the blockchain for transparency and auditability."
                },
                {
                  icon: <Activity className="h-6 w-6 text-indigo-700" />,
                  title: "Personalized Results",
                  description: "Receive accurate dosage recommendations tailored to individual patient characteristics."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-50 bg-opacity-90 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  custom={i}
                  variants={featureCardVariants}
                  initial="hidden"
                  animate={featuresInView ? "visible" : "hidden"}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action (preserved from original) */}
        <motion.section 
          className="bg-indigo-100 bg-opacity-90 backdrop-filter backdrop-blur-sm py-16 relative overflow-hidden"
          ref={ctaRef}
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-300 rounded-full opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -left-24 -bottom-24 w-80 h-80 bg-purple-300 rounded-full opacity-30"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h2 
              className="text-3xl font-bold text-indigo-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              className="text-xl text-indigo-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience the future of personalized medicine with our AI-powered dosage recommendation platform.
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link 
                to="/predict" 
                className="bg-indigo-700 text-white px-8 py-4 rounded-md font-medium text-lg inline-block relative overflow-hidden group"
              >
                <span className="relative z-10">Make Your First Prediction</span>
                <motion.span 
                  className="absolute top-0 left-0 w-full h-full bg-indigo-800"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.span 
                  className="absolute -inset-1 rounded-md opacity-0 group-hover:opacity-20 bg-white blur-md"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;