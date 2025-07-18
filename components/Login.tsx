// components/LoginForm.tsx
import React, { FC } from "react";

interface LoginFormProps {
  userType: "scholar" | "admin";
}

const LoginForm: FC<LoginFormProps> = ({ userType }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">
        {userType === "scholar" ? "Scholar Login" : "Admin Login"}
      </h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#d12f27] text-white rounded-lg"
        >
          {userType === "scholar" ? "Login as Scholar" : "Login as Admin"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
