
export enum CourtType {
  INDOOR = 'Indoor',
  OUTDOOR = 'Outdoor',
  PANORAMIC = 'Panoramique'
}

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  pricePerHour: number;
  image: string;
  rating: number;
  features: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  userName: string;
  userPhone: string;
  /**
   * Supabase snake_case fields (added to resolve property access errors in App.tsx)
   */
  user_name?: string;
  user_phone?: string;
  total_price?: number;
  date: string;
  time: string;
  totalPrice: number;
  status: 'confirmed' | 'pending';
  createdAt: string;
}
