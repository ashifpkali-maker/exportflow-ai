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
              "Extract buyer, product, and amount. Return ONLY JSON like {\"buyer\":\"...\",\"product\":\"...\",\"amount\":\"...\"}. No text.",
          },
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    const data = await response.json();

    let content = data.choices?.[0]?.message?.content || "";

    // 🔥 CLEAN RESPONSE (important fix)
    content = content.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("AI ERROR:", error);
    return NextResponse.json(
      { buyer: "", product: "", amount: "" },
      { status: 200 }
    );
  }
}