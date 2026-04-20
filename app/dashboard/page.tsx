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
      supabase
        .from("invoices")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false }),
      supabase
        .from("shipments")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false }),
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
    if (!buyer || !product || !destination) {
      alert("Fill all shipment fields");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("shipments").insert([
      { user_email: userEmail, buyer, product, destination, status },
    ]);
    setSaving(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Shipment added!");
      setBuyer("");
      setProduct("");
      setDestination("");
      setStatus("Pending");
      fetchAll();
    }
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
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ExportFlow AI</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">{userEmail}</p>
          
            href="/invoice"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create Invoice
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        <div className="flex gap-3 mb-6">
          {(["overview", "invoices", "shipments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl font-semibold capitalize ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
                <p className="text-3xl font-bold text-blue-600">
                  {invoices.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-sm text-gray-500 mb-1">Shipments</p>
                <p className="text-3xl font-bold text-purple-600">
                  {shipments.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-sm text-gray-500 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-orange-500">
                  {shipments.filter((s) => s.status === "In Transit").length}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Recent Invoices</h2>
                <a href="/invoice" className="text-sm text-blue-600">
                  + New Invoice
                </a>
              </div>
              {invoices.length === 0 ? (
                <p className="text-gray-400 text-sm">No invoices yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b">
                      <th className="pb-2">Buyer</th>
                      <th className="pb-2">Product</th>
                      <th className="pb-2 text-right">Amount</th>
                      <th className="pb-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{inv.buyer}</td>
                        <td className="py-2 text-gray-500">{inv.product}</td>
                        <td className="py-2 text-right font-semibold text-green-600">
                          ₹{inv.amount}
                        </td>
                        <td className="py-2 text-right text-gray-400">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Recent Shipments</h2>
                <button
                  onClick={() => setTab("shipments")}
                  className="text-sm text-blue-600"
                >
                  + Add Shipment
                </button>
              </div>
              {shipments.length === 0 ? (
                <p className="text-gray-400 text-sm">No shipments yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b">
                      <th className="pb-2">Buyer</th>
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Destination</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.slice(0, 5).map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{s.buyer}</td>
                        <td className="py-2 text-gray-500">{s.product}</td>
                        <td className="py-2 text-gray-500">{s.destination}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(s.status)}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === "invoices" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">All Invoices</h2>
              
                href="/invoice"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                + New Invoice
              </a>
            </div>
            {invoices.length === 0 ? (
              <p className="text-gray-400">No invoices yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b">
                    <th className="pb-3">Buyer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{inv.buyer}</td>
                      <td className="py-3 text-gray-500">{inv.product}</td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        ₹{inv.amount}
                      </td>
                      <td className="py-3 text-right text-gray-400">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "shipments" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-6">Add Shipment</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Buyer Name</label>
                  <input
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                    placeholder="Royal Traders"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Product</label>
                  <input
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                    placeholder="500kg Rice"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Destination</label>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                    placeholder="Dubai, UAE"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                  >
                    <option>Pending</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addShipment}
                disabled={saving}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold"
              >
                {saving ? "Saving..." : "Add Shipment"}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-6">All Shipments</h2>
              {shipments.length === 0 ? (
                <p className="text-gray-400 text-sm">No shipments yet.</p>
              ) : (
                <div className="space-y-3">
                  {shipments.map((s) => (
                    <div key={s.id} className="border rounded-xl p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{s.buyer}</p>
                          <p className="text-sm text-gray-500">{s.product}</p>
                          <p className="text-sm text-gray-400">{s.destination}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {["Pending", "In Transit", "Delivered"].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateStatus(s.id, st)}
                            className={`text-xs px-3 py-1 rounded-full border ${
                              s.status === st
                                ? "bg-blue-600 text-white border-blue-600"
                                : "text-gray-500 border-gray-300"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                        <button
                          onClick={() => deleteShipment(s.id)}
                          className="text-xs px-3 py-1 rounded-full border border-red-300 text-red-500 ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}