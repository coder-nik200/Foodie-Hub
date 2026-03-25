import { useState } from "react";
import { useUser } from "../context/useContext";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const { user, updateProfile } = useUser();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfile(formData.name);

      setSuccessMessage("Profile updated successfully!");

      setIsEditing(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
        {/* Top Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-600 py-10 flex flex-col items-center">
          <FaUserCircle className="text-8xl text-white drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-white mt-4">My Profile</h1>
        </div>

        <div className="p-8 md:p-10">
          {successMessage && (
            <div className="mb-6 bg-green-100 text-green-700 text-center py-3 rounded-xl font-medium shadow-sm">
              {successMessage}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Name</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formData.name}
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="text-xl font-semibold text-gray-800">
                  {user?.email}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 flex-col md:flex-row gap-4">
                <span className="bg-gray-200 px-5 py-2 rounded-full text-sm font-medium text-gray-700">
                  {user?.role === "admin" ? "👑 Admin" : "👤 User"}
                </span>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition shadow-md"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-600 mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 shadow-md"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
