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
    const parsed = JSON.parse(
      data.choices[0].message.content
    );

    setBuyer(parsed.buyer || "");
    setProduct(parsed.product || "");
    setAmount(parsed.amount || "");

  } catch (err) {
    console.log("RAW:", data);
    alert("AI parsing failed");
  }
};