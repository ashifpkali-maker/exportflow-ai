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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center px-6 text-center">

      {/* HERO */}
      <div className="max-w-3xl mt-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Automate Your Export Business with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            ExportFlow AI
          </span>
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          AI systems to handle documentation, supplier communication,
          and global operations — so you can scale faster.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-3 justify-center"
        >
          <input
            type="email"
            placeholder="Join the waitlist"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 rounded-xl border w-full md:w-80 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition">
            Request Access
          </button>
        </form>

        {message && <p className="mt-4">{message}</p>}
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl w-full">

        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">📄 Document Automation</h3>
          <p className="text-gray-600">
            Generate invoices, packing lists, and export documents instantly.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🤖 Supplier AI</h3>
          <p className="text-gray-600">
            Automate emails, follow-ups, and negotiations globally.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">📊 Smart Dashboard</h3>
          <p className="text-gray-600">
            Track shipments, orders, and operations with AI insights.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <p className="text-sm text-gray-400 mt-20 mb-10">
        Built for exporters, traders, and global suppliers.
      </p>

      {/* ✅ WHATSAPP BUTTON */}
      <a
        href="https://wa.me/918129606474?text=Hi%20I%20am%20interested%20in%20ExportFlow%20AI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        💬 WhatsApp
      </a>

    </div>
  );
}