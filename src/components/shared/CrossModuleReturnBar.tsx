"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { parseReturnContext } from "@/lib/crossModuleLinks";

export function CrossModuleReturnBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnContext = parseReturnContext(searchParams);

  if (!returnContext) return null;

  return (
    <nav className="cross-module-return-bar" aria-label="Return navigation">
      <button
        type="button"
        className="training-detail-back cross-module-return-btn"
        onClick={() => router.push(returnContext.href, { scroll: false })}
      >
        <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
        Back to {returnContext.label}
      </button>
    </nav>
  );
}
