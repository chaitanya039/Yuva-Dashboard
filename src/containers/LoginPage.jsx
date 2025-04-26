// src/containers/LoginPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo2.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // redirect once logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // show backend errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warning("Both fields are required");
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Company Logo"
            className="mx-auto h-16 invert"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Access Dashboard
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 cursor-pointer py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
