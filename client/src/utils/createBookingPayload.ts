// import calculateBookingDetails from "./calculateBookingDetails";
// import { Booking, HotelDetails, Room } from "../types";
// const createBookingPayload = (
//   hotel: HotelDetails,
//   room: Room,
//   checkInDate: Date,
//   checkOutDate: Date,
//   userId: string, // Added parameter for userId
//   numberOfGuests: number = 1 // Default to 1 guest
// ): Booking => {
//   const { numberOfNights, totalPrice } = calculateBookingDetails(
//     checkInDate,
//     checkOutDate,
//     room.price_per_night
//   );

//   return {
//     userId, // Provided by caller (e.g., from auth context)
//     hotelId: hotel.id,
//     hotelName: hotel.name,
//     hotel,
//     room,
//     roomType: room.type,
//     bedType: room.bed_type,
//     pricePerNight: room.price_per_night,
//     currency: room.currency,
//     numberOfGuests, // Provided or default
//     checkInDate: checkInDate.toISOString().split("T")[0],
//     checkOutDate: checkOutDate.toISOString().split("T")[0],
//     numberOfNights,
//     totalPrice,
//     checkIn: hotel.check_in, // e.g., "14:00"
//     checkOut: hotel.check_out, // e.g., "12:00"
//     status: "confirmed", // Default status
//   };
// };

// export default createBookingPayload;