"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY3RwdnFwc3pnbHl0dGV5dGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzc0NTIsImV4cCI6MjA5MTgxMzQ1Mn0.2a_QpNDw7vPrYe1OkFje3SdwF3gaEWCEn7iqca54sZQ"
);

export default function InvoicePage() {
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

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
    } else {
      alert("Invoice saved ✅");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Create Invoice</h1>

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
        Save Invoice
      </button>
    </div>
  );
}