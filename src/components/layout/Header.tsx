import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Headphones, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 vr-glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Headphones className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold vr-text-glow">VR Tours</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-smooth hover:text-primary ${isActive('/') ? 'text-primary' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/tours" 
              className={`transition-smooth hover:text-primary ${isActive('/tours') ? 'text-primary' : ''}`}
            >
              Tours
            </Link>
            <Link 
              to="/bookings" 
              className={`transition-smooth hover:text-primary ${isActive('/bookings') ? 'text-primary' : ''}`}
            >
              Prenotazioni
            </Link>
            <Link 
              to="/devices" 
              className={`transition-smooth hover:text-primary ${isActive('/devices') ? 'text-primary' : ''}`}
            >
              Dispositivi
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="glass" size="sm" asChild>
              <Link to="/login">
                <User className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Registrati</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;