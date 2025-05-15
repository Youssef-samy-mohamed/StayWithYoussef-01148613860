import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Booking, HotelDetails } from "../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../../store";

interface AdminState {
  bookings: Booking[];
  hotels: HotelDetails[];
  users: { id: number; email: string; role: string }[];
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

const initialState: AdminState = {
  bookings: [],
  hotels: [],
  users: [],
  loading: "idle",
  error: null,
};

export const fetchAdminData = createAsyncThunk(
  "admin/fetchAdminData",
  async (_, { getState, rejectWithValue }) => {
    const userId = (getState() as RootState).auth.user?.id;
    try {
      const [bookings, hotels, users] = await Promise.all([
        axios.get("http://localhost:5000/booking/all", {
          headers: { "user-id": userId },
        }),
        axios.get("http://localhost:5000/hotels", {
          headers: { "user-id": userId },
        }),
        axios.get("http://localhost:5000/users", {
          headers: { "user-id": userId },
        }),
      ]);
      return {
        bookings: bookings.data,
        hotels: hotels.data,
        users: users.data,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch admin data");
      console.error(error);     
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<"idle" | "pending" | "fulfilled" | "rejected">
    ) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.bookings = action.payload.bookings;
        state.hotels = action.payload.hotels;
        state.users = action.payload.users;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
