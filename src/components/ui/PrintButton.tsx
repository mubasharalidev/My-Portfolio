"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-5 text-sm font-medium text-void transition-colors hover:bg-lime"
    >
      <Printer className="size-4" aria-hidden /> Save as PDF
    </button>
  );
}
