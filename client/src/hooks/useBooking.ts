

import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HotelDetails, Room, Booking } from "../types";
import { addBooking } from "../store/booking/act/bookingThunks"; // update the path if needed
import { useAppDispatch , useAppSelector } from "../store/hooks";

export const useBooking = (hotel: HotelDetails, bookings: Booking[]) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);


  const isRoomBooked = useCallback(
    (room: Room, checkIn: Date | null, checkOut: Date | null) => {
      if (!checkIn || !checkOut) return false;
      return bookings.some((booking) => {
        if (booking.hotelId !== hotel.id || booking.room.type !== room.type)
          return false;

        const bookedCheckIn = booking.checkInDate
          ? new Date(booking.checkInDate)
          : null;
        const bookedCheckOut = booking.checkOutDate
          ? new Date(booking.checkOutDate)
          : null;

        if (!bookedCheckIn || !bookedCheckOut) return false;

        return checkIn < bookedCheckOut && checkOut > bookedCheckIn;
      });
    },
    [hotel.id, bookings]
  );

  const bookRoom = useCallback(
    async (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
      try {
        // console.log("Sending booking data from useBooking:", bookingData);
        const response = await axios.post<Booking>(
          "http://localhost:5000/booking",
          bookingData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const createdBooking = response.data;
        // console.log("Booking response:", createdBooking);

        // Dispatch the booking to Redux
        dispatch(addBooking(createdBooking));

        toast.success("Room booked successfully!");
        return createdBooking;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : axios.isAxiosError(error) && error.response
            ? error.response.data?.error ||
              `Failed to create booking (status: ${error.response.status})`
            : "An unexpected error occurred";

        console.error("Booking error in useBooking:", errorMessage);
        toast.error(`This room is already booked by anoterh guest we're waiting util they cancel it!`);
        throw new Error(errorMessage);
      }
    },
    [dispatch , accessToken]
  );

  return { isRoomBooked, bookRoom };
};
