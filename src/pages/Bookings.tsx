import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Headphones, 
  Monitor,
  User,
  Eye,
  Trash2,
  Edit,
  X,
  Save
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourCategory: string;
  date: string;
  time: string;
  room: string;
  device: string;
  deviceType: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  participants: number;
  totalPrice: number;
  notes?: string;
}

// Mock data per le prenotazioni
const mockBookings: Booking[] = [
  {
    id: '1',
    tourId: '1',
    tourTitle: 'Ancient Rome Experience',
    tourCategory: 'historical',
    date: '2024-01-15',
    time: '14:30',
    room: 'Stanza A',
    device: 'Visore A1',
    deviceType: 'Oculus Quest 3',
    status: 'confirmed',
    participants: 2,
    totalPrice: 59.98,
    notes: 'Prima esperienza VR'
  },
  {
    id: '2',
    tourId: '3',
    tourTitle: 'International Space Station',
    tourCategory: 'space',
    date: '2024-01-16',
    time: '10:00',
    room: 'Stanza B',
    device: 'Visore B2',
    deviceType: 'HTC Vive Pro 2',
    status: 'pending',
    participants: 1,
    totalPrice: 39.99
  },
  {
    id: '3',
    tourId: '2',
    tourTitle: 'Deep Ocean Adventure',
    tourCategory: 'underwater',
    date: '2024-01-17',
    time: '16:45',
    room: 'Stanza A',
    device: 'Visore A3',
    deviceType: 'Oculus Quest 3',
    status: 'completed',
    participants: 3,
    totalPrice: 74.97,
    notes: 'Esperienza fantastica!'
  }
];

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    document.title = "Le Mie Prenotazioni | VR Tours";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Visualizza le tue prenotazioni VR: tour, stanze, dispositivi, orari e dettagli.";
    if (desc) desc.setAttribute("content", content);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, label: 'Confermata', color: 'bg-green-500/20 text-green-200' },
      pending: { variant: 'secondary' as const, label: 'In Attesa', color: 'bg-yellow-500/20 text-yellow-200' },
      cancelled: { variant: 'destructive' as const, label: 'Cancellata', color: 'bg-red-500/20 text-red-200' },
      completed: { variant: 'default' as const, label: 'Completata', color: 'bg-blue-500/20 text-blue-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      historical: '🏛️',
      space: '🚀',
      underwater: '🌊',
      nature: '🌿',
      adventure: '⛰️'
    };
    return icons[category as keyof typeof icons] || '🎯';
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditFormData({
      date: booking.date,
      time: booking.time,
      room: booking.room,
      device: booking.device,
      deviceType: booking.deviceType,
      participants: booking.participants,
      status: booking.status,
      notes: booking.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBooking) return;

    const updatedBookings = bookings.map(booking => 
      booking.id === editingBooking.id 
        ? { ...booking, ...editFormData }
        : booking
    );

    setBookings(updatedBookings);
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditFormData({});
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  return (
    <Layout>
      <header className="sr-only">
        <h1>Le Mie Prenotazioni VR</h1>
        <link rel="canonical" href={window.location.href} />
      </header>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Le Mie Prenotazioni</h2>
            <p className="text-muted-foreground">
              Benvenuto {user?.name || 'Utente'}, ecco le tue prenotazioni VR
            </p>
          </div>
          <Button variant="glass" asChild>
            <Link to="/tours">Nuova Prenotazione</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="vr-glass border-white/10">
            <CardContent className="p-12 text-center">
              <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nessuna Prenotazione</h3>
              <p className="text-muted-foreground mb-6">
                Non hai ancora effettuato nessuna prenotazione. Esplora i nostri tour VR!
              </p>
              <Button asChild>
                <Link to="/tours">Sfoglia i Tour</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="vr-glass border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryIcon(booking.tourCategory)}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{booking.tourTitle}</h3>
                        <p className="text-muted-foreground capitalize">{booking.tourCategory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data</p>
                        <p className="font-medium">{new Date(booking.date).toLocaleDateString('it-IT')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Orario</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Stanza</p>
                        <p className="font-medium">{booking.room}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dispositivo</p>
                        <p className="font-medium">{booking.device}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo Visore</p>
                        <p className="font-medium">{booking.deviceType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                          <div>
                        <p className="text-sm text-muted-foreground">Partecipanti</p>
                        <p className="font-medium">{booking.participants}</p>
                            </div>
                          </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-lg">€</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prezzo Totale</p>
                        <p className="font-medium text-lg">{booking.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-black/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Note:</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="vr-glass border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Modifica Prenotazione
              </DialogTitle>
            </DialogHeader>
            
            {editingBooking && (
              <div className="space-y-6">
                {/* Tour Info (Read Only) */}
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{getCategoryIcon(editingBooking.tourCategory)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{editingBooking.tourTitle}</h3>
                      <p className="text-muted-foreground capitalize">{editingBooking.tourCategory}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prezzo per persona: €{(editingBooking.totalPrice / editingBooking.participants).toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data */}
                  <div>
                    <Label htmlFor="date" className="text-white">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editFormData.date || ''}
                      onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                    />
                  </div>

                  {/* Orario */}
                  <div>
                    <Label htmlFor="time" className="text-white">Orario</Label>
                    <Input
                      id="time"
                      type="time"
                      value={editFormData.time || ''}
                      onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                    />
                  </div>

                  {/* Stanza */}
                  <div>
                    <Label htmlFor="room" className="text-white">Stanza</Label>
                    <Select 
                      value={editFormData.room || ''} 
                      onValueChange={(value) => setEditFormData({...editFormData, room: value})}
                    >
                      <SelectTrigger className="vr-glass border-white/20 text-white">
                        <SelectValue placeholder="Seleziona stanza" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stanza A">Stanza A</SelectItem>
                        <SelectItem value="Stanza B">Stanza B</SelectItem>
                        <SelectItem value="Stanza C">Stanza C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dispositivo */}
                  <div>
                    <Label htmlFor="device" className="text-white">Dispositivo</Label>
                    <Select 
                      value={editFormData.device || ''} 
                      onValueChange={(value) => setEditFormData({...editFormData, device: value})}
                    >
                      <SelectTrigger className="vr-glass border-white/20 text-white">
                        <SelectValue placeholder="Seleziona dispositivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visore A1">Visore A1</SelectItem>
                        <SelectItem value="Visore A2">Visore A2</SelectItem>
                        <SelectItem value="Visore A3">Visore A3</SelectItem>
                        <SelectItem value="Visore B1">Visore B1</SelectItem>
                        <SelectItem value="Visore B2">Visore B2</SelectItem>
                        <SelectItem value="Visore B3">Visore B3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo Visore */}
                  <div>
                    <Label htmlFor="deviceType" className="text-white">Tipo Visore</Label>
                    <Select 
                      value={editFormData.deviceType || ''} 
                      onValueChange={(value) => setEditFormData({...editFormData, deviceType: value})}
                    >
                      <SelectTrigger className="vr-glass border-white/20 text-white">
                        <SelectValue placeholder="Seleziona tipo visore" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oculus Quest 3">Oculus Quest 3</SelectItem>
                        <SelectItem value="HTC Vive Pro 2">HTC Vive Pro 2</SelectItem>
                        <SelectItem value="PlayStation VR2">PlayStation VR2</SelectItem>
                        <SelectItem value="Valve Index">Valve Index</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Partecipanti */}
                  <div>
                    <Label htmlFor="participants" className="text-white">Partecipanti</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      max="8"
                      value={editFormData.participants || ''}
                      onChange={(e) => setEditFormData({...editFormData, participants: parseInt(e.target.value)})}
                      className="vr-glass border-white/20 text-white"
                    />
                  </div>

                  {/* Stato */}
                  <div>
                    <Label htmlFor="status" className="text-white">Stato</Label>
                    <Select 
                      value={editFormData.status || ''} 
                      onValueChange={(value) => setEditFormData({...editFormData, status: value as any})}
                    >
                      <SelectTrigger className="vr-glass border-white/20 text-white">
                        <SelectValue placeholder="Seleziona stato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">In Attesa</SelectItem>
                        <SelectItem value="confirmed">Confermata</SelectItem>
                        <SelectItem value="completed">Completata</SelectItem>
                        <SelectItem value="cancelled">Cancellata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <Label htmlFor="notes" className="text-white">Note</Label>
                  <Textarea
                    id="notes"
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                    className="vr-glass border-white/20 text-white"
                    rows={3}
                    placeholder="Aggiungi note alla prenotazione..."
                  />
        </div>

                {/* Prezzo Totale (Read Only) */}
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Prezzo Totale:</span>
                    <span className="text-white text-xl font-bold">
                      €{((editFormData.participants || editingBooking.participants) * (editingBooking.totalPrice / editingBooking.participants)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="text-white border-white/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annulla
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salva Modifiche
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Bookings;
