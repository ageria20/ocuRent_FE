import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import video1Prova from "@/assets/video1Prova.mp4";
import video2Prova from "@/assets/video2Prova.mp4";

const Demo = () => {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videos = [
    { id: 1, src: video1Prova, title: "Demo VR 1" },
    { id: 2, src: video2Prova, title: "Demo VR 2" }
  ];

  useEffect(() => {
    document.title = "Demo VR 360 | VR Tours";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Guarda una demo VR 360 e scopri l'esperienza immersiva di VR Tours.";
    if (desc) desc.setAttribute("content", content);
  }, []);

  const handleVideoChange = (videoId: number) => {
    setCurrentVideo(videoId);
    setIsPlaying(false);
  };

  return (
    <Layout>
      <header className="sr-only">
        <h1>Demo VR 360</h1>
        <link rel="canonical" href={window.location.href} />
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Guarda le Demo VR</h2>
          <p className="text-muted-foreground text-lg">
            Un assaggio delle nostre esperienze immersive in realtà virtuale
          </p>
        </div>

        {/* Video Selector */}
    

        <Card className="vr-glass border-white/10 max-w-4xl mx-auto">
          <CardContent className="p-0">
            <div className="aspect-video w-full relative group">
            <video
  playsInline
  autoPlay
  loop
  className="w-full rounded-lg"
  controls
  preload="metadata"
>
  <source src="/src/assets/video2Prova.mp4" type="video/mp4" />
</video>
              
              {/* Overlay con controlli personalizzati */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info aggiuntive */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Esperienza Immersiva</h3>
              <p className="text-gray-300">
                Vivi un'esperienza completamente immersiva con la nostra tecnologia VR all'avanguardia
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Qualità HD</h3>
              <p className="text-gray-300">
                Goditi video in alta definizione per un'esperienza visiva di altissima qualità
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Controlli Intuitivi</h3>
              <p className="text-gray-300">
                Interfaccia semplice e intuitiva per una navigazione fluida tra i contenuti
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Demo;
