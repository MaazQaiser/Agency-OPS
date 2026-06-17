export function fmt(n: number): string {
  return n >= 1000
    ? "$" + (n / 1000).toFixed(1) + "k"
    : "$" + Math.round(n).toLocaleString();
}

export type RoiInputs = {
  spend: number;
  cpl: number;
  closeRate: number;
  prem: number;
  comm: number;
};

export function calcROI({ spend, cpl, closeRate, prem, comm }: RoiInputs) {
  const cr = closeRate / 100;
  const cp = comm / 100;
  const leads = Math.floor(spend / cpl);
  const bound = Math.round(leads * cr);
  const rev = bound * prem;
  const commission = rev * cp;
  const roi = spend > 0 ? Math.round(((commission - spend) / spend) * 100) : 0;
  const upsideBound = Math.round(leads * 0.25);
  const upside = upsideBound * prem * cp;

  return {
    leads,
    bound,
    rev,
    commission,
    roi,
    upside,
    upsideBound,
    sub: `${leads} leads → ${bound} bound at ${Math.round(cr * 100)}% close rate`,
  };
}
