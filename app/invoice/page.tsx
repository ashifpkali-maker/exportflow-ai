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

  if (data.error) {
    alert("AI failed");
    return;
  }

  // ✅ NOW DIRECT DATA (no parsing needed)
  setBuyer(data.buyer || "");
  setProduct(data.product || "");
  setAmount(data.amount || "");
};