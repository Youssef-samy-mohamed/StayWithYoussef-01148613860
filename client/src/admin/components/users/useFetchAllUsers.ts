import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useAppSelector } from "../../../store/hooks";
import { User } from "../../../types/users";
import { AxiosError } from "axios";

const useFetchAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state) => state.auth.accessToken);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userRole = decodedToken?.role;

      if (userRole !== "admin") {
        setError("You do not have permission to access this resource.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get<User[]>("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Fetch Users Error:", error);
      setError(
        error.response?.data?.error || // access nested error message if exists
          error.message ||
          "An error occurred while fetching users"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

export default useFetchAllUsers;
