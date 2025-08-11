import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TourCard from '@/components/tours/TourCard';
import { RootState } from '@/store/store';

const Tours = () => {
  const tours = useSelector((state: RootState) => state.tours.tours);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tutti i Tour' },
    { id: 'historical', label: 'Storici' },
    { id: 'nature', label: 'Natura' },
    { id: 'space', label: 'Spazio' },
    { id: 'underwater', label: 'Sottomarini' },
    { id: 'adventure', label: 'Avventura' },
  ];

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tutti i <span className="vr-gradient bg-clip-text text-transparent">Tour VR</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Esplora la nostra collezione completa di esperienze immersive in realtà virtuale
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 vr-glass p-6 rounded-2xl border border-white/10"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Cerca tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 vr-glass border-white/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Categoria:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "hero" : "glass"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Altri Filtri
            </Button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-muted-foreground">
            Trovati <span className="text-primary font-semibold">{filteredTours.length}</span> tour
            {selectedCategory !== 'all' && (
              <span> nella categoria <Badge variant="secondary" className="ml-2">
                {categories.find(c => c.id === selectedCategory)?.label}
              </Badge></span>
            )}
          </p>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour, index) => (
            <TourCard key={tour.id} tour={tour} index={index} />
          ))}
        </div>

        {/* No Results */}
        {filteredTours.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="vr-glass p-12 rounded-3xl border border-white/10 max-w-md mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Nessun tour trovato</h3>
              <p className="text-muted-foreground mb-6">
                Prova a modificare i filtri di ricerca o esplora altre categorie
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}>
                Cancella Filtri
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Tours;