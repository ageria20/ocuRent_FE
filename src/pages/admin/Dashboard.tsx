import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Headphones, 
  Settings, 
  LogOut,
  BarChart3,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import Layout from '../../components/layout/Layout';
import ToursManagement from './ToursManagement';
import BookingsManagement from './BookingsManagement';
import DevicesManagement from './DevicesManagement';

type AdminSection = 'dashboard' | 'tours' | 'bookings' | 'devices';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'tours':
        return <ToursManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'devices':
        return <DevicesManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: BarChart3 },
    { id: 'tours' as AdminSection, label: 'Gestione Tours', icon: Headphones },
    { id: 'bookings' as AdminSection, label: 'Gestione Prenotazioni', icon: Calendar },
    { id: 'devices' as AdminSection, label: 'Gestione Dispositivi', icon: Settings },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-300">Gestione completa del sistema VR Tours</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-white border-white/20 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="vr-glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Menu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full justify-start ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Componente per la dashboard overview
const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <Card className="vr-glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Panoramica Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-white/10">
              <Headphones className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">12</h3>
              <p className="text-gray-300">Tours Attivi</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-white/10">
              <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">45</h3>
              <p className="text-gray-300">Prenotazioni Oggi</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg border border-white/10">
              <Settings className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">8</h3>
              <p className="text-gray-300">Dispositivi Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="vr-glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Azioni Rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 h-20"
              onClick={() => window.location.href = '/admin/tours'}
            >
              <Headphones className="w-6 h-6 mr-3" />
              Aggiungi Nuovo Tour
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 h-20"
              onClick={() => window.location.href = '/admin/bookings'}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Gestisci Prenotazioni
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 h-20"
              onClick={() => window.location.href = '/admin/devices'}
            >
              <Settings className="w-6 h-6 mr-3" />
              Configura Dispositivi
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10 h-20"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Visualizza Statistiche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
