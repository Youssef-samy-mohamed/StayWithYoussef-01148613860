import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Booking } from "../../../types";
import { RootState } from "../../../store";

// Fetch  bookings
export const fetchBookings = createAsyncThunk<Booking[], number , { state : RootState}>(  "booking/fetchBookings",
  async (userId: number, { rejectWithValue, getState }) => {
    const state = getState();
    const accessToken = state.auth.accessToken;

    if (!userId || typeof userId !== "number") {
      const errorMessage = "User ID is required to fetch bookings";
      console.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    if (!accessToken) {
      const errorMessage = "No access token available. Please log in.";
      console.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    try {
      const response = await axios.get("http://localhost:5000/booking", {
        params: { userId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const bookings: Booking[] = response.data;
      return bookings;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.error ||
            `Failed to fetch bookings (status: ${error.response.status})`
          : `Failed to fetch bookings (error: ${error})`;
      console.error("Fetch bookings error:", errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Add a booking
export const addBooking = createAsyncThunk(
  "booking/addBooking",
  async (booking: Booking, { rejectWithValue }) => {
    try {
      return booking;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add booking";
      // console.error("Add booking error:", errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a booking
export const deleteBooking = createAsyncThunk<number , number , { state : RootState}>(
  "booking/deleteBooking",
  async (bookingId: number, { rejectWithValue, getState }) => {
    const state = getState();
    const accessToken = state.auth.accessToken;

    if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
      const errorMessage = `Invalid booking ID: ${bookingId}`;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    if (!accessToken) {
      const errorMessage = "No access token available. Please log in.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    try {
      const url = `http://localhost:5000/booking/${bookingId}`;
      if (
        url.endsWith("/booking/") ||
        url === "http://localhost:5000/booking"
      ) {
        const errorMessage = `Invalid DELETE URL: ${url}`;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      // console.log(`Deleting booking ID: ${bookingId}`);
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 404) {
        toast.warn(`Booking ID ${bookingId} not found, removing locally.`);
        return bookingId;
      } else if (!response.status.toString().startsWith("2")) {
        return rejectWithValue(
          `Failed to delete booking (status: ${response.status})`
        );
      }

      toast.success(`Booking ID ${bookingId} canceled successfully!`);
      return bookingId;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.error ||
            `Failed to delete booking (status: ${error.response.status})`
          : `Failed to delete booking (error: ${error})`;
      console.error("Delete booking error:", errorMessage, error);
      toast.error(`Failed to cancel booking: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

