import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import useFetchAllUsers from "../../components/users/useFetchAllUsers";
import EditUserForm from "./EditUserForm";
import { useAppSelector } from "../../../store/hooks";
import { User } from "../../../types/users";

const UsersTab = () => {
  const { users, refetch } = useFetchAllUsers();
  const token = useAppSelector((state) => state.auth.accessToken);

  // State for currently editing user
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [editingUserRole, setEditingUserRole] = useState<User["role"]>("user");

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setEditingUserEmail(user.email);
    setEditingUserRole(user.role);
  };

  const closeEditModal = () => {
    setEditingUserId(null);
    setEditingUserEmail("");
    setEditingUserRole("user");
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#eee]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#B89D63]">Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600 text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">ID</th>
                <th className="p-3 ">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        className="text-[#B89D63] hover:underline"
                        onClick={() => openEditModal(user)}
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUserId !== null && (
        <EditUserForm
          userId={editingUserId}
          initialEmail={editingUserEmail}
          initialRole={editingUserRole}
          onClose={closeEditModal}
          onUserAdded={() => {
            refetch();
            closeEditModal();
          }}
        />
      )}
    </>
  );
};

export default UsersTab;
