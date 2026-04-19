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
const [aiInput, setAiInput] = useState("");
<input
  placeholder="Type: Export rice to Dubai for 5000 USD to ABC Traders"
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