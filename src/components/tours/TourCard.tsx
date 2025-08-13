import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Users, Eye } from 'lucide-react';
import { Tour } from '@/store/slices/toursSlice';
import { Link } from 'react-router-dom';
import BookingDialog from '@/components/bookings/BookingDialog';

interface TourCardProps {
  tour: Tour;
  index: number;
}

const TourCard = ({ tour, index }: TourCardProps) => {
  const categoryColors = {
    historical: 'bg-amber-500/20 text-amber-200',
    nature: 'bg-green-500/20 text-green-200',
    space: 'bg-purple-500/20 text-purple-200',
    underwater: 'bg-blue-500/20 text-blue-200',
    adventure: 'bg-red-500/20 text-red-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="vr-glass border-white/10 overflow-hidden group hover:shadow-vr-glow transition-smooth">
        <CardHeader className="p-0">
          <div className="relative tour-360-container h-48">
            <img 
              src={tour.image} 
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            />
            <div className="absolute top-4 right-4">
              <Badge className={categoryColors[tour.category]}>
                {tour.category}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{tour.rating}</span>
                  <span className="text-xs opacity-70">({tour.totalReviews})</span>
                </span>
                <span className="text-lg font-bold">€{tour.price}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
            {tour.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {tour.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration} min</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Fino a 8 persone</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tour.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {tour.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tour.features.length - 2} altre
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/tours/${tour.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Anteprima
            </Link>
          </Button>
          <BookingDialog tour={tour} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TourCard;