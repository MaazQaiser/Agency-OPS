export const columnMap = [
  { col: "A", name: "Submission ID" },
  { col: "B", name: "Client Name" },
  { col: "C", name: "Assigned Producer" },
  { col: "D", name: "Assigned VA" },
  { col: "E", name: "LOB" },
  { col: "F", name: "Submission Date" },
  { col: "G", name: "Markets Submitted #" },
  { col: "H", name: "Quotes Received #" },
  { col: "I", name: "Declines #" },
  { col: "J", name: "Carrier Quoted" },
  { col: "K", name: "Premium" },
  { col: "L", name: "Follow-Up Date" },
  { col: "M", name: "Days Open" },
  { col: "N", name: "Status" },
  { col: "O", name: "Missing Docs" },
  { col: "P", name: "UW Contact" },
  { col: "Q", name: "Notes" },
  { col: "R", name: "Binding Outcome" },
  { col: "S", name: "Last Updated" },
  { col: "T", name: "Overdue Flag (auto)" },
  { col: "U", name: "Market Flag (auto)" },
];

export const formulas = [
  { label: "M — Days Open", code: '=IF(N2="Bound","—",IF(F2="","",TODAY()-F2))' },
  { label: "T — Overdue Flag", code: '=IF(AND(N2<>"Bound",N2<>"Declined",S2<>"",TODAY()-S2>2),"OVERDUE","")' },
  { label: "U — Market Flag", code: '=IF(AND(G2<3,N2<>"Declined",N2<>"Bound"),"<3 MARKETS","")' },
  { label: "A — Sub ID", code: '=IF(B2="","","CS-"&TEXT(ROW()-1,"000"))' },
  { label: "Quote Rate (KPI)", code: '=IFERROR(COUNTIF(H2:H100,">0")/COUNTA(B2:B100),0)' },
  { label: "Avg Days Open (KPI)", code: '=IFERROR(AVERAGEIF(N2:N100,"<>Bound",M2:M100),0)' },
  { label: "Pipeline Premium", code: '=SUMIF(N2:N100,"Quoted",K2:K100)' },
  { label: "Overdue Count", code: '=COUNTIF(T2:T100,"OVERDUE")' },
  { label: "Follow-Up Today", code: "=COUNTIF(L2:L100,TODAY())" },
  { label: "Bind Rate", code: '=IFERROR(COUNTIF(N2:N100,"Bound")/COUNTIF(N2:N100,"Quoted"),0)' },
];

export const conditionalFormatting = [
  { label: "Green row", color: "green", code: '=$N2="Quoted"\nColor: #1E4D2B bg, #2ECC71 text' },
  { label: "Green row", color: "green", code: '=$N2="Bound"\nColor: #1A3D1A bg, #27AE60 text' },
  { label: "Yellow row", color: "yellow", code: "=$L2=TODAY()\nColor: #3D3500 bg, #F1C40F text" },
  { label: "Red row", color: "red", code: '=$T2="OVERDUE"\nColor: #3D0B0B bg, #E74C3C text' },
  { label: "Gray row", color: "gray", code: '=$N2="Declined"\nColor: #1A1A1A bg, #6C7A89 text' },
  { label: "Red cell G", color: "red", code: '=$U2="<3 MARKETS" (apply to col G only)\nColor: #E74C3C bg, #FFFFFF text' },
];

