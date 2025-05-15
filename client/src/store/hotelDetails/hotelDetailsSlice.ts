// src/slices/hotelDetailsSlice.ts

import { createSlice } from "@reduxjs/toolkit";

import { HotelDetails , TLoading } from "../../types";
import { actGetHotelDetails } from "./act/actPostHotelDetails";

// Define initial state
interface HotelState {
  hotel: HotelDetails | null;
  loading: TLoading;
  error: string | null;
}

const initialState: HotelState = {
  hotel: null,
  loading: "idle",
  error: null,
};


// Create slice
const hotelDetailsSlice = createSlice({
  name: "hotelDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetHotelDetails.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(actGetHotelDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.hotel = action.payload;
      })
      .addCase(actGetHotelDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message || "Failed to fetch hotel details";
      });
  },
});


export { actGetHotelDetails };
// Export actions (no custom actions in this slice)
export default hotelDetailsSlice.reducer;
