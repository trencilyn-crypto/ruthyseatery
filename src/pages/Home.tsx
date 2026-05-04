import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Menu from '../components/Menu';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useSiteData } from '../context/SiteContext';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

import { Loader2 } from 'lucide-react';

const Home = () => {
  const { isLoggedIn, isLoading } = useSiteData();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Connecting to Backend...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <Contact />
      </main>
      <Footer />
      <Cart />
      
      {/* Floating Admin Button */}
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center space-x-2 border-2 border-amber-500 group"
      >
        <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
        <span className="font-bold">{isLoggedIn ? 'Go to Dashboard' : 'Admin Login'}</span>
      </Link>
    </div>
  );
};

export default Home;
