"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ssctpvqpszglytteytjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY3RwdnFwc3pnbHl0dGV5dGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzc0NTIsImV4cCI6MjA5MTgxMzQ1Mn0.2a_QpNDw7vPrYe1OkFje3SdwF3gaEWCEn7iqca54sZQ"
);

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
    } else {
      setUser(savedUser);

      // 🔥 SAVE TO DATABASE
      supabase.from("waitlist").insert([
        { email: savedUser }
      ]);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "50px" }}>
      <h1>Welcome {user}</h1>

      <p>User saved to database 🚀</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}