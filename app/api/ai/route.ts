import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Extract buyer, product, and amount. Return ONLY JSON like {\"buyer\":\"...\",\"product\":\"...\",\"amount\":\"...\"}. No explanation.",
          },
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    const data = await response.json();

    let content = data?.choices?.[0]?.message?.content || "";

    // 🔥 CLEAN ANY BAD FORMATTING
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      // 🔥 FALLBACK (no crash)
      parsed = {
        buyer: "",
        product: input,
        amount: "",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      buyer: "",
      product: "",
      amount: "",
    });
  }
}