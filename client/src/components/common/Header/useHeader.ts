import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/auth/authSlice";

const useHeader = () => {
  const navigate = useNavigate();
  const [animateBookings, setAnimateBookings] = useState(false);
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  
  useEffect(() => {
    if (sessionStorage.getItem("animateBookings") === "true") {
      setAnimateBookings(true);
      setTimeout(() => {
        setAnimateBookings(false);
        sessionStorage.removeItem("animateBookings");
      }, 1000);
    }
  }, []);

  const handleExploreClick = () => {
    const hotelId = localStorage.getItem("selectedHotelId");
    if (hotelId) {
      navigate(`/explore/${hotelId}`);
    } else {
      toast.warn("Please select a hotel first to explore!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return { accessToken, animateBookings, handleExploreClick, handleLogout };
};

export default useHeader;
