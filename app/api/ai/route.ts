import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    let buyer = "";
    let product = "";
    let amount = "";

    // 🔹 Try AI first
    try {
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
                "Extract buyer, product, and amount. Return ONLY JSON like {\"buyer\":\"...\",\"product\":\"...\",\"amount\":\"...\"}.",
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

      content = content.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(content);

      buyer = parsed.buyer || "";
      product = parsed.product || "";
      amount = parsed.amount || "";
    } catch {
      console.log("AI failed → using fallback");
    }

    // 🔥 FALLBACK (always works)
    if (!buyer) {
      const buyerMatch = input.match(/to\s(.+)$/i);
      buyer = buyerMatch ? buyerMatch[1] : "";
    }

    if (!product) {
      const productMatch = input.match(/export\s(.+?)\sto/i);
      product = productMatch ? productMatch[1] : input;
    }

    if (!amount) {
      const amountMatch = input.match(/(\d+)\s*(usd|rs|inr|\$)/i);
      amount = amountMatch ? amountMatch[1] : "";
    }

    return NextResponse.json({
      buyer,
      product,
      amount,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      buyer: "",
      product: "",
      amount: "",
    });
  }
}