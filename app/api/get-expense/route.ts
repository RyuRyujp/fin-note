import { NextResponse } from "next/server";

export async function GET() {
    const gasUrl = process.env.GAS_EXEC_URL;

    if (!gasUrl) {
        return NextResponse.json(
            { ok: false, error: "GAS_EXEC_URL not set" },
            { status: 500 }
        );
    }

    const res = await fetch(gasUrl, { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json(data);
}