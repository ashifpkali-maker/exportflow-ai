const generateWithAI = async () => {
  if (!aiInput) return;

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: aiInput,
    }),
  });

  const data = await res.json();

  try {
    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text);

    setBuyer(parsed.buyer || "");
    setProduct(parsed.product || "");
    setAmount(parsed.amount || "");
  } catch (err) {
    alert("AI parsing failed");
  }
};