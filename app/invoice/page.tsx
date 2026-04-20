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

export default function InvoicePage() {
  const [aiInput, setAiInput] = useState("");
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tab, setTab] = useState<"create" | "history">("create");
  const [saving, setSaving] = useState(false);

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("user") || ""
      : "";

  useEffect(() => {
    if (tab === "history") fetchInvoices();
  }, [tab]);

  const fetchInvoices = async () => {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });
    if (data) setInvoices(data);
  };

  const generateWithAI = async () => {
    if (!aiInput) return;
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: aiInput }),
    });
    const data = await res.json();
    setBuyer(data.buyer || "");
    setProduct(data.product || "");
    setAmount(data.amount || "");
  };

  const saveInvoice = async () => {
    if (!buyer || !product || !amount) {
      alert("Fill all fields first");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("invoices").insert([
      { user_email: userEmail, buyer, product, amount },
    ]);
    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Invoice saved!");
      setBuyer("");
      setProduct("");
      setAmount("");
      setAiInput("");
    }
  };

  const downloadPDF = () => {
    const invoiceNumber = "INV-" + Date.now().toString().slice(-5);
    const date = new Date().toLocaleDateString();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 60px; color: #000; background: #fff; max-width: 700px; margin: auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company { font-size: 24px; font-weight: bold; }
          .subtitle { font-size: 13px; color: #666; margin-top: 4px; }
          .invoice-label { font-size: 22px; font-weight: bold; text-align: right; }
          .meta { font-size: 13px; color: #666; text-align: right; margin-top: 4px; }
          .bill-section { margin-bottom: 30px; }
          .bill-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .bill-name { font-size: 18px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 13px; color: #555; border-bottom: 2px solid #e0e0e0; }
          td { padding: 14px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-section { text-align: right; margin-top: 30px; padding-top: 16px; border-top: 2px solid #000; }
          .total-label { font-size: 13px; color: #666; }
          .total-amount { font-size: 24px; font-weight: bold; margin-top: 4px; }
          .signature { margin-top: 80px; text-align: right; }
          .sig-line { border-top: 1px solid #000; width: 200px; margin-left: auto; margin-bottom: 8px; }
          .sig-name { font-size: 14px; font-weight: bold; }
          .sig-sub { font-size: 12px; color: #999; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #bbb; border-top: 1px solid #eee; padding-top: 20px; }
          .print-hint { background: #f0f7ff; border: 1px solid #cce0ff; padding: 12px 20px; border-radius: 8px; margin-bottom: 30px; font-size: 13px; color: #1a5fa8; }
          @media print { .print-hint { display: none; } }
        </style>
      </head>
      <body>
        <div class="print-hint">
          To save as PDF: press <strong>Ctrl + P</strong> (Windows) or <strong>Cmd + P</strong> (Mac) then choose <strong>Save as PDF</strong>
        </div>

        <div class="header">
          <div>
            <div class="company">ExportFlow AI</div>
            <div class="subtitle">Global Export Solutions</div>
          </div>
          <div>
            <div class="invoice-label">INVOICE</div>
            <div class="meta">${invoiceNumber}</div>
            <div class="meta">Date: ${date}</div>
          </div>
        </div>

        <div class="bill-section">
          <div class="bill-label">Bill To</div>
          <div class="bill-name">${buyer}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product / Description</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${product}</td>
              <td style="text-align:right">₹${amount}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-label">Total Amount</div>
          <div class="total-amount">₹${amount}</div>
        </div>

        <div class="signature">
          <div class="sig-line"></div>
          <div class="sig-name">ExportFlow AI</div>
          <div class="sig-sub">Authorized Signature</div>
        </div>

        <div class="footer">
          Thank you for your business! &nbsp;|&nbsp; ExportFlow AI &nbsp;|&nbsp; Global Export Solutions
        </div>
      </body>
      </html>
    `;

    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.write(html);
      newTab.document.close();
    } else {
      alert("Please allow popups for this site to view the invoice.");
    }
  };

  const deleteInvoice = async (id: number) => {
    await supabase.from("invoices").delete().eq("id", id);
    fetchInvoices();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("create")}
            className={`px-6 py-2 rounded-xl font-semibold ${
              tab === "create"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            Create Invoice
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2 rounded-xl font-semibold ${
              tab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            Invoice History
          </button>
        </div>

        {tab === "create" && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white p-8 rounded-2xl shadow">
              <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

              <input
                type="text"
                placeholder="Type: Export 500kg rice to Dubai for 3000 USD to Royal Traders"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="w-full p-3 border rounded-xl mb-3"
              />
              <button
                onClick={generateWithAI}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mb-6"
              >
                Generate with AI
              </button>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Buyer Name</label>
                  <input
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Product</label>
                  <input
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Amount</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border rounded-xl mt-1"
                  />
                </div>
              </div>

              <button
                onClick={saveInvoice}
                disabled={saving}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold"
              >
                {saving ? "Saving..." : "Save Invoice"}
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow">
              <div
                className="p-6 border rounded-xl"
                style={{ background: "#fff", color: "#000" }}
              >
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">ExportFlow AI</h2>
                    <p className="text-sm text-gray-500">Global Export Solutions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">INVOICE</p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Bill To:</p>
                  <p className="font-semibold">{buyer || "—"}</p>
                </div>

                <table className="w-full border-t mt-2">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="py-2">Product</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-3">{product || "—"}</td>
                      <td className="py-3 text-right">₹{amount || "0"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-right mt-4 font-bold text-lg">
                  Total: ₹{amount || "0"}
                </div>
                <p className="text-xs text-gray-400 mt-6 text-center">
                  Thank you for your business!
                </p>
              </div>

              <button
                onClick={downloadPDF}
                className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
              >
                View & Download Invoice
              </button>
            </div>

          </div>
        )}

        {tab === "history" && (
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6">Invoice History</h2>
            {invoices.length === 0 ? (
              <p className="text-gray-500">No invoices saved yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Buyer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{inv.buyer}</td>
                      <td className="py-3">{inv.product}</td>
                      <td className="py-3">₹{inv.amount}</td>
                      <td className="py-3 text-gray-400">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}