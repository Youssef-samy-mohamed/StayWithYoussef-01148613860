// just getting hotels 
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetHotels = createAsyncThunk(
  "hotels/getHotels",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axiosInstance.get("/hotels/");
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetHotels;
