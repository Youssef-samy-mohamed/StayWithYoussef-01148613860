import { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hooks";
import {Hotel} from "../../../types/hotels";

interface EditHotelFormProps {
  hotel: Hotel;
  onClose: () => void;
}

const EditHotelForm: React.FC<EditHotelFormProps> = ({ hotel, onClose }) => {
  const token = useAppSelector((state) => state.auth.accessToken);

  const [formData, setFormData] = useState({
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    location: hotel.location,
    check_in: hotel.check_in,
    check_out: hotel.check_out,
    cancellation_policy: hotel.cancellation_policy,
    amenities: hotel.amenities || [],
    rooms: hotel.rooms || [],
    images: hotel.images || [],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/hotels/${hotel.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Hotel updated successfully!");
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to update hotel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-[#B89D63]">Edit Hotel</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Hotel Name"
          className="w-full p-2 mb-3 border rounded"
        />

        <textarea
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="location"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="address"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="images"
          value={formData.images as unknown as string}
          onChange={handleChange}
          placeholder="images"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="amenities"
          value={formData.amenities as unknown as string}
          onChange={handleChange}
          placeholder="amenities"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="check_in"
          value={formData.check_in}
          onChange={handleChange}
          placeholder="check_in"
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          name="check_out"
          value={formData.check_out}
          onChange={handleChange}
          placeholder="check_out"
          className="w-full p-2 mb-3 border rounded"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#B89D63] text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHotelForm;
