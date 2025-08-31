import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Settings,
  Wifi,
  WifiOff,
  Power,
  PowerOff,
  Monitor,
  Smartphone
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

interface Device {
  id: string;
  name: string;
  type: 'headset' | 'controller' | 'sensor' | 'pc';
  model: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'maintenance';
  availability: 'available' | 'occupied' | 'reserved';
  location: string;
  lastMaintenance: string;
  notes?: string;
  ipAddress?: string;
  batteryLevel?: number;
}

const DevicesManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'headset' as 'headset' | 'controller' | 'sensor' | 'pc',
    model: '',
    serialNumber: '',
    status: 'online' as 'online' | 'offline' | 'maintenance',
    availability: 'available' as 'available' | 'occupied' | 'reserved',
    location: '',
    lastMaintenance: '',
    notes: '',
    ipAddress: '',
    batteryLevel: 100
  });

  // Carica i dispositivi dal backend
  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8085/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
        setFilteredDevices(data);
      } else {
        toast({
          title: "Errore",
          description: "Impossibile caricare i dispositivi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento dispositivi:', error);
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
    fetchDevices();
  }, []);

  // Filtra i dispositivi
  useEffect(() => {
    let filtered = devices.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(device => device.availability === availabilityFilter);
    }

    setFilteredDevices(filtered);
  }, [searchTerm, statusFilter, availabilityFilter, devices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingDevice 
        ? `http://localhost:8085/api/devices/${editingDevice.id}`
        : 'http://localhost:8085/api/devices';
      
      const method = editingDevice ? 'PUT' : 'POST';

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
          description: editingDevice ? "Dispositivo aggiornato con successo" : "Dispositivo creato con successo"
        });
        setIsDialogOpen(false);
        resetForm();
        fetchDevices();
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

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo dispositivo?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: "Dispositivo eliminato con successo"
        });
        fetchDevices();
      } else {
        toast({
          title: "Errore",
          description: "Impossibile eliminare il dispositivo",
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

  const handleStatusChange = async (deviceId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/devices/${deviceId}/status`, {
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
          description: "Stato dispositivo aggiornato"
        });
        fetchDevices();
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

  const handleAvailabilityChange = async (deviceId: string, newAvailability: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8085/api/devices/${deviceId}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ availability: newAvailability })
      });

      if (response.ok) {
        toast({
          title: "Successo",
          description: "Disponibilità dispositivo aggiornata"
        });
        fetchDevices();
      } else {
        toast({
          title: "Errore",
          description: "Impossibile aggiornare la disponibilità",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento disponibilità:', error);
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      model: device.model,
      serialNumber: device.serialNumber,
      status: device.status,
      availability: device.availability,
      location: device.location,
      lastMaintenance: device.lastMaintenance,
      notes: device.notes || '',
      ipAddress: device.ipAddress || '',
      batteryLevel: device.batteryLevel || 100
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'headset',
      model: '',
      serialNumber: '',
      status: 'online',
      availability: 'available',
      location: '',
      lastMaintenance: '',
      notes: '',
      ipAddress: '',
      batteryLevel: 100
    });
    setEditingDevice(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { variant: 'default' as const, label: 'Online', icon: Wifi },
      offline: { variant: 'secondary' as const, label: 'Offline', icon: WifiOff },
      maintenance: { variant: 'destructive' as const, label: 'Manutenzione', icon: Settings }
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

  const getAvailabilityBadge = (availability: string) => {
    const availabilityConfig = {
      available: { variant: 'default' as const, label: 'Disponibile', icon: Power },
      occupied: { variant: 'secondary' as const, label: 'Occupato', icon: PowerOff },
      reserved: { variant: 'destructive' as const, label: 'Riservato', icon: Settings }
    };

    const config = availabilityConfig[availability as keyof typeof availabilityConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getDeviceIcon = (type: string) => {
    const iconConfig = {
      headset: Monitor,
      controller: Smartphone,
      sensor: Settings,
      pc: Monitor
    };

    const Icon = iconConfig[type as keyof typeof iconConfig];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="vr-glass border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Gestione Dispositivi
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Gestisci tutti i dispositivi VR e il loro stato
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
                  Nuovo Dispositivo
                </Button>
              </DialogTrigger>
              <DialogContent className="vr-glass border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingDevice ? 'Modifica Dispositivo' : 'Nuovo Dispositivo'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-white">Tipo</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as 'headset' | 'controller' | 'sensor' | 'pc'})}
                        className="w-full p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
                      >
                        <option value="headset">Headset VR</option>
                        <option value="controller">Controller</option>
                        <option value="sensor">Sensore</option>
                        <option value="pc">PC</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="model" className="text-white">Modello</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="serialNumber" className="text-white">Numero Seriale</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-white">Stato</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'online' | 'offline' | 'maintenance'})}
                        className="w-full p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="maintenance">Manutenzione</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="availability" className="text-white">Disponibilità</Label>
                      <select
                        id="availability"
                        value={formData.availability}
                        onChange={(e) => setFormData({...formData, availability: e.target.value as 'available' | 'occupied' | 'reserved'})}
                        className="w-full p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
                      >
                        <option value="available">Disponibile</option>
                        <option value="occupied">Occupato</option>
                        <option value="reserved">Riservato</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="batteryLevel" className="text-white">Batteria (%)</Label>
                      <Input
                        id="batteryLevel"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.batteryLevel}
                        onChange={(e) => setFormData({...formData, batteryLevel: parseInt(e.target.value)})}
                        className="vr-glass border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-white">Posizione</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ipAddress" className="text-white">Indirizzo IP</Label>
                      <Input
                        id="ipAddress"
                        value={formData.ipAddress}
                        onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
                        className="vr-glass border-white/20 text-white"
                        placeholder="192.168.1.100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lastMaintenance" className="text-white">Ultima Manutenzione</Label>
                    <Input
                      id="lastMaintenance"
                      type="date"
                      value={formData.lastMaintenance}
                      onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Note</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="vr-glass border-white/20 text-white"
                      rows={3}
                      placeholder="Note aggiuntive sul dispositivo..."
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
                      {isLoading ? 'Salvando...' : (editingDevice ? 'Aggiorna' : 'Crea')}
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
                placeholder="Cerca dispositivi..."
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
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Manutenzione</option>
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="p-2 rounded-md vr-glass border-white/20 text-white bg-transparent"
            >
              <option value="all">Tutte le disponibilità</option>
              <option value="available">Disponibile</option>
              <option value="occupied">Occupato</option>
              <option value="reserved">Riservato</option>
            </select>
            <Button variant="outline" className="text-white border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filtri
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="vr-glass border-white/10">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Dispositivo</TableHead>
                  <TableHead className="text-white">Tipo</TableHead>
                  <TableHead className="text-white">Posizione</TableHead>
                  <TableHead className="text-white">Stato</TableHead>
                  <TableHead className="text-white">Disponibilità</TableHead>
                  <TableHead className="text-white">Batteria</TableHead>
                  <TableHead className="text-white">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id} className="border-white/10">
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-400">{device.model}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <Badge variant="outline" className="text-white border-white/20">
                        {device.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{device.location}</TableCell>
                    <TableCell>
                      {getStatusBadge(device.status)}
                    </TableCell>
                    <TableCell>
                      {getAvailabilityBadge(device.availability)}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              device.batteryLevel && device.batteryLevel > 50 
                                ? 'bg-green-500' 
                                : device.batteryLevel && device.batteryLevel > 20 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${device.batteryLevel || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{device.batteryLevel || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(device)}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(device.id)}
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <select
                          value={device.status}
                          onChange={(e) => handleStatusChange(device.id, e.target.value)}
                          className="text-xs p-1 rounded vr-glass border-white/20 text-white bg-transparent"
                        >
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="maintenance">Manutenzione</option>
                        </select>
                        <select
                          value={device.availability}
                          onChange={(e) => handleAvailabilityChange(device.id, e.target.value)}
                          className="text-xs p-1 rounded vr-glass border-white/20 text-white bg-transparent"
                        >
                          <option value="available">Disponibile</option>
                          <option value="occupied">Occupato</option>
                          <option value="reserved">Riservato</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDevices.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nessun dispositivo trovato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesManagement;
