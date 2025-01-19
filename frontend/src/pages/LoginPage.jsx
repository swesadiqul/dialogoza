import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/login/", {
        username,
        password,
      });

      // Save the token to localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect or update the UI
      alert("Login successful!");
      window.location.href = "/chat"; // Redirect to a secure page
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please login to your account
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Divider */}
        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <button
            type="button"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 w-5 h-5" />
            <span>Login with Google</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
            <span>Login with Facebook</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
