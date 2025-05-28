import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SigninPage({ onSignInPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Check for admin credentials
    if (email === "admin@gmail.com" && password === "admin@admin") {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('role', 'admin');
      navigate('/admin');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'user');
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/layout');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl text-orange-600 pb-10"> <strong>Welcome to Enpointe.io Banking Service</strong></h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
        >
          Sign In
        </button>
        <h1 className="text-center mt-4">
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            New user? Sign up here
          </Link>
        </h1>
      </form>
    </div>
  );
}
