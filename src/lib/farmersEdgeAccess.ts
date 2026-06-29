import { teamMembers, type VaRoleType } from "@/data/vaOperations";
import { roleHasPermission, type AgencyRole } from "@/data/rolePermissions";
import { currentUser } from "@/lib/currentUser";

const COMMERCIAL_VA_ROLE_TYPES = new Set<VaRoleType>(["brokerage"]);

export function resolveCurrentVaRoleType(): VaRoleType | null {
  const member = teamMembers.find(
    (m) =>
      m.id === currentUser.id ||
      m.name.toLowerCase() === currentUser.name.toLowerCase(),
  );
  return member?.roleType ?? null;
}

/** Eva, licensed producers, ops managers, and commercial VAs only. */
export function canOpenFarmersEdgeIntel(role: AgencyRole): boolean {
  if (role === "owner") return true;
  if (!roleHasPermission(role, "action:open-farmers-edge-intel")) return false;
  if (role === "va") {
    const vaType = resolveCurrentVaRoleType();
    if (!vaType) return true;
    return COMMERCIAL_VA_ROLE_TYPES.has(vaType);
  }
  return true;
}
