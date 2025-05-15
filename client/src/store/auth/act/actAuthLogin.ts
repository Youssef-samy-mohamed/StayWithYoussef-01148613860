import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginFormData, AuthResponse } from "../../../types/users";

const actAuthLogin = createAsyncThunk(
  "auth/actAuthLogin",
  async (formData: LoginFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const API_BASE_URL = "http://localhost:5000";

    try {
      // console.log("Sending login request:", formData); // Updated to log full formData
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/users/login`,
        formData
      );
      // console.log("Login response:", response.data);
      return response.data;
    } catch (error: unknown) {
      // Improved error handling by checking for instance of Error
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data?.error as string) || // ✅ Expecting string error from API
          error.message ||
          "Login failed. Please try again.";
        return rejectWithValue(message); // ✅ Always a string
      } else if (error instanceof Error) {
        // Regular Error: Handle generic errors
        // console.error("Login error:", error.message);
        return rejectWithValue(error.message);
      }
      // Handle unexpected error type
      // console.error("Unexpected error:", error);
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export default actAuthLogin;
