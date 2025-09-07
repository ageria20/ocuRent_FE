import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Eye,
  Calendar,
  Headphones,
  Globe,
  Volume2,
  Video,
  Image as ImageIcon,
  X
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { RootState } from '@/store/store';

const TourDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  
  const tour = useSelector((state: RootState) => 
    state.tours.tours.find(t => t.id === id)
  );

  if (!tour) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Tour non trovato</h1>
          <Button asChild>
            <Link to="/tours">Torna ai Tour</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryColors = {
    historical: 'bg-amber-500/20 text-amber-200',
    nature: 'bg-green-500/20 text-green-200',
    space: 'bg-purple-500/20 text-purple-200',
    underwater: 'bg-blue-500/20 text-blue-200',
    adventure: 'bg-red-500/20 text-red-200',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/tours">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Tour
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Tour Image and Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative tour-360-container rounded-3xl overflow-hidden h-96 mb-6">
              <img 
                src={tour.image} 
                alt={tour.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(tour.image)}
              />
              <div className="absolute inset-0 vr-gradient opacity-20" />
              <div className="absolute top-6 left-6">
                <Badge className={categoryColors[tour.category]}>
                  {tour.category}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  variant="glass" 
                  className="p-6 rounded-full"
                  onClick={() => setShowVideo(true)}                  
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {tour.gallery.map((image, index) => (
                <div 
                  key={index}
                  className="tour-360-container rounded-xl h-24 bg-muted overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${tour.title} - Immagine ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Video Demo Button */}
            {tour.demoVideo && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowVideo(true)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Guarda Video Demo
                </Button>
              </div>
            )}
          </motion.div>

          {/* Tour Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {tour.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {tour.description}
                </p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-muted-foreground">
                    ({tour.totalReviews} recensioni)
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="vr-glass border-white/10">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Durata</p>
                      <p className="font-semibold">{tour.duration} minuti</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="vr-glass border-white/10">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Partecipanti</p>
                      <p className="font-semibold">Fino a 8</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
                <div className="grid grid-cols-1 gap-3">
                  {tour.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {feature.includes('360') && <Eye className="w-5 h-5 text-primary" />}
                      {feature.includes('Audio') && <Headphones className="w-5 h-5 text-primary" />}
                      {feature.includes('Interactive') && <Globe className="w-5 h-5 text-primary" />}
                      {!feature.includes('360') && !feature.includes('Audio') && !feature.includes('Interactive') && 
                        <Volume2 className="w-5 h-5 text-primary" />}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Booking */}
              <div className="vr-glass p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold">€{tour.price}</p>
                    <p className="text-sm text-muted-foreground">per persona</p>
                  </div>
                  <Badge variant="secondary">
                    Disponibile
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Button size="lg" variant="hero" className="w-full" asChild>
                    <Link to={`/book/${tour.id}`}>
                      <Calendar className="w-5 h-5 mr-2" />
                      Prenota Ora
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowVideo(true)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Prova Demo Gratuita
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="vr-glass border-white/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Cosa Aspettarsi</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Questa esperienza VR ti trasporterà direttamente nella {tour.category === 'historical' ? 'storia antica' : 
                  tour.category === 'space' ? 'vastità dello spazio' : 
                  tour.category === 'underwater' ? 'profondità oceaniche' : 'natura selvaggia'}. 
                  Utilizzando la tecnologia VR più avanzata, potrai esplorare ambienti realistici a 360 gradi, 
                  interagire con elementi del mondo virtuale e vivere un'avventura che ricorderai per sempre.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Il tour include audio spazializzato, hotspot interattivi e contenuti educativi che 
                  arricchiranno la tua esperienza con informazioni dettagliate e curiosità affascinanti.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
              <img
                src={selectedImage}
                alt={tour.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideo && tour.demoVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setShowVideo(false)}
              >
                <X className="w-6 h-6" />
              </Button>
              <div className="aspect-video w-full">
                <video
                  className="w-full h-full rounded-lg"
                  controls
                  autoPlay
                  preload="metadata"
                >
                  <source src={tour.demoVideo} type="video/mp4" />
                  Il tuo browser non supporta il tag video.
                </video>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TourDetail;