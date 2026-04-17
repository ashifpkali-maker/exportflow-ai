"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
    } else {
      setUser(savedUser);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "50px" }}>
      <h1>Welcome {user}</h1>

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