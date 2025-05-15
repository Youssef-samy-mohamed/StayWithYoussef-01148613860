// src/redux/slices/hotelSlice.js
import { createSlice } from "@reduxjs/toolkit";
import actGetHotels from "./act/actGetHotelsById";
import { TLoading, Hotel } from "../../types/index";

// Define the shape of the backend response
interface HotelsResponse {
  total: number;
  hotels: Hotel[];
}

interface HotelsState {
  hotels: HotelsResponse; // Store the full response
  loading: TLoading;
  error: string | null;
}

const initialState: HotelsState = {
  hotels: { hotels: [], total: 0 },
  loading: "idle",
  error: null,
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetHotels.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(actGetHotels.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.hotels = action.payload; // { total, hotels }
      })
      .addCase(actGetHotels.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default hotelsSlice.reducer;
