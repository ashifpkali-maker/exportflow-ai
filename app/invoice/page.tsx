const generateWithAI = async () => {
  if (!aiInput) return;

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: aiInput }),
    });

    const data = await res.json();

    console.log("DATA:", data);

    setBuyer(data.buyer || "");
    setProduct(data.product || "");
    setAmount(data.amount || "");

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};