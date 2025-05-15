import { useState } from "react";

import HotelsTab from "../components/hotels/HotelsTab";
import UsersTab from "../components/users/UsersTab";
import BookingsTab from "../components/bookings/BookingsTab";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hotels");



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#B89D63]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage hotels, users, and bookings
        </p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {["hotels", "users", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "text-[#B89D63] border-b-2 border-[#B89D63]"
                : "text-gray-600 hover:text-[#B89D63]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <section className="space-y-6">
        {/* Hotels Tab */}
        {activeTab === "hotels" && (
          <>
            <HotelsTab />
          </>
      )}


        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            <UsersTab />
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
            <BookingsTab />
          </>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
