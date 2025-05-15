// types.ts
import { HotelDetails, Room } from "./hotelDetails";

export type Booking = {
  id?: number;
  userId?: string | number;
  hotelId: string | number; // This might be the issue  hotelName: string;
  hotelname: string;
  hotelName: string;

  hotel: HotelDetails;
  room: Room;
  roomType?: string;
  bedType: string;
  pricePerNight?: number;
  currency?: string;
  numberOfGuests?: number;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  numberOfNights?: number;
  totalPrice?: number;
  checkIn?: string;
  checkOut?: string;
  createdAt?: string;
  status?: string;
  booked_id?: number | null;
};