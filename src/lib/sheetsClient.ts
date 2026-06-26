/* ─────────────────────────────────────────────────────────────────────────────
   Google Sheets API Client — Agency OS
   Reads sheet data using the Sheets API v4 (read-only service account).
   Env vars required:
     GOOGLE_SHEETS_ID        — the spreadsheet ID (from the URL)
     GOOGLE_SERVICE_ACCOUNT  — JSON string of the service account credentials
   Falls back to null when not configured (static data used instead).
───────────────────────────────────────────────────────────────────────────── */

export type SheetCell = string | number | boolean | null;
export type SheetRow = SheetCell[];
export type SheetData = SheetRow[];

/** Read a named range from a Google Sheet. Returns null when not configured. */
export async function readSheetRange(range: string): Promise<SheetData | null> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT;

  if (!spreadsheetId || !serviceAccountJson) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson) as {
      client_email: string;
      private_key: string;
    };

    const token = await getServiceAccountToken(serviceAccount.client_email, serviceAccount.private_key);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 }, // 5-minute ISR cache
    });

    if (!res.ok) {
      console.error("[sheetsClient] Sheets API error:", res.status, await res.text());
      return null;
    }

    const json = (await res.json()) as { values?: SheetRow[] };
    return json.values ?? [];
  } catch (err) {
    console.error("[sheetsClient] Failed to read sheet range:", range, err);
    return null;
  }
}

async function getServiceAccountToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;
  const scope = "https://www.googleapis.com/auth/spreadsheets.readonly";

  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      iss: clientEmail,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      exp: expiry,
      iat: now,
    }),
  );

  const signingInput = `${header}.${payload}`;

  const keyData = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----\n?/, "")
    .replace(/\n?-----END PRIVATE KEY-----\n?/, "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`[sheetsClient] Token exchange failed: ${tokenRes.status}`);
  }

  const tokenJson = (await tokenRes.json()) as { access_token: string };
  return tokenJson.access_token;
}
