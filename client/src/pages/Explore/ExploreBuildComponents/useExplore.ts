import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector , useAppDispatch } from "../../../store/hooks";
import { actGetHotelDetails } from "../../../store/hotelDetails/hotelDetailsSlice"; // adjust path as needed
import { RootState,  } from "../../../store"; // adjust path as needed

export const useExplore = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { hotel, loading, error } = useAppSelector(
    (state: RootState) => state.hotelDetails
  );

  useEffect(() => {
    if (hotelId) {
      dispatch(actGetHotelDetails(hotelId));
    } else {
      navigate("/", { replace: true });
    }
  }, [hotelId, dispatch, navigate]);

  return { hotel, loading, error, hotelId };
};
