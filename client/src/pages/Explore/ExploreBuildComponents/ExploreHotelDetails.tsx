import React from "react";

interface ExploreHotelDetailsProps {
  hotel: {
    name: string;
    address: string;
    check_in: string;
    check_out: string;
    description: string;
    amenities: string[];
  };
}

const ExploreHotelDetails = React.memo(
  ({ hotel }: ExploreHotelDetailsProps) => {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-2 text-[#B89D63]">{hotel.name}</h1>
        <p className="text-gray-600 text-lg mb-1">{hotel.address}</p>
        <p className="text-sm text-gray-500 mb-6">
          Check-in: {hotel.check_in} | Check-out: {hotel.check_out}
        </p>

        <p className="text-gray-700 text-base leading-relaxed mb-10">
          {hotel.description}
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#B89D63]">
            Hotel Amenities
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-800 list-disc list-inside text-sm">
            {hotel.amenities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);

export default ExploreHotelDetails;
