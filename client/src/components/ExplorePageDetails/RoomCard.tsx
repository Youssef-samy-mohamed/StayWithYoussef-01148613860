import React, { useState , useMemo , useCallback} from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";
import { HotelDetails, Room, Booking } from "../../types";
import LottieHandler from "../feedback/LottieHander/LottieHandler";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  room: Room;
  hotel: HotelDetails;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  numberOfGuests: number;
  isRoomBooked: (
    room: Room,
    checkIn: Date | null,
    checkOut: Date | null
  ) => boolean;
  onBook: (
    bookingData: Omit<Booking, "id" | "createdAt" | "status">
  ) => Promise<Booking>;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hotel,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  isRoomBooked,
  onBook,
}) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const [isBookedLocally, setIsBookedLocally] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();



  // Memoizing the calculation of nights, price per night, and total price
  const nights = useMemo(() => {
    if (checkInDate && checkOutDate) {
      return Math.max(
        1,
        Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
        )
      );
    }
    return 1;
  }, [checkInDate, checkOutDate]);

  const pricePerNight = Number(room.price_per_night) || 0;
  const totalPrice = useMemo(
    () => Math.round(pricePerNight * nights * 100) / 100,
    [pricePerNight, nights]
  );

  const isBooked =
    isRoomBooked(room, checkInDate, checkOutDate) || isBookedLocally;


  const handleBook = useCallback(async () => {
    if (!user?.id) {
      toast.error("Please log in to book a room.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (checkInDate >= checkOutDate) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    if (!hotel.id || !hotel.name || !room.type) {
      toast.error("Invalid hotel or room data. Please try again.");
      return;
    }

    try {
      const bookingData: Omit<Booking, "id" | "createdAt" | "status"> = {
        userId: Number(user.id), // Send as number for users.id
        hotelId: hotel.id, // String for hotels.id
        hotelName: hotel.name, // Add hotelName
        hotelname: hotel.name, // Add hotelname (if it's required by the database)
        hotel: hotel, // Add hotel object
        room: room, // Add room object
        roomType: room.type, // Add roomType
        bedType: room.bed_type, // Add bedType
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        pricePerNight: pricePerNight,
        totalPrice: totalPrice,
      };

      // console.log("Sending booking data from RoomCard:", bookingData);
      await onBook(bookingData);
      setIsBookedLocally(true); // Mark as booked locally
      setShowCongrats(true);
      setTimeout(() => {
        setShowCongrats(false);
        navigate("/my-booking"); // Timeout of 3 seconds
      }, 3000); // Timeout of 3 seconds
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Booking error in RoomCard:", errorMessage);
    }
  }, [
    checkInDate,
    checkOutDate,
    hotel,
    navigate,
    onBook,
    pricePerNight,
    room,
    totalPrice,
    user,
  ]);

  if (showCongrats) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <LottieHandler
          type="congrates"
          message="🎉 Congrats! You have successfully booked a room."
          className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-4 text-gray-800 h-1/2"
        />
      </div>
    );
  }

  const isDisabled =
    isBooked ||
    !checkInDate ||
    !checkOutDate ||
    numberOfGuests > room.max_guests ||
    !user?.id;

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-6 border border-[#eee] hover:shadow-2xl transition-shadow">
      <h3 className="text-xl font-semibold text-[#B89D63] mb-2">{room.type}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Bed Type:</strong> {room.bed_type}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Max Guests:</strong> {room.max_guests}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Price per Night:</strong> {room.currency || "$"}{" "}
        {pricePerNight.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Status:</strong> {isBooked ? "Booked" : "Available"}
      </p>
      <button
        onClick={handleBook}
        disabled={isDisabled}
        className={`px-5 py-2 font-semibold rounded-xl shadow transition ${
          isDisabled
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-[#B89D63] text-white hover:bg-[#a58950]"
        }`}
      >
        {isBooked ? "Booked" : "Book Now"}
      </button>
    </div>
  );
};

export default React.memo(RoomCard);
