// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// Import your reducers
import hotelsReducer from "../store/hotels/hotelsSlice";
import hotelDetailsReducer from "../store/hotelDetails/hotelDetailsSlice";
import bookingReducer from "../store/booking/bookingSlice"; // ✅ New
import auth from "../store/auth/authSlice";

// Persist config for hotels only (excluding hotelDetails & booking)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["hotels" , "booking"],
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user"],
};



const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  hotels: hotelsReducer,
  hotelDetails: hotelDetailsReducer,
  booking: bookingReducer, // ✅ Added here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

export { store, persistor };


// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Booking } from "../../../types";
// import { RootState } from "../../../store";

// export const fetchBookings = createAsyncThunk(
//   "booking/fetchBookings",
//   async (_, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState() as RootState;
//       const userId = state.auth.user?.id;
//       const accessToken = state.auth.accessToken;

//       console.log("fetchBookings: Starting", {
//         userId,
//         hasToken: !!accessToken,
//       });

//       if (!accessToken || !userId) {
//         throw new Error("User not authenticated");
//       }

//       const response = await axios.get("http://localhost:5000/booking", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const bookings: Booking[] = response.data;

//       // ✅ Filter bookings by logged-in user's ID
//       const filteredBookings = bookings.filter((b) => b.userId === userId);

//       return filteredBookings;
//     } catch (error) {
//       return thunkAPI.rejectWithValue("Failed to fetch bookings");
//       console.error("fetchBookings: Error", error);
//     }
//   }
// );

// export const addBooking = createAsyncThunk(
//   "booking/addBooking",
//   async (booking: Booking, { rejectWithValue }) => {
//     try {
//       console.log("addBooking: Adding booking", booking);
//       return booking;
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to add booking";
//       console.error("addBooking: Error", errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const deleteBooking = createAsyncThunk(
//   "booking/deleteBooking",
//   async (bookingId: number, { getState, rejectWithValue }) => {
//     const state = getState() as RootState;
//     const userId = state.auth.user?.id;
//     const accessToken = state.auth.accessToken;

//     console.log("deleteBooking: Starting", {
//       bookingId,
//       userId,
//       hasToken: !!accessToken,
//     });

//     if (!userId || !accessToken) {
//       const errorMessage = "User must be logged in to delete bookings";
//       console.error("deleteBooking: Error", errorMessage);
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }

//     if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
//       const errorMessage = `Invalid booking ID: ${bookingId}`;
//       console.error("deleteBooking: Error", errorMessage);
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }

//     try {
//       const url = `http://localhost:5000/booking/${bookingId}`;
//       const response = await axios.delete(url, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       console.log("deleteBooking: Response", response.data);
//       if (response.status === 404) {
//         toast.warn(`Booking ID ${bookingId} not found, removing locally.`);
//         return bookingId;
//       }

//       toast.success(`Booking ID ${bookingId} canceled successfully!`);
//       return bookingId;
//     } catch (error) {
//       const errorMessage =
//         axios.isAxiosError(error) && error.response
//           ? error.response.data?.error ||
//             `Failed to delete booking (status: ${error.response.status})`
//           : `Failed to delete booking (error: ${error})`;
//       console.error("deleteBooking: Error", errorMessage);
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );














// import { useCallback, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { HotelDetails, Room, Booking } from "../types";
// import { RootState } from "../store";
// import { fetchBookings, addBooking } from "../store/booking/act/bookingThunks";
// import { useAppDispatch, useAppSelector } from "../store/hooks";

// export const useBooking = (hotel: HotelDetails) => {
//   const dispatch = useAppDispatch();
//   const bookings = useAppSelector((state: RootState) => state.booking.bookings);
//   const { user, accessToken } = useAppSelector(
//     (state: RootState) => state.auth
//   );

//   useEffect(() => {
//     if (user?.id && accessToken) {
//       axios
//         .get(`http://localhost:5000/booking?userId=${user.id}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//         .then((response) => {
//           dispatch(fetchBookings(response.data));
//         })
//         .catch((error) => {
//           const errorMessage =
//             axios.isAxiosError(error) && error.response
//               ? error.response.data?.error ||
//                 `Failed to fetch bookings (status: ${error.response.status})`
//               : "An unexpected error occurred";
//           toast.error(`Failed to fetch booking: ${errorMessage}`);
//         });
//     }
//   }, [user?.id, accessToken, dispatch]);

//   const isRoomBooked = useCallback(
//     (room: Room, checkIn: Date | null, checkOut: Date | null) => {
//       if (!checkIn || !checkOut) return false;
//       return bookings.some((booking) => {
//         if (booking.hotelId !== hotel.id || booking.room.type !== room.type)
//           return false;
//         const bookedCheckIn = booking.checkInDate
//           ? new Date(booking.checkInDate)
//           : null;
//         const bookedCheckOut = booking.checkOutDate
//           ? new Date(booking.checkOutDate)
//           : null;
//         if (!bookedCheckIn || !bookedCheckOut) return false;
//         return checkIn < bookedCheckOut && checkOut > bookedCheckIn;
//       });
//     },
//     [hotel.id, bookings]
//   );

//   const bookRoom = useCallback(
//     async (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
//       if (!user?.id || !accessToken) {
//         const errorMessage = "Please log in to book a room.";
//         toast.error(errorMessage);
//         throw new Error(errorMessage);
//       }

//       try {
//         const response = await axios.post(
//           "http://localhost:5000/booking",
//           {
//             ...bookingData,
//             userId: Number(user.id),
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         toast.success("Room booked successfully!");
//         dispatch(addBooking(response.data));
//         return response.data;
//       } catch (error) {
//         const errorMessage =
//           axios.isAxiosError(error) && error.response
//             ? error.response.data?.error ||
//               `Failed to create booking (status: ${error.response.status})`
//             : "An unexpected error occurred";
//         toast.error(`Failed to book the room: ${errorMessage}`);
//         throw new Error(errorMessage);
//       }
//     },
//     [dispatch, user?.id, accessToken]
//   );

//   return { isRoomBooked, bookRoom };
// };
