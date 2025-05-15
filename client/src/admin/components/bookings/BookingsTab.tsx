import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import useFetchAllBookings from "../../components/bookings/useFetchAllBookings";
import { deleteBooking } from "../../../store/booking/act/bookingThunks";
import LottieHandler from "../../../components/feedback/LottieHander/LottieHandler";

const BookingsTab = () => {
  const dispatch = useAppDispatch();
  const { bookings } = useFetchAllBookings();
  const [localBookings, setLocalBookings] = useState(bookings);

  useEffect(() => {
    setLocalBookings(bookings); // Sync when initial bookings are fetched
  }, [bookings]);

  const handleDelete = async (bookingId: number) => {
    const result = await dispatch(deleteBooking(bookingId));

    // If successful, update local state
    if (deleteBooking.fulfilled.match(result)) {
      setLocalBookings((prev) => prev.filter((b) => b.id !== bookingId));
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#eee]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#B89D63]">Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600 text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Hotel</th>
                <th className="p-3">Room Type</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localBookings.length > 0 ? (
                localBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.id}</td>
                    <td className="p-3">{booking.userId}</td>
                    <td className="p-3">{booking.hotelName}</td>
                    <td className="p-3">{booking.roomType}</td>
                    <td className="p-3">{booking.checkInDate}</td>
                    <td className="p-3">{booking.checkOutDate}</td>
                    <td className="p-3">${booking.totalPrice}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          booking.id !== undefined && handleDelete(booking.id)
                        }
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3" colSpan={8}>
                    <LottieHandler
                      type="noBookings"
                      message={"No Bookings Found for any user"}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;
