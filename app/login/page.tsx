"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    // Save fake user locally
    localStorage.setItem("user", email);

    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Login (Dev Mode)</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-3 mb-4 rounded w-72"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Instant Login
      </button>
    </div>
  );
}