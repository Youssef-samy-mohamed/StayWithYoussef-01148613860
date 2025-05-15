import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthResponse } from "../../../types/users";
import {RootState} from "../../../store";

export const actAuthCheck = createAsyncThunk(
  "auth/check",
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = (getState() as RootState).auth;
    if (!accessToken) {
      return rejectWithValue("No access token found");
    }

    try {
      const response = await axios.get("http://localhost:5000/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data as AuthResponse;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.error || "Failed to verify token"
          : "An unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export default actAuthCheck;
