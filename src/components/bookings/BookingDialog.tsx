import React, { useMemo, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Power, UserCheck, UserX } from "lucide-react";
import type { Tour } from "@/store/slices/toursSlice";

interface Device {
  id: string;
  name: string;
  activated: boolean; // true: attivo, false: disabilitato
  occupied: boolean; // valido solo se activated
}

interface Room {
  id: string;
  name: string;
  devices: Device[];
}

const buildRooms = (): Room[] => [
  {
    id: "room-a",
    name: "Stanza A",
    devices: Array.from({ length: 5 }, (_, i) => ({
      id: `A-${i + 1}`,
      name: `Visore A${i + 1}`,
      activated: i % 5 !== 1,
      occupied: i % 3 === 0,
    })),
  },
  {
    id: "room-b",
    name: "Stanza B",
    devices: Array.from({ length: 5 }, (_, i) => ({
      id: `B-${i + 1}`,
      name: `Visore B${i + 1}`,
      activated: i % 4 !== 2,
      occupied: i % 2 === 0,
    })),
  },
];

interface BookingDialogProps {
  tour: Tour;
  triggerText?: string;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ tour, triggerText = "Prenota Ora" }) => {
  const { toast } = useToast();
  const rooms = useMemo(() => buildRooms(), []);

  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const room = useMemo(() => rooms.find(r => r.id === roomId)!, [rooms, roomId]);

  const toggleDevice = (id: string) => {
    setSelectedDevices(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !time || selectedDevices.length === 0) {
      toast({ title: "Compila tutti i campi", description: "Seleziona almeno un dispositivo disponibile.", variant: "destructive" });
      return;
    }
    toast({
      title: "Prenotazione inviata",
      description: `${tour.title} il ${date} alle ${time} — ${room.name}, dispositivi: ${selectedDevices.join(", ")}`,
    });
    setOpen(false);
    // reset semplice
    setSelectedDevices([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm" className="flex-1">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prenota: {tour.title}</DialogTitle>
          <DialogDescription>
            Seleziona stanza, dispositivi e inserisci i dati per confermare la prenotazione.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Mario Rossi" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="mario@esempio.it" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ora</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Stanza</Label>
              <Select value={roomId} onValueChange={(val) => { setRoomId(val); setSelectedDevices([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una stanza" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2"><Monitor className="w-4 h-4 text-primary" /> Dispositivi ({room.name})</h4>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const totals = room.devices.reduce(
                    (acc, d) => {
                      if (!d.activated) acc.disabled++;
                      else if (d.occupied) acc.busy++;
                      else acc.free++;
                      acc.active = room.devices.length - acc.disabled;
                      return acc;
                    },
                    { active: 0, disabled: 0, busy: 0, free: 0 }
                  );
                  return (
                    <>
                      <Badge>Attivi: {totals.active}</Badge>
                      <Badge variant="destructive">Disabilitati: {totals.disabled}</Badge>
                      <Badge variant="secondary">Liberi: {totals.free}</Badge>
                      <Badge variant="outline">Occupati: {totals.busy}</Badge>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.devices.map((d) => {
                const isDisabled = !d.activated;
                const isBusy = d.activated && d.occupied;
                const isFree = d.activated && !d.occupied;
                const checked = selectedDevices.includes(d.id);
                const canSelect = isFree;
                return (
                  <div key={d.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge variant={isDisabled ? "destructive" : "outline"} className="flex items-center gap-1">
                          <Power className="w-3.5 h-3.5" /> {isDisabled ? "Disabilitato" : "Attivo"}
                        </Badge>
                        {isFree && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> Libero
                          </Badge>
                        )}
                        {isBusy && (
                          <Badge className="flex items-center gap-1">
                            <UserX className="w-3.5 h-3.5" /> Occupato
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Checkbox
                      checked={checked}
                      disabled={!canSelect}
                      onCheckedChange={(val) => {
                        if (typeof val === "boolean") {
                          if (val) toggleDevice(d.id); else setSelectedDevices(prev => prev.filter(x => x !== d.id));
                        } else {
                          // treat indeterminate as false
                          setSelectedDevices(prev => prev.filter(x => x !== d.id));
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" variant="hero">Conferma Prenotazione</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
