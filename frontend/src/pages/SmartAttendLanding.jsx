import React, { useState, useEffect } from 'react';
import { FaUserCheck, FaMapMarkerAlt, FaChartLine, FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaMoon, FaSun } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdFace, MdLogin, MdPersonAddAlt1 } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const SmartAttendLanding = () => {
  // Theme state management
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  // Define vibrant color themes
  const lightColors = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500',
    primaryText: 'text-purple-700',
    secondary: 'bg-gradient-to-r from-cyan-500 to-emerald-500',
    accent: 'bg-gradient-to-br from-pink-500 to-orange-400',
    background: 'bg-white',
    card: 'bg-white shadow-lg hover:shadow-xl border border-purple-100',
    text: 'text-gray-800',
    secondaryText: 'text-gray-600',
    highlightText: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500',
    headingGradient: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600',
    button: {
      primary: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transform transition-all duration-200',
      secondary: 'bg-white text-purple-600 border border-purple-200 hover:border-purple-400 hover:shadow-lg',
      green: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg',
    }
  };
  
  const darkColors = {
    primary: 'bg-gradient-to-r from-violet-600 to-blue-600',
    primaryText: 'text-purple-400',
    secondary: 'bg-gradient-to-r from-cyan-600 to-teal-600',
    accent: 'bg-gradient-to-br from-pink-600 to-orange-500',
    background: 'bg-gray-900',
    card: 'bg-gray-800/80 backdrop-blur-md border border-gray-700 hover:border-violet-500/30',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    highlightText: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400',
    headingGradient: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400',
    button: {
      primary: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-glow-purple transform transition-all duration-200',
      secondary: 'bg-gray-800 text-violet-400 border border-violet-500/30 hover:border-violet-400',
      green: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-glow-teal',
    }
  };
  
  const colors = isDark ? darkColors : lightColors;
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const featureVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  };
  
  // For the floating elements animation
  const floatAnimation = {
    y: ['-5px', '5px'],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };
  
  // Scroll animation states
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Particle background effect
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) { // Increased particle count
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
  }, [isDark]); // Regenerate particles on theme change
  
  return (
    <div className={`min-h-screen w-full ${colors.background} overflow-hidden relative font-sans`}>
      {/* Custom CSS for improved font styling and glow effects */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .font-heading {
          font-family: 'Montserrat', sans-serif;
        }
        
        .shadow-glow-purple {
          box-shadow: 0 0 20px 0 rgba(124, 58, 237, 0.3);
        }
        
        .shadow-glow-teal {
          box-shadow: 0 0 20px 0 rgba(20, 184, 166, 0.3);
        }
      `}</style>
      
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${
              isDark
                ? particle.id % 3 === 0
                  ? 'bg-violet-500'
                  : particle.id % 3 === 1
                  ? 'bg-blue-500'
                  : 'bg-pink-500'
                : particle.id % 3 === 0
                ? 'bg-purple-500'
                : particle.id % 3 === 1
                ? 'bg-blue-400'
                : 'bg-pink-400'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: isDark ? 'blur(1px)' : 'none',
              transform: `scale(${1 + Math.random() * 0.5})`,
              transition: 'all 0.5s ease',
            }}
          />
        ))}
      </div>
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 backdrop-blur-md ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} border-b ${isDark ? 'border-gray-800' : 'border-purple-100'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors.accent}`}>
              <FaUserCheck className="text-white text-xl" />
            </div>
            <div>
              <h1 className={`text-xl font-bold font-heading ${colors.text} tracking-tight`}>Smart Attend</h1>
              <p className={`text-xs ${colors.secondaryText}`}>Attendance Redefined</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-all duration-300`}
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
            
            <button 
                onClick={()=>navigate('/login')}

              className={`px-4 py-2 rounded-lg flex items-center space-x-1 ${colors.button.secondary}`}
            >
              <MdLogin className="text-lg" />
                <span >Login</span>
            </button>
            
            <button 
                onClick={()=>navigate('/signup')}

              className={`px-4 py-2 rounded-lg flex items-center space-x-1 ${colors.button.primary}`}
            >
              <MdPersonAddAlt1 className="text-lg" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className={`text-sm uppercase tracking-wider font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                NEXT-GEN ATTENDANCE SYSTEM
              </h2>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-heading ${colors.headingGradient}`}>
                Redefining Presence Tracking
              </h1>
              <p className={`text-lg mb-8 max-w-lg ${colors.secondaryText}`}>
                Say goodbye to paper sheets and proxy attendance. Smart Attend combines facial recognition, GPS tracking, and real-time analytics to revolutionize how institutions manage attendance.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                onClick={()=>navigate('/login')}
                  className={`px-6 py-3 rounded-lg font-medium ${colors.button.primary} transform hover:translate-y-[-2px] transition-all`}
                >
                  Get Started
                </button>
                
                <button 
                onClick={()=>navigate('/signup')}

                  className={`px-6 py-3 rounded-lg font-medium ${colors.button.secondary} transform hover:translate-y-[-2px] transition-all`}
                >
                  SignUp
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div 
                className={`relative p-2 rounded-xl overflow-hidden ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-purple-50 border border-purple-100'}`}
              >
                <div className="relative rounded-lg overflow-hidden aspect-[7/4] shadow-xl">
                  <img 
                    src="/dashboardImg.png" 
                    alt="Smart Attend Dashboard" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating elements - dashboard widgets */}
                  <div 
                    className={`absolute top-10 -right-10 rounded-lg p-3 shadow-lg ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-purple-100'}`}
                    style={{ width: "140px" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                        <FaChartLine className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                      </div>
                      <div>
                        <p className={`text-xs ${colors.secondaryText}`}>Today's</p>
                        <p className={`text-sm font-bold ${colors.text}`}>92% Present</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`absolute bottom-10 -left-10 rounded-lg p-3 shadow-lg ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-purple-100'}`}
                    style={{ width: "160px" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                        <MdFace className={isDark ? 'text-teal-400' : 'text-teal-600'} />
                      </div>
                      <div>
                        <p className={`text-xs ${colors.secondaryText}`}>Verified</p>
                        <p className={`text-sm font-bold ${colors.text}`}>54 Students</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Problem Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-purple-50'}`}>
        <div className="container mx-auto px-4">
          <div 
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-heading ${colors.text}`}>The Problem We Solved</h2>
            <p className={`text-xl font-light italic mb-4 ${colors.secondaryText}`}>
              "Attendance is a necessity, but the traditional process is broken."
            </p>
          </div>
          
          <div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div 
              className={`rounded-xl p-6 ${colors.card} transform hover:scale-105 transition-all duration-300`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-violet-100'}`}>
                <HiOutlineDocumentReport className={`text-2xl ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>Paper-Based Process</h3>
              <p className={`${colors.secondaryText}`}>
                Attendance sheets are still paper-based in many institutions, leading to inefficiency and errors.
              </p>
            </div>
            
            <div 
              className={`rounded-xl p-6 ${colors.card} transform hover:scale-105 transition-all duration-300`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-violet-100'}`}>
                <FaChalkboardTeacher className={`text-2xl ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>Time Wasted</h3>
              <p className={`${colors.secondaryText}`}>
                Teachers waste valuable lecture time managing attendance manually instead of teaching.
              </p>
            </div>
            
            <div 
              className={`rounded-xl p-6 ${colors.card} transform hover:scale-105 transition-all duration-300`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-violet-100'}`}>
                <FaUserGraduate className={`text-2xl ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>Proxy Attendance</h3>
              <p className={`${colors.secondaryText}`}>
                Proxy attendance is easy and common, undermining the purpose of tracking student presence.
              </p>
            </div>
            
            <div 
              className={`rounded-xl p-6 ${colors.card} transform hover:scale-105 transition-all duration-300`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-violet-100'}`}>
                <FaChartLine className={`text-2xl ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>No Real-Time Data</h3>
              <p className={`${colors.secondaryText}`}>
                No real-time visibility into student presence or participation trends for administrators.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Solution Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-16"
          >
            <h2 className={`text-sm uppercase tracking-wider font-semibold mb-2 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
              OUR SOLUTION
            </h2>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 font-heading ${colors.headingGradient}`}>
              Smart Fix for Attendance Tracking
            </h3>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div 
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <div 
                className="grid grid-cols-1 gap-6"
              >
                <div 
                  className={`flex gap-4 p-5 rounded-xl ${colors.card} border-l-4 ${isDark ? 'border-l-violet-600' : 'border-l-violet-500'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-violet-900 to-violet-700' : 'bg-violet-100'}`}>
                    <MdFace className={`text-2xl ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>Facial Recognition</h3>
                    <p className={`${colors.secondaryText}`}>
                      Advanced AI verifies student identity in real-time, eliminating proxy attendance.
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`flex gap-4 p-5 rounded-xl ${colors.card} border-l-4 ${isDark ? 'border-l-blue-600' : 'border-l-blue-500'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-700' : 'bg-blue-100'}`}>
                    <FaMapMarkerAlt className={`text-2xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>GPS Location Tracking</h3>
                    <p className={`${colors.secondaryText}`}>
                      Ensures students are physically present within the campus or classroom.
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`flex gap-4 p-5 rounded-xl ${colors.card} border-l-4 ${isDark ? 'border-l-pink-600' : 'border-l-pink-500'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-pink-900 to-pink-700' : 'bg-pink-100'}`}>
                    <FaUserShield className={`text-2xl ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>Role-Based Access</h3>
                    <p className={`${colors.secondaryText}`}>
                      Dedicated portals for Administrators, Teachers, and Students with unique features.
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`flex gap-4 p-5 rounded-xl ${colors.card} border-l-4 ${isDark ? 'border-l-teal-600' : 'border-l-teal-500'}`}
                >
                  <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-teal-900 to-teal-700' : 'bg-teal-100'}`}>
                    <FaChartLine className={`text-2xl ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>Real-Time Analytics</h3>
                    <p className={`${colors.secondaryText}`}>
                      Comprehensive dashboards showing attendance trends, class participation, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <div 
                className={`relative p-2 rounded-xl overflow-hidden ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-purple-50 border border-purple-100'}`}
              >
                <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/api/placeholder/600/450" 
                    alt="Smart Attend Features" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Animated rings */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
                  >
                    <div 
                      className={`h-32 w-32 rounded-full border-4 ${isDark ? 'border-violet-500/30' : 'border-violet-400/30'}`}
                    />
                    <div 
                      className={`absolute h-48 w-48 rounded-full border-4 ${isDark ? 'border-pink-500/20' : 'border-pink-400/20'}`}
                    />
                    <div 
                      className={`absolute h-64 w-64 rounded-full border-4 ${isDark ? 'border-blue-500/10' : 'border-blue-400/10'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-purple-50'}`}>
        <div className="container mx-auto px-4">
          <div 
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 font-heading ${colors.headingGradient}`}>
              Ready to Transform Attendance Management?
            </h2>
            <p className={`text-lg mb-8 ${colors.secondaryText}`}>
              Join thousands of institutions that have already revolutionized their attendance systems with Smart Attend.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                className={`px-8 py-4 rounded-lg font-medium text-lg ${colors.button.primary} shadow-xl transform hover:translate-y-[-3px] transition-all`}
              >
                Get Started Now
              </button>
              
              <button 
                className={`px-8 py-4 rounded-lg font-medium text-lg ${colors.button.green} transform hover:translate-y-[-3px] transition-all`}
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-violet-900'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors.accent}`}>
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading">Smart Attend</h2>
                <p className="text-xs text-gray-400">© 2025 All Rights Reserved</p>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartAttendLanding;