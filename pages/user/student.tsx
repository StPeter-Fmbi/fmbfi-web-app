"use client";
import axios from "axios";
import { useState } from "react";

export interface IUser {
  scholardid: number;
  username: string;
  password: string;
  email: string;
  auditdate: string;
}

export default function UserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/api/getUser");
      setUsers(Array.isArray(res.data.user) ? res.data.user : []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchUsers(); // Fetch users on modal open
  };

  const handleClose = () => {
    setIsOpen(false);
    setUsers([]);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Open Modal Button */}
      <button
        onClick={handleOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
      >
        View Students
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-x-auto">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Student List</h2>

            {loading && <p>Loading students...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && users.length > 0 && (
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Scholar ID</th>
                    <th className="border px-3 py-2 text-left">Username</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Audit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{user.scholardid}</td>
                      <td className="border px-3 py-2">{user.username}</td>
                      <td className="border px-3 py-2">{user.email}</td>
                      <td className="border px-3 py-2">
                        {new Date(user.auditdate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && users.length === 0 && !error && (
              <p>No students found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
