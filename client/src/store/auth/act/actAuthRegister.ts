import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RegisterFormData, AuthResponse } from "../../../types/users";

const actAuthRegister = createAsyncThunk(
  "auth/actAuthRegister",
  async (formData: RegisterFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const API_BASE_URL = "http://localhost:5000";

    try {
      console.log("Sending registration request:", formData);
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/users/register`, // Fixed to match /users prefix
        formData
      );
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : axiosErrorHandler(error)
      );
    }
  }
);

export default actAuthRegister;