export const appsScript = `// =====================================================
// Insurance Town — Commercial Tracker Automation v1.0
// Paste in Tools > Apps Script > Save > Set Triggers
// =====================================================

const SHEET_NAME = 'Submissions';
const NOTIFY_EMAIL = 'eva@insurancetownagency.com';
const MIN_MARKETS = 3;

// ---- Auto-stamp Last Updated when row is edited ----
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  const row = e.range.getRow();
  const col = e.range.getColumn();
  if (row < 2) return;
  // Col S = 19 (Last Updated) — stamp on any edit
  sheet.getRange(row, 19).setValue(new Date());
}

// ---- Daily Morning Digest Email to Eva ----
function dailyDigest() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  today.setHours(0,0,0,0);

  let overdueRows = [];
  let followUpToday = [];
  let marketViolations = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const client = row[1]; // Col B
    const va = row[3];     // Col D
    const markets = row[6]; // Col G
    const followUp = new Date(row[11]); // Col L
    const status = row[13]; // Col N
    const lastUpdated = new Date(row[18]); // Col S

    if (!client) continue;

    // Overdue check: >2 days no update, not Bound/Declined
    if (status !== 'Bound' && status !== 'Declined') {
      const daysSince = (today - lastUpdated) / (1000*60*60*24);
      if (daysSince > 2) overdueRows.push(\`\${client} (\${va})\`);
    }

    // Follow-up due today
    followUp.setHours(0,0,0,0);
    if (followUp.getTime() === today.getTime()) {
      followUpToday.push(\`\${client} (\${va})\`);
    }

    // Market minimum check
    if (markets < MIN_MARKETS && status !== 'Declined' && status !== 'Bound') {
      marketViolations.push(\`\${client} — \${markets} markets (\${va})\`);
    }
  }

  // Build email
  let body = \`INSURANCE TOWN — DAILY COMMERCIAL DIGEST\\n\`;
  body += \`\${today.toDateString()}\\n\\n\`;

  if (overdueRows.length > 0) {
    body += \`⛔ OVERDUE (48h+ no update):\\n\`;
    overdueRows.forEach(r => body += \`  - \${r}\\n\`);
    body += \`\\n\`;
  }
  if (followUpToday.length > 0) {
    body += \`🟡 FOLLOW-UP DUE TODAY:\\n\`;
    followUpToday.forEach(r => body += \`  - \${r}\\n\`);
    body += \`\\n\`;
  }
  if (marketViolations.length > 0) {
    body += \`⚠️  MARKET MINIMUM VIOLATIONS (<3 markets):\\n\`;
    marketViolations.forEach(r => body += \`  - \${r}\\n\`);
    body += \`\\n\`;
  }

  if (overdueRows.length === 0 && followUpToday.length === 0 && marketViolations.length === 0) {
    body += \`✅ All clear — no flags today.\\n\`;
  }

  body += \`\\nView full tracker: \${ss.getUrl()}\`;

  GmailApp.sendEmail(NOTIFY_EMAIL, \`[InsuranceTown] Daily Commercial Digest — \${today.toDateString()}\`, body);
}

// ---- Weekly Productivity Summary ----
function weeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  const weekAgo = new Date(today - 7*24*60*60*1000);

  let vaStats = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const va = row[3];
    const subDate = new Date(row[5]);
    if (!va || subDate < weekAgo) continue;
    if (!vaStats[va]) vaStats[va] = { subs: 0, markets: 0, quotes: 0, binds: 0 };
    vaStats[va].subs++;
    vaStats[va].markets += (row[6] || 0);
    vaStats[va].quotes += (row[7] || 0);
    if (row[13] === 'Bound') vaStats[va].binds++;
  }

  let body = \`INSURANCE TOWN — WEEKLY VA PRODUCTIVITY REPORT\\n\\n\`;
  Object.keys(vaStats).forEach(va => {
    const s = vaStats[va];
    body += \`\${va}: \${s.subs} subs | \${s.markets} markets | \${s.quotes} quotes | \${s.binds} binds\\n\`;
  });
  body += \`\\nView: \${ss.getUrl()}\`;
  GmailApp.sendEmail(NOTIFY_EMAIL, \`[InsuranceTown] Weekly VA Report\`, body);
}`;

export const triggerSetup = `Trigger Setup: Apps Script → Triggers (clock icon) → Add Trigger
• dailyDigest → Time-driven → Day timer → 8:00–9:00am
• weeklyReport → Time-driven → Week timer → Monday → 8:00am
• onEdit → From spreadsheet → On edit`;
