import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

function SigninPageB() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://bank-backend-c1sy.onrender.com/check-user', {
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

        navigate(data.user.role === 'admin' ? '/layout' : '/layout');
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.warn("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
      <h1 className="text-3xl sm:text-4xl text-orange-600 pb-10 text-center font-semibold">
        Welcome to Enpointe.io Banking Service
      </h1>
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-6 rounded shadow-md w-full max-w-sm sm:max-w-md"
        aria-label="Employee Login Form"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          required 
          aria-label="Email"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          required 
          aria-label="Password"
        />
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors duration-300"
          aria-label="Sign In"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SigninPageB;
