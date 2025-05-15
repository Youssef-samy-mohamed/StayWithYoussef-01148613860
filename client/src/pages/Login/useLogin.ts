import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";
import { actAuthLogin, resetUI } from "../../store/auth/authSlice";
import { LoginFormData } from "../../types/users";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset, // Added reset
    formState: { errors: formErrors },
  } = useForm<LoginFormData>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const submitForm: SubmitHandler<LoginFormData> = async (data) => {
    const { email, password } = data;
    const normalizedEmail = email.toLowerCase(); // Normalize email
    try {
      await dispatch(
        actAuthLogin({ email: normalizedEmail, password })
      ).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    reset(); // Reset form on mount
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch, reset]);

  return {
    loading,
    error,
    formErrors,
    submitForm,
    register,
    handleSubmit,
  };
};

export default useLogin;