import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle
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
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  userId: string;
  tourId: string;
  tourTitle: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  participants: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    userId: '',
    tourId: '',
    date: '',
    time: '',
    participants: 1,
    status: 'pending' as 'confirmed' | 'pending' | 'cancelled' | 'completed',
    notes: ''
  });

  // Carica le prenotazioni dal backend
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8085/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        setFilteredBookings(data);
      } else {
        toast({
          title: "Errore",
          description: "Impossibile caricare le prenotazioni",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento prenotazioni:', error);
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
    fetchBookings();
  }, []);

  // Filtra le prenotazioni
  useEffect(() => {
    let filtered = bookings.filter(booking =>
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingBooking 
        ? `http://localhost:8085/api/bookings/${editingBooking.id}`
        : 'http://localhost:8085/api/bookings';
      
      const method = editingBooking ? 'PUT' : 'POST';

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
          description: editingBooking ? "Prenotazione aggiornata con successo" : "Prenotazione creata con successo"
        });
        setIsDialogOpen(false);
        resetForm();
        fetchBookings();
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

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: "Prenotazione eliminata con successo"
        });
        fetchBookings();
      } else {
        toast({
          title: "Errore",
          description: "Impossibile eliminare la prenotazione",
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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: "Stato prenotazione aggiornato"
        });
        fetchBookings();
      } else {
        toast({
          title: "Errore",
          description: "Impossibile aggiornare lo stato",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento stato:', error);
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      userId: booking.userId,
      tourId: booking.tourId,
      date: booking.date,
      time: booking.time,
      participants: booking.participants,
      status: booking.status,
      notes: booking.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      tourId: '',
      date: '',
      time: '',
      participants: 1,
      status: 'pending',
      notes: ''
    });
    setEditingBooking(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, label: 'Confermata', icon: CheckCircle },
      pending: { variant: 'secondary' as const, label: 'In Attesa', icon: Clock },
      cancelled: { variant: 'destructive' as const, label: 'Cancellata', icon: XCircle },
      completed: { variant: 'default' as const, label: 'Completata', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="vr-glass border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                Gestione Prenotazioni
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Gestisci tutte le prenotazioni dei tour VR
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
                  Nuova Prenotazione
                </Button>
              </DialogTrigger>
              <DialogContent className="vr-glass border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingBooking ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userId" className="text-white">ID Utente</Label>
                      <Input
                        id="userId"
                        value={formData.userId}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tourId" className="text-white">ID Tour</Label>
                      <Input
                        id="tourId"
                        value={formData.tourId}
                        onChange={(e) => setFormData({...formData, tourId: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-white">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-white">Orario</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="participants" className="text-white">Partecipanti</Label>
                      <Input
                        id="participants"
                        type="number"
                        min="1"
                        value={formData.participants}
                        onChange={(e) => setFormData({...formData, participants: parseInt(e.target.value)})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-white">Stato</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'confirmed' | 'pending' | 'cancelled' | 'completed'})}
                      className="w-full p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
                    >
                      <option value="pending">In Attesa</option>
                      <option value="confirmed">Confermata</option>
                      <option value="cancelled">Cancellata</option>
                      <option value="completed">Completata</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Note</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                      placeholder="Note aggiuntive..."
                    />
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
                      {isLoading ? 'Salvando...' : (editingBooking ? 'Aggiorna' : 'Crea')}
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
                placeholder="Cerca prenotazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 vr-glass border-white/20 text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
            >
              <option value="all">Tutti gli stati</option>
              <option value="pending">In Attesa</option>
              <option value="confirmed">Confermata</option>
              <option value="cancelled">Cancellata</option>
              <option value="completed">Completata</option>
            </select>
            <Button variant="outline" className="text-white border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filtri
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="vr-glass border-white/10">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Cliente</TableHead>
                  <TableHead className="text-white">Tour</TableHead>
                  <TableHead className="text-white">Data & Ora</TableHead>
                  <TableHead className="text-white">Partecipanti</TableHead>
                  <TableHead className="text-white">Prezzo</TableHead>
                  <TableHead className="text-white">Stato</TableHead>
                  <TableHead className="text-white">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-white/10">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-sm text-gray-400">{booking.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{booking.tourTitle}</TableCell>
                    <TableCell className="text-white">
                      <div>
                        <div>{new Date(booking.date).toLocaleDateString('it-IT')}</div>
                        <div className="text-sm text-gray-400">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{booking.participants}</TableCell>
                    <TableCell className="text-white">€{booking.totalPrice}</TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(booking)}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-xs p-1 rounded vr-glass border-white/20 text-white bg-transparent"
                        >
                          <option value="pending">In Attesa</option>
                          <option value="confirmed">Confermata</option>
                          <option value="cancelled">Cancellata</option>
                          <option value="completed">Completata</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredBookings.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nessuna prenotazione trovata</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsManagement;
