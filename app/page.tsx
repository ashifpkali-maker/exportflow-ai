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

      {/* HERO */}
      <h1 className="text-5xl font-bold mb-6">
        Scale Your Export Business with{" "}
        <span className="text-blue-600">ExportFlow AI</span>
      </h1>

      <p className="text-gray-600 mb-10 max-w-xl">
        We build AI systems for export businesses to automate documentation,
        streamline supplier communication, and manage global operations.
      </p>

      {/* 🔥 3 FEATURE CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl">
        
        <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">
            Document Automation
          </h3>
          <p className="text-sm text-gray-600">
            Instantly generate invoices, packing lists, and compliance docs.
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">
            Supplier & Buyer AI
          </h3>
          <p className="text-sm text-gray-600">
            Automate emails, follow-ups, and negotiations across borders.
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">
            Operations Dashboard
          </h3>
          <p className="text-sm text-gray-600">
            Track shipments, orders, and workflows with AI-powered insights.
          </p>
        </div>

      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="email"
          placeholder="Join the waitlist (exporters only)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-4 py-3 rounded w-72"
          required
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Request Early Access
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <p className="text-xs text-gray-400 mt-6">
        Built for exporters, traders, and global suppliers.
      </p>

    </div>
  );
}