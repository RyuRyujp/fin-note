import { NextResponse } from "next/server";

type AddExpenseInput = {
  date: string;
  detail: string;
  amount: number;
  category: string;
  memo: string;
  payment: string;
};

type GasOk =
  | { ok: true; recordId: string }
  | { ok: true; id: string }
  | { ok: true; expense: { id: string } & AddExpenseInput };

type GasNg = { ok: false; error?: string };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function POST(req: Request) {
  const gasUrl = process.env.GAS_EXEC_URL;
  if (!gasUrl) {
    return NextResponse.json({ ok: false, error: "No GAS URL" }, { status: 500 });
  }

  const body = (await req.json()) as AddExpenseInput;

  const res = await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addRecord", ...body }),
  });

  const text = await res.text();

  let dataUnknown: unknown;
  try {
    dataUnknown = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, error: "GAS returned non-JSON", raw: text.slice(0, 300) },
      { status: 502 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "GAS request failed", gas: dataUnknown },
      { status: 502 }
    );
  }

  if (!isObject(dataUnknown)) {
    return NextResponse.json({ ok: false, error: "Invalid GAS response" }, { status: 502 });
  }

  const data = dataUnknown as GasOk | GasNg;

  if ("ok" in data && data.ok === true) {
    // GASが expense を返すならそれを優先
    if ("expense" in data && isObject(data.expense) && typeof data.expense.id === "string") {
      return NextResponse.json({ ok: true, expense: data.expense });
    }

    // recordId / id を返す場合は body と合成して expense を作る
    const id =
      "recordId" in data && typeof data.recordId === "string"
        ? data.recordId
        : "id" in data && typeof data.id === "string"
          ? data.id
          : "";

    if (id) {
      return NextResponse.json({ ok: true, expense: { id, ...body } });
    }

    // 成功なのにIDが無い（特殊）
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, gas: dataUnknown }, { status: 502 });
}
