import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";
import LottieHandler from "../components/feedback/LottieHander/LottieHandler";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home/Home"));
const Explore = lazy(() => import("../pages/Explore/Explore"));
const MyBookings = lazy(() => import("../pages/MyBookings/MyBookings"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const AdminDashboard = lazy(() => import("../admin/page/AdminDashboard"));

const BasicLoading = () => <div>Loading...</div>;

const ErrorFallback = () => (
  <LottieHandler
    type="error"
    message="Oops! Something went wrong."
    className="w-full h-full flex justify-center items-center"
  />
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <LottieHandler type="loading" message="Loading Home Page..." />
            }
          >
            <Home />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<BasicLoading />}>
            <Login />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<BasicLoading />}>
            <Register />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      // Regular user routes
      {
        element: <ProtectedRoute />, // Protect regular user routes
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "/explore/:hotelId",
            element: (
              <Suspense fallback={<BasicLoading />}>
                <Explore />
              </Suspense>
            ),
            errorElement: <ErrorFallback />,
          },
          {
            path: "/my-booking",
            element: (
              <Suspense fallback={<BasicLoading />}>
                <MyBookings />
              </Suspense>
            ),
            errorElement: <ErrorFallback />,
          },
        ],
      },
      // Admin routes
      {
        element: <ProtectedRoute adminRequired={true} />, // Protect admin route
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "/admin/*", // Admin specific routes
            element: (
              <Suspense fallback={<BasicLoading />}>
                <AdminDashboard />
              </Suspense>
            ),
            errorElement: <ErrorFallback />,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
