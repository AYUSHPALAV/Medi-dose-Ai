import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants
  const navbarVariants = {
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hidden: { 
      y: -50, 
      opacity: 0 
    }
  };

  const logoVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const linkVariants = {
    rest: { 
      scale: 1,
      backgroundColor: "rgba(79, 70, 229, 0)",
      color: "rgba(255, 255, 255, 1)"
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "rgba(79, 70, 229, 0.5)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    active: {
      scale: 1,
      backgroundColor: "rgba(79, 70, 229, 0.8)",
      color: "rgba(255, 255, 255, 1)"
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

 
  const BackgroundParticles = () => {
    
    const particles = Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full opacity-0"
        style={{
          height: Math.random() * 3 + 1,
          width: Math.random() * 3 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0, 0.4, 0],
          scale: [0, 1, 0],
          x: [0, Math.random() * 20 - 10],
          y: [0, Math.random() * 20 - 10],
        }}
        transition={{
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: Math.random() * 5,
        }}
      />
    ));

    return particles;
  };

  
  const WaveAnimation = () => {
    return (
      <svg 
        className="absolute top-0 left-0 w-full h-full opacity-20" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
      >
        <motion.path 
          d="M0,50 C200,70 400,30 600,50 C800,70 1000,30 1200,50 L1440,50 L1440,100 L0,100 Z"
          fill="url(#nav-gradient)"
          animate={{
            d: [
              "M0,50 C200,70 400,30 600,50 C800,70 1000,30 1200,50 L1440,50 L1440,100 L0,100 Z",
              "M0,60 C200,40 400,80 600,60 C800,40 1000,80 1200,60 L1440,60 L1440,100 L0,100 Z",
              "M0,50 C200,70 400,30 600,50 C800,70 1000,30 1200,50 L1440,50 L1440,100 L0,100 Z"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <defs>
          <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Pulsing glow effect
  const PulsingGlow = () => {
    return (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-30"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
    );
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 overflow-hidden ${scrolled ? 'bg-indigo-800/90 shadow-lg backdrop-blur-sm' : 'bg-indigo-700/90 backdrop-blur-sm'}`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      {/* Living background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <PulsingGlow />
        <WaveAnimation />
        <BackgroundParticles />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <motion.div
                variants={logoVariants}
                initial="rest"
                whileHover="hover"
                className="flex items-center"
              >
                {/* Logo SVG */}
                <svg width="34" height="34" viewBox="0 0 34 34" className="mr-2">
                  <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="17" cy="17" r="16" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" />
                  <path
                    d="M10,17 L24,17 M17,10 L17,24"
                    stroke="url(#logo-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  <motion.circle 
                    cx="17" 
                    cy="17" 
                    r="6" 
                    fill="url(#logo-gradient)" 
                    opacity="0.8"
                    animate={{
                      opacity: [0.6, 0.9, 0.6],
                      r: [5.5, 6.5, 5.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </svg>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
                  MediDose AI
                </span>
                {/* Glowing dot effect */}
                <motion.div 
                  className="absolute w-1 h-1 rounded-full bg-purple-300"
                  style={{ top: '50%', left: '50%', filter: 'blur(1px)' }}
                  animate={{
                    scale: [1, 3, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'New Prediction', path: '/predict' },
                  { name: 'About', path: '/about' }
                ].map((item) => (
                  <motion.div
                    key={item.name}
                    variants={linkVariants}
                    initial="rest"
                    animate={isActive(item.path) ? "active" : "rest"}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={item.path} 
                      className={`relative px-4 py-2 rounded-md text-sm font-medium overflow-hidden group`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive(item.path) && (
                        <motion.span 
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 h-0.5 w-full bg-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.span 
                        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-30 bg-white"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <motion.div 
            className="md:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-800/90 backdrop-blur-sm shadow-inner">
              {[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'New Prediction', path: '/predict' },
                { name: 'About', path: '/about' }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={mobileItemVariants}
                  custom={index}
                >
                  <Link 
                    to={item.path} 
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-gray-100 hover:bg-indigo-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      {item.name}
                      {isActive(item.path) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="ml-2 h-4 w-4 transform rotate-180" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;