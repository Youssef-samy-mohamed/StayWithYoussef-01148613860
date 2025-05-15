import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hooks";

interface EditUserFormProps {
  userId: string | number; // ID of the user to update
  initialEmail: string;
  initialRole: string;
  onClose: () => void;
  onUserAdded: () => void;
}

const EditUserForm = ({
  userId,
  initialEmail,
  initialRole,
  onClose,
  onUserAdded,
}: EditUserFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const token = useAppSelector((state) => state.auth.accessToken);

  // Sync state when initial props change (important for modal reuse)
  useEffect(() => {
    setEmail(initialEmail);
    setRole(initialRole);
  }, [initialEmail, initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:5000/users/${userId}`,
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated successfully");
      onUserAdded();
      onClose();
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-[#B89D63]">Edit User</h2>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          disabled={loading}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border rounded text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#B89D63]"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
