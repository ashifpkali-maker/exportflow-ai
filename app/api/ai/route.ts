import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Extract buyer, product, and amount from text and return ONLY JSON like {buyer, product, amount}",
          },
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "AI failed" },
      { status: 500 }
    );
  }
}
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
    alert("AI failed to parse");
  }
};content: `
Extract the following fields from user input:
- buyer (company name)
- product (include quantity if mentioned)
- amount (number only)

Return ONLY valid JSON like:
{"buyer":"...", "product":"...", "amount":"..."}

No explanation.
`,