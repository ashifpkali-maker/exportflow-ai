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
        messages: [
          {
            role: "system",
            content: `
You are an AI that extracts structured invoice data.

From the input, extract:
- buyer (company name only)
- product (include quantity if mentioned)
- amount (number only, no currency)

Rules:
- Buyer is usually after "to"
- Product is the exported item
- Amount is the price

Return ONLY valid JSON:
{"buyer":"...", "product":"...", "amount":"..."}

No explanation, only JSON.
            `,
          },
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}