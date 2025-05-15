import { useLocation } from "react-router-dom";
import Input from "../../components/forms/Input/Input";
import useLogin from "../Login/useLogin";

const Login = () => {
  const { register, handleSubmit, formErrors, error, loading, submitForm } =
    useLogin();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get("message");

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your StayWithYoussef Account
        </h2>
        {message === "account_created" && (
          <p className="text-green-500 text-sm text-center mb-4 animate-pulse">
            Account created successfully! Please log in.
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <div className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={formErrors.email?.message}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            error={formErrors.password?.message}
          />
          <button
            type="submit"
            onClick={handleSubmit(submitForm)}
            disabled={loading === "pending"}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              loading === "pending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading === "pending" ? "Logging In..." : "Login"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;