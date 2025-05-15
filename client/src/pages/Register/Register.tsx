import Input from "../../components/forms/Input/Input";
import useRegister from "./useRegister";

const Register = () => {
  const {
    register,
    handleSubmit,
    formErrors,
    error,
    loading,
    submitForm,
    emailAvailabilityStatus,
    emailOnBlurHandler,
  } = useRegister();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your StayWithYoussef Account
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <div className="space-y-5">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            register={register}
            error={formErrors.firstName?.message}
          />
          <Input
            label="Last Name"
            name="lastName"
            type="text"
            register={register}
            error={formErrors.lastName?.message}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            onBlur={emailOnBlurHandler}
            error={
              formErrors.email?.message
                ? formErrors.email?.message
                : emailAvailabilityStatus === "notAvailable"
                ? "This email is already in use."
                : emailAvailabilityStatus === "failed"
                ? "Error checking email availability."
                : ""
            }
            formText={
              emailAvailabilityStatus === "checking"
                ? "Checking email availability. Please wait..."
                : ""
            }
            success={
              emailAvailabilityStatus === "available"
                ? "This email is available for use."
                : ""
            }
            disabled={emailAvailabilityStatus === "checking"}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            error={formErrors.password?.message}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            error={formErrors.confirmPassword?.message}
          />
          <button
            type="submit"
            onClick={handleSubmit(submitForm)}
            disabled={
              loading === "pending" ||
              emailAvailabilityStatus === "notAvailable"
            }
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              loading === "pending" ||
              emailAvailabilityStatus === "notAvailable"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading === "pending" ? "Creating Account..." : "Register"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;