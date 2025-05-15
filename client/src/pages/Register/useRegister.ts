import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpType } from "../../validations/registerSchema";
import useCheckEmailAvailability from "../../hooks/useCheckEmailAvailability";
import { actAuthRegister, resetUI } from "../../store/auth/authSlice";

const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    getFieldState,
    trigger,
    formState: { errors: formErrors },
  } = useForm<signUpType>({
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });

  const {
    emailAvailabilityStatus,
    enteredEmail,
    checkEmailAvailability,
    resetCheckEmailAvailability,
  } = useCheckEmailAvailability();

  const submitForm: SubmitHandler<signUpType> = async (data) => {
    const { firstName, lastName, email, password } = data;
    try {
      await dispatch(
        actAuthRegister({ firstName, lastName, email, password })
      ).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const emailOnBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
    await trigger("email");
    const value = e.target.value;
    const { isDirty, invalid } = getFieldState("email");

    if (isDirty && !invalid && enteredEmail !== value) {
      checkEmailAvailability(value);
    }

    if (isDirty && invalid && enteredEmail) {
      resetCheckEmailAvailability();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  return {
    loading,
    error,
    formErrors,
    emailAvailabilityStatus,
    submitForm,
    register,
    handleSubmit,
    emailOnBlurHandler,
  };
};

export default useRegister;