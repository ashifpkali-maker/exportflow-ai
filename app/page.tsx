"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          Scale Your Export Business with{" "}
          <span className="text-blue-600">ExportFlow AI</span>
        </h1>

        <p className="text-lg mb-8 text-gray-600">
          We build AI systems for export businesses to automate documentation,
          streamline supplier communication, and manage global operations—so you
          can grow faster with fewer manual tasks.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">
              Document Automation
            </h3>
            <p className="text-sm text-gray-600">
              Instantly generate invoices, packing lists, and compliance docs.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">
              Supplier &amp; Buyer AI
            </h3>
            <p className="text-sm text-gray-600">
              Automate emails, follow-ups, and negotiations across borders.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">
              Operations Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              Track shipments, orders, and workflows with AI-powered insights.
            </p>
          </div>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <input
              type="email"
              placeholder="Join the waitlist (exporters only)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border w-full md:w-80"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              Request Early Access
            </button>
          </form>
        ) : (
          <p className="text-green-600 font-semibold">
            You're on the list! We'll be in touch soon.
          </p>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Built for exporters, traders, and global suppliers.
        </p>
      </motion.div>
    </div>
  );
}