// AddHotelForm.tsx
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { addHotel } from "../../../store/hotels/act/actAddThunk"; // You'll create this thunk
import { toast } from "react-toastify";

const AddHotelForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    images: "", // Or handle file upload later
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(addHotel(formData));
    if (addHotel.fulfilled.match(resultAction)) {
      toast.success("Hotel added successfully");
      onClose();
    } else {
      toast.error("Failed to add hotel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Hotel</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Hotel Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="location"
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="address"
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="images"
            onChange={handleChange}
            placeholder="Image URL (comma-separated)"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="text-gray-500">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#B89D63] text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotelForm;
