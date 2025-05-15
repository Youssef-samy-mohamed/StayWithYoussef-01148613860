type Room = {
  hotelId: string;
  type: string;
  bed_type: string;
  max_guests: number;
  price_per_night: number;
  currency: string;
  amenities: string[];
  available: boolean;
};

type HotelDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  images: string[];
  check_in: string;
  check_out: string;
  cancellation_policy: string;
  amenities: string[];
  createdat: string;
  rooms: Room[];
};

export { type Room, type HotelDetails };
