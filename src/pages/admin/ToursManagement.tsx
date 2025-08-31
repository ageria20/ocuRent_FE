import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  status: 'active' | 'inactive';
  imageUrl: string;
  category: string;
}

const ToursManagement = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    price: 0,
    maxParticipants: 4,
    status: 'active' as 'active' | 'inactive',
    imageUrl: '',
    category: ''
  });

  // Carica i tours dal backend
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8085/api/tours', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTours(data);
        setFilteredTours(data);
      } else {
        toast({
          title: "Errore",
          description: "Impossibile caricare i tours",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento tours:', error);
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Filtra i tours in base al termine di ricerca
  useEffect(() => {
    const filtered = tours.filter(tour =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTours(filtered);
  }, [searchTerm, tours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingTour 
        ? `http://localhost:8085/api/tours/${editingTour.id}`
        : 'http://localhost:8085/api/tours';
      
      const method = editingTour ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: editingTour ? "Tour aggiornato con successo" : "Tour creato con successo"
        });
        setIsDialogOpen(false);
        resetForm();
        fetchTours();
      } else {
        toast({
          title: "Errore",
          description: "Operazione fallita",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nell\'operazione:', error);
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo tour?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/tours/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: "Tour eliminato con successo"
        });
        fetchTours();
      } else {
        toast({
          title: "Errore",
          description: "Impossibile eliminare il tour",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      duration: tour.duration,
      price: tour.price,
      maxParticipants: tour.maxParticipants,
      status: tour.status,
      imageUrl: tour.imageUrl,
      category: tour.category
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 30,
      price: 0,
      maxParticipants: 4,
      status: 'active',
      imageUrl: '',
      category: ''
    });
    setEditingTour(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="vr-glass border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center">
                <Headphones className="w-6 h-6 mr-3" />
                Gestione Tours
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Crea, modifica e gestisci i tour VR disponibili
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Tour
                </Button>
              </DialogTrigger>
              <DialogContent className="vr-glass border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingTour ? 'Modifica Tour' : 'Nuovo Tour'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Titolo</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-white">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-white">Descrizione</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration" className="text-white">Durata (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-white">Prezzo (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants" className="text-white">Max Partecipanti</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imageUrl" className="text-white">URL Immagine</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-white">Stato</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                      className="w-full p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
                    >
                      <option value="active">Attivo</option>
                      <option value="inactive">Inattivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="text-white border-white/20"
                    >
                      Annulla
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isLoading ? 'Salvando...' : (editingTour ? 'Aggiorna' : 'Crea')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="vr-glass border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cerca tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 vr-glass border-white/20 text-white"
              />
            </div>
            <Button variant="outline" className="text-white border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filtri
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tours Table */}
      <Card className="vr-glass border-white/10">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Tour</TableHead>
                  <TableHead className="text-white">Categoria</TableHead>
                  <TableHead className="text-white">Durata</TableHead>
                  <TableHead className="text-white">Prezzo</TableHead>
                  <TableHead className="text-white">Stato</TableHead>
                  <TableHead className="text-white">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour.id} className="border-white/10">
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-3">
                        <img
                          src={tour.imageUrl}
                          alt={tour.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{tour.title}</div>
                          <div className="text-sm text-gray-400">{tour.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{tour.category}</TableCell>
                    <TableCell className="text-white">{tour.duration} min</TableCell>
                    <TableCell className="text-white">€{tour.price}</TableCell>
                    <TableCell>
                      <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                        {tour.status === 'active' ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(tour)}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(tour.id)}
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTours.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nessun tour trovato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToursManagement;
