import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

const Navbar = () => {
  const { data } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8" style={{ color: isScrolled ? data.theme.accentColor : 'white' }} />
          <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            Ruthy <span style={{ color: data.theme.accentColor }}>Eatery</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              style={{ color: isScrolled ? undefined : 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = data.theme.accentColor}
              onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? '' : 'white'}
            >
              {link.name}
            </a>
          ))}
          <button 
            className="text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg"
            style={{ backgroundColor: data.theme.accentColor }}
          >
            Book a Table
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-xl text-gray-800 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold">
              Book a Table
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
