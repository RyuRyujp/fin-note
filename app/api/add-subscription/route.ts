import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const gasUrl = process.env.GAS_EXEC_URL;

    if (!gasUrl) {
        return NextResponse.json({ ok: false, error: "No GAS URL" }, { status: 500 });
    }

    const body = await req.json();

    const res = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "addSubscription",
            ...body,
        }),
    });

    const data = await res.json();
    return NextResponse.json(data);
}