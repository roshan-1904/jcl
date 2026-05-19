import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  fragment?: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Legacy', path: '/legacy' },
    { label: 'Team', path: '/members' },
    { label: 'Business', path: '/portfolio' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed z-[100] transition-all duration-500 ease-in-out px-6 py-3 flex justify-between items-center backdrop-blur-lg ${
        isScrolled 
          ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] rounded-2xl shadow-2xl border border-white/20 bg-white/80' 
          : 'top-0 w-full bg-transparent'
      }`}
    >
      {/* Logo & Credits */}
      <Link to="/" className="cursor-pointer group flex items-center space-x-4">
        <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
          <img 
            src="https://www.jcislmmidtown.com/assets/images/logo-default.png" 
            alt="Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1 font-semibold">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `relative px-5 py-2 transition-all duration-300 group ${
                isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`
            }
          >
            <span className="relative z-10">{item.label}</span>
            <span className={`absolute bottom-1 left-1/2 h-0.5 bg-primary transition-all duration-300 rounded-full -translate-x-1/2 ${
              location.pathname === item.path ? 'w-1/2' : 'w-0 group-hover:w-1/2'
            }`}></span>
            <span className="absolute inset-0 bg-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></span>
          </NavLink>
        ))}
      </div>

      {/* Action Button & Mobile Toggle */}
      <div className="flex items-center space-x-4">
        <Link to="/contact" className="hidden md:block btn-primary !py-2 !px-7 shadow-primary/30 hover:shadow-primary/50 overflow-hidden relative group">
          <span className="relative z-10">Join Now</span>
          <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden text-2xl text-gray-800 p-2 z-[110] relative transition-transform active:scale-90"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden transition-all animate-fade-in"
        ></div>
      )}

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div 
          className="fixed top-24 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col space-y-4 md:hidden z-[100] shadow-2xl border border-white/20 animate-slide-in-top origin-top"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `px-6 py-4 rounded-2xl font-bold text-lg text-gray-800 hover:bg-gray-50 flex items-center justify-between group transition-all ${
                  isActive ? 'text-primary bg-primary/10' : ''
                }`
              }
            >
              <span>{item.label}</span>
              <i className="fas fa-chevron-right text-xs text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
            </NavLink>
          ))}
          <div className="pt-4 border-t border-gray-100">
            <Link to="/contact" className="btn-primary w-full !py-4 shadow-xl shadow-primary/20 block text-center">Join Now</Link>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-in-top {
          animation: slideInTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInTop {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
