"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "sb_publishable_jHLki07GcaZDH3fQz7cFlg_9s57meZS"
);

export default function InvoicePage() {
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const invoiceRef = useRef(null);

  // ✅ SAVE INVOICE
  const handleSave = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Login first");
      return;
    }

    const { error } = await supabase.from("invoices").insert([
      {
        user_email: user,
        buyer,
        product,
        amount,
      },
    ]);

    if (error) {
      alert("Error saving invoice");
      return;
    }

    setShowInvoice(true);
  };

  // 🤖 AI GENERATE
  const generateWithAI = async () => {
    if (!aiInput) return;

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: aiInput }),
    });

    const data = await res.json();

    try {
      const text = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(text);

      setBuyer(parsed.buyer || "");
      setProduct(parsed.product || "");
      setAmount(parsed.amount || "");
    } catch (err) {
      console.log("AI RAW:", data);
      alert("AI parsing failed");
    }
  };

  // 📄 DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("invoice.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-6">Create Invoice 🔥 AI</h1>

        {!showInvoice && (
          <>
            {/* 🤖 AI INPUT */}
            <input
              placeholder="Type: Export 500kg rice to Dubai for 3000 USD to Royal Traders"
              className="border p-3 w-full mb-3 rounded"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />

            <button
              onClick={generateWithAI}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
            >
              Generate with AI
            </button>

            {/* MANUAL INPUT */}
            <input
              placeholder="Buyer Name"
              className="border p-3 w-full mb-4 rounded"
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
            />

            <input
              placeholder="Product"
              className="border p-3 w-full mb-4 rounded"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />

            <input
              placeholder="Amount"
              className="border p-3 w-full mb-4 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-3 rounded w-full"
            >
              Generate Invoice
            </button>
          </>
        )}

        {showInvoice && (
          <>
            <div ref={invoiceRef} className="border p-6 rounded-lg mt-6">

              {/* HEADER */}
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">ExportFlow AI</h2>
                  <p className="text-sm text-gray-500">Global Export Solutions</p>
                  <p className="text-sm text-gray-500">export@mywebz.in</p>
                  <p className="text-sm text-gray-500">+91 88885 67870</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">INVOICE</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Invoice #: INV-{Date.now().toString().slice(-5)}
                  </p>
                </div>
              </div>

              {/* BUYER */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">Bill To:</p>
                <p className="font-semibold">{buyer}</p>
              </div>

              {/* TABLE */}
              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Product</th>
                    <th className="p-2">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="p-2 border">{product}</td>
                    <td className="p-2 border">₹{amount}</td>
                  </tr>
                </tbody>
              </table>

              {/* TOTAL */}
              <div className="text-right mb-6">
                <p className="font-bold text-lg">
                  Total: ₹{amount}
                </p>
              </div>

              {/* SIGNATURE */}
              <div className="text-right mt-10">
                <p className="text-sm">Authorized Signature</p>
                <div className="h-10"></div>
                <p className="font-semibold">ExportFlow AI</p>
              </div>

            </div>

            <button
              onClick={downloadPDF}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded w-full"
            >
              Download PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}