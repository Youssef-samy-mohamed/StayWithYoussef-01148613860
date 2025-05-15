import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBookings, addBooking, deleteBooking } from "./act/bookingThunks";
import { Booking } from "../../types";
import { TLoading } from "../../types";

interface BookingState {
  bookings: Booking[];
  loading: TLoading;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: "idle",
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookings: (state) => {
      state.bookings = [];
      state.loading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = "fulfilled";
          state.bookings = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addBooking.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        addBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = "fulfilled";
          state.bookings.push(action.payload);
          state.error = null;
        }
      )
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = "fulfilled";
          state.bookings = state.bookings.filter(
            (booking) => booking.id !== action.payload
          );
          state.error = null;
        }
      )
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const { resetBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
