import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { HotelDetails } from "../../../types";



export const actGetHotelDetails = createAsyncThunk(
  "hotelDetails/fetchHotelDetails",
  async (hotelId: string , thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.get<HotelDetails>(`http://localhost:5000/hotelDetails/${hotelId}`)
        return response.data;
    } catch (error) {
           return rejectWithValue(axiosErrorHandler(error));
    }
}
    
    );
    
 