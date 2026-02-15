// app/list/page.tsx
import { Suspense } from "react";
import ListPageClient from "./ListPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
      <ListPageClient />
    </Suspense>
  );
}
