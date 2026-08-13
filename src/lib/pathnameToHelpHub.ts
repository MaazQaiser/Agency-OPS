import { resolveHubHelpFromPath, type HubHelpId } from "@/data/contextualHelp";

export function pathnameToHelpHub(pathname: string): HubHelpId {
  return resolveHubHelpFromPath(pathname) ?? "va-operations";
}
