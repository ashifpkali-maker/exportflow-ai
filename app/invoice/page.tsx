"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "sb_publishable_jHLki07GcaZDH3fQz7cFlg_9s57meZS"
);

export default function InvoicePage() {
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);

  const handleSave = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Login first");
      return;
    }

    await supabase.from("invoices").insert([
      {
        user_email: user,
        buyer,
        product,
        amount,
      },
    ]);

    setShowInvoice(true);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Create Invoice
      </h1>

      {!showInvoice && (
        <>
          <input
            placeholder="Buyer Name"
            onChange={(e) => setBuyer(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Product"
            onChange={(e) => setProduct(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <br /><br />

          <button onClick={handleSave}>
            Generate Invoice
          </button>
        </>
      )}

      {showInvoice && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "30px",
            marginTop: "30px",
            borderRadius: "10px",
          }}
        >
          <h2>Invoice</h2>

          <p><strong>Buyer:</strong> {buyer}</p>
          <p><strong>Product:</strong> {product}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>

          <hr />

          <p>Thank you for your business!</p>
        </div>
      )}
    </div>
  );
}