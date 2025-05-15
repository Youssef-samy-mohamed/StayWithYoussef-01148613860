import { format } from "date-fns";
import { useMemo, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteBooking } from "../../store/booking/act/bookingThunks";
import LottieHandler from "../../components/feedback/LottieHander/LottieHandler";
import useBookings from "./useBookings";
import { toast } from "react-toastify";
import Payment from "./Payment/Payment";

const MyBookings = () => {
  const { bookings, loading, error } = useBookings();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  const userBookings = useMemo(
    () => bookings.filter((booking) => booking.userId === userId),
    [bookings, userId]
  );

  const handleCancel = useCallback(
    (id: number | undefined) => {
      if (typeof id !== "number") {
        console.error("Invalid booking ID:", id);
        return;
      }

      if (typeof userId === "number") {
        const isOwner = bookings.some(
          (booking) => booking.id === id && booking.userId === userId
        );

        if (isOwner) {
          dispatch(deleteBooking(id));
        } else {
          toast.error("You can only cancel your own bookings.");
        }
      } else {
        toast.error("Invalid user ID. Please log in again.");
      }
    },
    [bookings, dispatch, userId]
  );

  const handlePaymentClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowPayment(true);
  };

  const handlePaymentSubmit = (details: string) => {
    console.log("Payment Details:", details);
    toast.success("Payment processed for booking #" + selectedBookingId);
    setShowPayment(false);
    setSelectedBookingId(null);
  };

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (userBookings.length === 0)
    return (
      <div className="">
        <LottieHandler
          type="noBookings"
          message="No bookings found"
          className="h-screen"
        />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#B89D63]">
        My Bookings
      </h1>

      <div className="space-y-6">
        {userBookings.map((booking) => {
          const { id, hotelName, room, checkInDate, checkOutDate } = booking;

          return (
            <div
              key={id}
              className="bg-white p-6 shadow-md rounded-xl border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-[#B89D63] mb-2">
                {hotelName}
              </h2>
              <p className="text-gray-700 text-sm">
                <strong>Room Type:</strong> {room?.type || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Check-in:</strong>{" "}
                {checkInDate ? format(new Date(checkInDate), "PPpp") : "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Check-out:</strong>{" "}
                {checkOutDate ? format(new Date(checkOutDate), "PPpp") : "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">Confirmed</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                <strong>Booking ID:</strong> #{id}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Price per Night:</strong>{" "}
                {room?.price_per_night || "N/A"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleCancel(id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() => handlePaymentClick(id!)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Make Payment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showPayment && (
        <Payment
          onClose={() => setShowPayment(false)}
          onSubmit={() => handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default MyBookings;
