"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY3RwdnFwc3pnbHl0dGV5dGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzc0NTIsImV4cCI6MjA5MTgxMzQ1Mn0.2a_QpNDw7vPrYe1OkFje3SdwF3gaEWCEn7iqca54sZQ"
);

export default function Page() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ You're on the list!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      
      <h1 className="text-5xl font-bold mb-6">
        Scale Your Export Business with{" "}
        <span className="text-blue-600">ExportFlow AI</span>
      </h1>

      <p className="text-gray-600 mb-8 max-w-xl">
        We build AI systems for export businesses to automate documentation,
        streamline supplier communication, and manage global operations.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-4 py-3 rounded w-72"
          required
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Join Waitlist
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

    </div>
  );
}