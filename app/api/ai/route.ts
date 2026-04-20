import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { input } = await req.json();

  let buyer = "";
  let product = "";
  let amount = "";

  // ✅ Buyer (last "to")
  const toParts = input.split(" to ");
  if (toParts.length > 1) {
    buyer = toParts[toParts.length - 1].trim();
  }

  // ✅ Product
  const productMatch = input.match(/export\s(.+?)\sto/i);
  if (productMatch) {
    product = productMatch[1].trim();
  }

  // ✅ Amount (largest number)
  const numbers = input.match(/\d+/g);
  if (numbers) {
    amount = Math.max(...numbers.map(Number)).toString();
  }

  return NextResponse.json({
    buyer,
    product,
    amount,
  });
}