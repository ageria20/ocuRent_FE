import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Monitor, Power, UserCheck, UserX } from "lucide-react";

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
      activated: i % 5 !== 1, // uno disabilitato come esempio
      occupied: i % 3 === 0, // alcuni occupati come esempio
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

const Bookings = () => {
  const rooms = useMemo(() => buildRooms(), []);

  useEffect(() => {
    document.title = "Prenotazioni dispositivi VR | VR Tours";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Visualizza disponibilità: 2 stanze, 5 dispositivi ciascuna. Attivi, disabilitati, occupati, liberi.";
    if (desc) desc.setAttribute("content", content);
  }, []);

  return (
    <Layout>
      <header className="sr-only">
        <h1>Prenotazioni dispositivi VR</h1>
        <link rel="canonical" href={window.location.href} />
      </header>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Prenotazioni</h2>
            <p className="text-muted-foreground">Due stanze, cinque dispositivi per stanza.</p>
          </div>
          <Button variant="glass" asChild>
            <Link to="/tours">Vai ai Tours</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {rooms.map((room) => {
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
              <Card key={room.id} className="vr-glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary" /> {room.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Attivi: {totals.active}</Badge>
                      <Badge variant="destructive">Disabilitati: {totals.disabled}</Badge>
                      <Badge variant="secondary">Liberi: {totals.free}</Badge>
                      <Badge variant="outline">Occupati: {totals.busy}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {room.devices.map((d) => {
                      const isDisabled = !d.activated;
                      const isBusy = d.activated && d.occupied;
                      const isFree = d.activated && !d.occupied;

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
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ID: {d.id}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          Nota: questa è una demo statica. Per prenotazioni reali e stato in tempo reale, collega Supabase e (opzionale) WebSocket.
        </p>
      </div>
    </Layout>
  );
};

export default Bookings;
