export type Hotel = {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating?: number; // Optional, since not provided by backend
  location: string;
  amenities: string[];
  check_in: string;
  check_out: string;
  cancellation_policy: string;
  rooms: Room[];
  tags: { id: number; name: string }[];
  address: string;
};

export type Room = {
  type: string;
  bed_type: string;
  max_guests: number;
  price_per_night: number;
  currency: string;
  amenities: string[];
  available: boolean;
  id: number;
  hotelId: string;
};
