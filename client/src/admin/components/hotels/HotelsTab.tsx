import { useState } from "react";
import useHome from "../../../pages/Home/useHome";
import AddHotelForm from "./AddHotelForm";
import EditHotelForm from "./EditHotelForm";
import { Hotel } from "../../../types/hotels";

const HotelsTab = () => {
  const { hotels } = useHome();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#eee]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#B89D63]">Hotels</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#B89D63] text-white rounded-xl hover:bg-[#a58950] transition"
          >
            Add Hotel
          </button>
        </div>

        {/* Hotels Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600 text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Address</th>
                <th className="p-3">Description</th>
                <th className="p-3">Images</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{hotel.id}</td>
                    <td className="p-3">{hotel.name}</td>
                    <td className="p-3">{hotel.location}</td>
                    <td className="p-3">{hotel.address}</td>
                    <td className="p-3">{hotel.description}</td>
                    <td className="p-3">
                      {Array.isArray(hotel.images)
                        ? hotel.images.join(", ")
                        : hotel.images}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          className="text-[#B89D63] hover:underline"
                          onClick={() => setEditingHotel(hotel)}
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3" colSpan={7}>
                    No hotels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hotel Modal */}
      {showAddModal && <AddHotelForm onClose={() => setShowAddModal(false)} />}

      {/* Edit Hotel Modal */}
      {editingHotel && (
        <EditHotelForm
          hotel={editingHotel}
          onClose={() => setEditingHotel(null)}
        />
      )}
    </>
  );
};

export default HotelsTab;
