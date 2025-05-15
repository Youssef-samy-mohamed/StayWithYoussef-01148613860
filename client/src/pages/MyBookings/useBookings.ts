import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBookings } from "../../store/booking/act/bookingThunks";

const useBookings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state) => state.booking.bookings);
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (userId != null && typeof userId === "number") {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          await dispatch(fetchBookings(userId));
        } catch (err) {
          setError("Failed to load bookings.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (userId !== undefined) {
      setError("Invalid user ID.");
    }
  }, [dispatch, userId]);

  const memoizedBookings = useMemo(() => bookings, [bookings]);

  return { bookings: memoizedBookings, loading, error };
};

export default useBookings;
