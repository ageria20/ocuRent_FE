import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tour {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'historical' | 'nature' | 'space' | 'underwater' | 'adventure';
  image: string;
  video360?: string;
  isActive: boolean;
  features: string[];
  rating: number;
  totalReviews: number;
}

interface ToursState {
  tours: Tour[];
  selectedTour: Tour | null;
  loading: boolean;
  error: string | null;
}

const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Ancient Rome Experience',
    description: 'Explore the mighty Colosseum and walk through the streets of ancient Rome as they were 2000 years ago.',
    duration: 45,
    price: 29.99,
    category: 'historical',
    image: '/src/assets/tour-rome.jpg',
    isActive: true,
    features: ['360° Video', 'Interactive Hotspots', 'Audio Guide', 'Historical Facts'],
    rating: 4.8,
    totalReviews: 324,
  },
  {
    id: '2',
    title: 'Deep Ocean Adventure',
    description: 'Dive into the depths of the Pacific Ocean and explore vibrant coral reefs teeming with marine life.',
    duration: 35,
    price: 24.99,
    category: 'underwater',
    image: '/src/assets/tour-ocean.jpg',
    isActive: true,
    features: ['Underwater 360°', 'Marine Life Database', 'Ocean Sounds', 'Educational Content'],
    rating: 4.9,
    totalReviews: 156,
  },
  {
    id: '3',
    title: 'International Space Station',
    description: 'Experience life in zero gravity aboard the ISS and witness Earth from space like never before.',
    duration: 50,
    price: 39.99,
    category: 'space',
    image: '/src/assets/tour-space.jpg',
    isActive: true,
    features: ['Zero-G Simulation', 'Earth Views', 'Astronaut Commentary', 'Space Facts'],
    rating: 5.0,
    totalReviews: 89,
  },
];

const initialState: ToursState = {
  tours: mockTours,
  selectedTour: null,
  loading: false,
  error: null,
};

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    setSelectedTour: (state, action: PayloadAction<Tour>) => {
      state.selectedTour = action.payload;
    },
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSelectedTour, clearSelectedTour, setLoading, setError } = toursSlice.actions;
export default toursSlice.reducer;