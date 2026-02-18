import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const gasUrl = process.env.GAS_EXEC_URL!;
  const body = await req.json();

  const res = await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateLivingExpense",
      ...body,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
