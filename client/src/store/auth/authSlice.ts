import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import actAuthLogin from "./act/actAuthLogin";
import actAuthRegister from "./act/actAuthRegister";
import actAuthCheck from "./act/actAuthCheck";
import { AuthResponse, User } from "../../types/users";
import { resetBookings } from "../booking/bookingSlice"; // NEW: Import booking reset action
import { AppDispatch } from "..";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: null,
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUI: (state) => {
      state.loading = "idle";
      state.error = null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.loading = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      // NEW: Dispatch resetBookings via extraReducers
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAuthLogin.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        actAuthLogin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = "fulfilled";
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
          state.error = null;
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      )
      .addCase(actAuthLogin.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(actAuthRegister.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        actAuthRegister.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = "fulfilled";
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
          state.error = null;
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      )
      .addCase(actAuthRegister.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(actAuthCheck.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        actAuthCheck.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = "fulfilled";
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
          state.error = null;
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      )
      .addCase(actAuthCheck.rejected, (state, action) => {
        state.loading = "rejected";
        state.accessToken = null;
        state.user = null;
        state.error = action.payload as string;
        localStorage.removeItem("accessToken");
      });
  },
});

// NEW: Middleware to reset bookings on logout
export const logoutWithBookingsReset = () => (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logout());
  dispatch(resetBookings());
};

export const { resetUI , logout} = authSlice.actions;
export { actAuthLogin, actAuthRegister, actAuthCheck };
export default authSlice.reducer;
