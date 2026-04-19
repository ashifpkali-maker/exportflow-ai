import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    let buyer = "";
    let product = "";
    let amount = "";

    // 🔹 Extract Buyer (after "to")
    const buyerMatch = input.match(/to\s(.+)$/i);
    if (buyerMatch) {
      buyer = buyerMatch[1].trim();
    }

    // 🔹 Extract Product (between "export" and "to")
    const productMatch = input.match(/export\s(.+?)\sto/i);
    if (productMatch) {
      product = productMatch[1].trim();
    }

    // 🔹 Extract Amount (biggest number in string)
    const numbers = input.match(/\d+/g);
    if (numbers) {
      amount = numbers[numbers.length - 1]; // last number (usually price)
    }

    return NextResponse.json({
      buyer,
      product,
      amount,
    });

  } catch (error) {
    return NextResponse.json({
      buyer: "",
      product: "",
      amount: "",
    });
  }
}