import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store";

interface HotelInput {
  name: string;
  location: string;
  address: string;
  description: string;
  images: string; // comma-separated or make this string[]
}

export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (hotelData: HotelInput, { getState, rejectWithValue }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    try {
      const response = await axios.post(
        "http://localhost:5000/hotels",
        hotelData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add hotel");
      console.log(error);
    }
  }
);
