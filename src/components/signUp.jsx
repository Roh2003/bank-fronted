import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage({ onSignUpPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch('http://localhost:5000/api/creating-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        // Store user data and navigate to sign in page
        navigate('/signin');
        alert(data.message)
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center flex-col gap-4 mb-10 justify-center bg-gray-100">
      <h1 className="font-bold text-3xl text-orange-400">Enpointe.io Banking Application</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl text-center font-bold mb-4">Sign Up</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
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
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <h1 className="text-center mt-4">
          <Link to="/signin" className="text-blue-500 hover:text-blue-700">
            Already have an account? Sign in
          </Link>
        </h1>
      </form>
    </div>
  );
}
