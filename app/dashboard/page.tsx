"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY3RwdnFwc3pnbHl0dGV5dGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzc0NTIsImV4cCI6MjA5MTgxMzQ1Mn0.2a_QpNDw7vPrYe1OkFje3SdwF3gaEWCEn7iqca54sZQ"
);

type Invoice = {
  id: number;
  buyer: string;
  product: string;
  amount: string;
  created_at: string;
};

type Shipment = {
  id: number;
  buyer: string;
  product: string;
  status: string;
  destination: string;
  created_at: string;
};

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [tab, setTab] = useState<"overview" | "invoices" | "shipments">("overview");
  const [loading, setLoading] = useState(true);

  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("Pending");
  const [saving, setSaving] = useState(false);

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("user") || ""
      : "";

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    const [inv, ship] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_email", userEmail),
      supabase.from("shipments").select("*").eq("user_email", userEmail),
    ]);

    if (inv.data) setInvoices(inv.data);
    if (ship.data) setShipments(ship.data);

    setLoading(false);
  };

  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (parseFloat(inv.amount) || 0),
    0
  );

  const addShipment = async () => {
    if (!buyer || !product || !destination) return alert("Fill all fields");

    setSaving(true);

    const { error } = await supabase.from("shipments").insert([
      {
        user_email: userEmail,
        buyer,
        product,
        destination,
        status,
      },
    ]);

    setSaving(false);

    if (error) return alert(error.message);

    setBuyer("");
    setProduct("");
    setDestination("");
    setStatus("Pending");
    fetchAll();
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from("shipments").update({ status: newStatus }).eq("id", id);
    fetchAll();
  };

  const deleteShipment = async (id: number) => {
    await supabase.from("shipments").delete().eq("id", id);
    fetchAll();
  };

  const statusColor = (s: string) => {
    if (s === "Delivered") return "bg-green-100 text-green-700";
    if (s === "In Transit") return "bg-blue-100 text-blue-700";
    if (s === "Pending") return "bg-yellow-100 text-yellow-700";
    if (s === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-blue-600 text-xl">ExportFlow AI</h1>

        <div className="flex gap-4 items-center">

          <a
            href="/invoice"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Create Invoice
          </a>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          {["overview", "invoices", "shipments"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded-lg ${
                tab === t ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl">
              Invoices: {invoices.length}
            </div>

            <div className="bg-white p-5 rounded-xl">
              Revenue: ₹{totalRevenue}
            </div>

            <div className="bg-white p-5 rounded-xl">
              Shipments: {shipments.length}
            </div>

            <div className="bg-white p-5 rounded-xl">
              In Transit: {shipments.filter(s => s.status === "In Transit").length}
            </div>
          </div>
        )}

        {/* SHIPMENTS */}
        {tab === "shipments" && (
          <div className="bg-white p-6 rounded-xl mt-6">

            <h2 className="text-xl font-bold mb-4">Add Shipment</h2>

            <input placeholder="Buyer" value={buyer} onChange={e => setBuyer(e.target.value)} className="border p-2 w-full mb-2" />
            <input placeholder="Product" value={product} onChange={e => setProduct(e.target.value)} className="border p-2 w-full mb-2" />
            <input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} className="border p-2 w-full mb-2" />

            <button
              onClick={addShipment}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Add Shipment"}
            </button>

          </div>
        )}

        {/* INVOICES */}
        {tab === "invoices" && (
          <div className="bg-white p-6 rounded-xl mt-6">
            {invoices.map(inv => (
              <div key={inv.id} className="border-b py-2">
                {inv.buyer} — ₹{inv.amount}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}