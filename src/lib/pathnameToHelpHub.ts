import type { HubHelpId } from "@/data/contextualHelp";

export function pathnameToHelpHub(pathname: string): HubHelpId {
  if (pathname.startsWith("/commercial-hub") || pathname.startsWith("/commercial")) return "commercial-hub";
  if (pathname.startsWith("/send-center")) return "send-center";
  if (pathname.startsWith("/retention") || pathname.startsWith("/prime-agency")) return "retention";
  if (pathname.startsWith("/carrier-library")) return "carrier-library";
  if (pathname.startsWith("/training-hub")) return "training-hub";
  if (pathname.startsWith("/epay-policy")) return "epay-policy";
  if (pathname.startsWith("/global-search")) return "global-search";
  return "va-operations";
}
