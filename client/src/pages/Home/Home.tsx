import useHome from "./useHome";
import FindMoreDetails from "./FindMoreDetails";
import { ResuableHeader } from "../../components/common";
import LottieHandler from "../../components/feedback/LottieHander/LottieHandler";

const Home = () => {
  const { hotels, loading, error } = useHome();

  if (loading === "pending") {
    return <div className="text-center text-xl">Loading hotels...</div>;
  }

  if (error) {
    return <LottieHandler type="error" message={error} />;
  }

  if (!Array.isArray(hotels)) {
    return (
      <div className="text-red-500 text-center">
        Invalid hotel data format received. Data: {JSON.stringify(hotels)}
      </div>
    );
  }

  if (hotels.length === 0) {
    return <LottieHandler type="noBookings" message="No hotels found" />;
  }

  const backendBaseUrl = "http://localhost:5000";

  return (
    <>
      <div className="text-center text-white bg-gradient-to-r from-[#B89D63] to-[#FFD700] shadow-lg py-12 rounded-md mb-8">
        <ResuableHeader title="Find Your Perfect Stay 👀" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 min-h-[200px]">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="relative rounded-2xl overflow-hidden bg-white transition-transform hover:scale-[1.02]"
            style={{
              boxShadow:
                "0px 10px 20px rgba(184, 157, 99, 0.3), 0px 4px 6px rgba(184, 157, 99, 0.2)",
            }}
          >
            <div className="relative w-full h-48">
              <img
                src={
                  hotel.images?.[0]
                    ? `${backendBaseUrl}${hotel.images[0]}`
                    : "image not found"
                }
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {hotel.name}
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Location:</span>{" "}
                {hotel.location}, {hotel.address}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Check-in:</span>{" "}
                {hotel.check_in || "N/A"} |{" "}
                <span className="font-semibold">Check-out:</span>{" "}
                {hotel.check_out || "N/A"}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Cancellation Policy:</span>{" "}
                {hotel.cancellation_policy}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Description:</span>{" "}
                {hotel.description}
              </p>
              <FindMoreDetails hotelId={hotel.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
