import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Headphones, Globe, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TourCard from '@/components/tours/TourCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import heroImage from '@/assets/vr-hero.jpg';

const Index = () => {
  const tours = useSelector((state: RootState) => state.tours.tours.slice(0, 3));

  const features = [
    {
      icon: Globe,
      title: 'Esperienza 360°',
      description: 'Immergiti completamente in mondi virtuali con video e audio a 360 gradi'
    },
    {
      icon: Users,
      title: 'Tour di Gruppo',
      description: 'Condividi l\'esperienza con amici e famiglia in sessioni multiplayer'
    },
    {
      icon: Zap,
      title: 'Tecnologia Avanzata',
      description: 'Dispositivi VR di ultima generazione per un\'esperienza coinvolgente'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 vr-gradient-subtle opacity-80" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              <Headphones className="w-4 h-4 mr-2" />
              Tecnologia VR di Nuova Generazione
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 vr-text-glow">
              Esplora Mondi
              <span className="block vr-gradient bg-clip-text text-transparent">
                Impossibili
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vivi esperienze immersive uniche attraverso la realtà virtuale. 
              Viaggia nel tempo, esplora l'oceano, vola nello spazio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="hero" className="text-lg px-8 py-4" asChild>
                <Link to="/tours">
                  <Play className="w-5 h-5 mr-2" />
                  Inizia il Viaggio
                </Link>
              </Button>
              <Button size="lg" variant="glass" className="text-lg px-8 py-4" asChild>
                <Link to="/demo">
                  Guarda Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perché Scegliere <span className="vr-gradient bg-clip-text text-transparent">VR Tours</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La tecnologia più avanzata per esperienze che sembrano reali
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 vr-glass rounded-2xl border border-white/10"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 px-4 vr-gradient-subtle">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tour in Evidenza
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scopri le nostre esperienze più popolari
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/tours">
                Vedi Tutti i Tour
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-12 vr-glass rounded-3xl border border-white/10"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto per l'<span className="vr-gradient bg-clip-text text-transparent">Avventura</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Prenota ora la tua esperienza VR e scopri un mondo di possibilità infinite
            </p>
            <Button size="lg" variant="hero" className="text-lg px-8 py-4" asChild>
              <Link to="/tours">
                Prenota Subito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
