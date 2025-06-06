import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import {Loader} from 'lucide-react'

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const res = await fetch('https://bank-backend-c1sy.onrender.com/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success("Login Successful");

        // Redirect based on role (both currently to /layout)
        navigate(data.user.role === 'admin' ? '/layout' : '/layout');
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.warn("An Error Occurred During Login");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
      <h1 className="text-2xl sm:text-3xl text-orange-600 pb-8 text-center max-w-md">
        <strong>Welcome to Enpointe.io Banking Service</strong>
      </h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 sm:p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading && <Loader className="h-5 w-5 animate-spin inline-block" />}
          {loading ? "Loading..." : "Sign In"}
        </button>
        <div className="mt-6 flex flex-col items-center space-y-3 text-sm">
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            New user? Sign up here
          </Link>
          <Link to="/signinb" className="text-blue-500 hover:text-blue-700">
            Banker's Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SigninPage;
