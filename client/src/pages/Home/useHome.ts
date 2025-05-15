import { useEffect } from "react";
import actGetHotels from "../../store/hotels/act/actGetHotelsById";
import { RootState } from "../../store"; // Adjust path to your store types
import { Hotel } from "../../types"; // Adjust path to your Hotel type
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface UseHomeReturn {
  hotels: Hotel[];
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

const useHome = (): UseHomeReturn => {
  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector(
    (state: RootState) => state.hotels
  );

  useEffect(() => {
      dispatch(actGetHotels());
  }, [dispatch ]);

  return {
    hotels: hotels.hotels || [], // Extract the hotels array
    loading,
    error,
  };
};

export default useHome;
