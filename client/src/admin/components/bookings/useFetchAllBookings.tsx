import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../../store/hooks";
import {Booking} from "../../../types/BookingDetails";


const useFetchAllBookings = () => {
  const token = useAppSelector((state) => state.auth.accessToken); // Get the access token
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>("http://localhost:5000/booking/", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the admin token for authorization
          },
        });
        setBookings(response.data); // Set the bookings data in state
      } catch (err) {
        console.error("Fetch bookings failed:", err);
        // setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false); // Stop the loading spinner once data is fetched
      }
    };

    if (token) {
      fetchBookings(); // Call fetchBookings when the token is available
    }
  }, [token]);

  return { bookings, loading, error }; // Return bookings data, loading state, and error
};

export default useFetchAllBookings;
