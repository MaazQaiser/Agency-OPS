import type { RetentionKpi } from "@/types";
import {
  agencyZoomPipelines,
  cancellationSaveEligibility,
  cancellationSaveTypes,
  combinedExecutiveTable,
  crossSellPoints,
  ecosystemNewBusiness,
  ecosystemRetention,
  futureRoadmap,
  retentionBonusTiers,
  retentionHeader,
  retentionTabs,
  systemOwnership,
  tracieKpis,
  valerieKpis,
  valerieTracieTitles,
} from "@/data/retentionScorecard";

export type RetentionLocale = "en" | "kr";

export const RETENTION_LOCALE_STORAGE_KEY = "agency-ops-retention-locale";

const kpiFieldCopy: Record<
  string,
  { label: Record<RetentionLocale, string>; sub: Record<RetentionLocale, string> }
> = {
  "Retention %": {
    label: { en: "Retention %", kr: "유지율" },
    sub: { en: "Goal: 93%+ (Tier 2)", kr: "목표: 93%+ (티어 2)" },
  },
  "PIF (Policies in Force)": {
    label: { en: "PIF (Policies in Force)", kr: "PIF (유효 계약)" },
    sub: { en: "Month-over-month trend", kr: "전월 대비 추세" },
  },
  "PIF (Korean Dept)": {
    label: { en: "PIF (Korean Dept)", kr: "PIF (한국어 부서)" },
    sub: { en: "Month-over-month trend", kr: "전월 대비 추세" },
  },
  "Cancellation Saves": {
    label: { en: "Cancellation Saves", kr: "해지 방어" },
    sub: { en: "60-day hold verified", kr: "60일 유지 확인" },
  },
  "Cross-Sell Points": {
    label: { en: "Cross-Sell Points", kr: "교차판매 포인트" },
    sub: { en: "Goal: 100/month", kr: "목표: 월 100점" },
  },
  "ACRs Completed": {
    label: { en: "ACRs Completed", kr: "ACR 완료" },
    sub: { en: "Annual Coverage Reviews", kr: "연간 보장 검토" },
  },
  "Life Referrals": {
    label: { en: "Life Referrals", kr: "생명보험 추천" },
    sub: { en: "Sent to Sarah this month", kr: "이번 달 Sarah 전달" },
  },
};

function localizeKpis(kpis: RetentionKpi[], locale: RetentionLocale): RetentionKpi[] {
  return kpis.map((kpi) => {
    const copy = kpiFieldCopy[kpi.label];
    if (!copy) return kpi;
    return {
      ...kpi,
      label: copy.label[locale],
      sub: copy.sub[locale],
    };
  });
}

const combinedKpiLabels: Record<string, Record<RetentionLocale, string>> = {
  "Retention %": { en: "Retention %", kr: "유지율" },
  PIF: { en: "PIF", kr: "PIF" },
  "Cancellation Saves": { en: "Cancellation Saves", kr: "해지 방어" },
  "Cross-Sell Points": { en: "Cross-Sell Points", kr: "교차판매 포인트" },
  ACRs: { en: "ACRs", kr: "ACR" },
  "Life Referrals to Sarah": { en: "Life Referrals to Sarah", kr: "Sarah 생명보험 추천" },
  "Commercial Referral Opps": { en: "Commercial Referral Opps", kr: "상업 추천 기회" },
};

export function getRetentionCopy(locale: RetentionLocale) {
  const isKr = locale === "kr";

  return {
    locale,
    department: isKr ? "tracie" : "valerie" as const,
    departmentName: isKr ? "Tracie — Korean Dept" : "Valerie — English Dept",
    pageTitle: isKr ? "유지 점수표" : "Retention Scorecard",
    pageTitleEmphasis: isKr ? "점수표" : "Scorecard",
    sectionArchitecture: isKr
      ? "핵심 아키텍처 — 두 개의 별도 보상 생태계"
      : "Core Architecture Decision — Two Separate Compensation Ecosystems",
    sectionScorecard: isKr
      ? "유지 KPI 점수표 — 부서당 최대 6개 KPI (Eva 규칙)"
      : "Retention KPI Scorecard — Max 6 Core KPIs Per Department (Eva's Rule)",
    scorecardHeader: isKr ? "유지 KPI 점수표" : "Retention KPI Scorecard",
    tabs: [
      {
        id: "valerie",
        label: isKr ? "발레리 — 영어 부서" : retentionTabs[0].label,
      },
      {
        id: "tracie",
        label: isKr ? "트레이시 — 한국어 부서" : retentionTabs[1].label,
      },
      {
        id: "combined",
        label: isKr ? "Eva 경영진 뷰" : retentionTabs[2].label,
      },
    ],
    valerieKpis: localizeKpis(valerieKpis, locale),
    tracieKpis: localizeKpis(tracieKpis, locale).map((kpi, index) => {
      const original = tracieKpis[index];
      if (original.label === "Retention %") {
        return {
          ...kpi,
          sub:
            locale === "kr"
              ? "목표: 93%+ (현재 티어 1)"
              : "Goal: 93%+ (currently Tier 1)",
        };
      }
      return kpi;
    }),
    valerieFootnote: isKr
      ? "Kyle의 Google Sheets 유지 탭에서 데이터를 가져옵니다. Folio 기간 기준 — 달력 월이 아닙니다."
      : "Data populates from Kyle's Google Sheets retention tab. Folio period dates — not calendar month.",
    tracieFootnote: isKr
      ? "한국어 부서 전용. 트레이시 갱신은 발레리에게 라우팅되지 않습니다. 별도 보드, 별도 점수표."
      : "Korean dept only. Tracie's renewals never route to Valerie. Separate board, separate scorecard.",
    combinedTable: {
      headers: isKr
        ? ["KPI", "발레리 (영어)", "트레이시 (한국어)", "합계", "목표"]
        : ["KPI", "Valerie (English)", "Tracie (Korean)", "Combined", "Goal"],
      rows: combinedExecutiveTable.map((row) => ({
        ...row,
        kpi: combinedKpiLabels[row.kpi]?.[locale] ?? row.kpi,
      })),
    },
    ecosystemNewBusiness: {
      title: isKr ? "생태계 1 — 신규 영업" : ecosystemNewBusiness.title,
      items: isKr
        ? [
            "Sarah — 개인보험 + 생명",
            "Jazmín — 상업 SDR (웜 전환만)",
            "Pedro Torres — 상업 후속 (시범)",
            "Zahra Gul — Farmers 신규 (시범)",
          ]
        : ecosystemNewBusiness.items,
      footer: isKr
        ? "측정: 보험료 생산, 체결률, 계약 체결, 가구 개설."
        : ecosystemNewBusiness.footer,
    },
    ecosystemRetention: {
      title: isKr ? "생태계 2 — 유지 / 계정 관리" : ecosystemRetention.title,
      items: isKr
        ? ["발레리 — 영어 유지 + 교차판매 부서", "트레이시 — 한국어 유지 + 교차판매 부서"]
        : ecosystemRetention.items,
      footer: isKr
        ? "측정: 유지율, PIF, 가구 유지, 해지 방어, 교차판매 포인트, Prime Agency 기여. 보험료 생산만이 아님."
        : ecosystemRetention.footer,
    },
    valerieTracieTitles: {
      title: isKr ? "Agency OS에서 발레리 + 트레이시 직함" : valerieTracieTitles.title,
      items: isKr
        ? ["계정 매니저", "유지 전문가", "가구 보호 어드바이저", "교차판매 기회 매니저"]
        : valerieTracieTitles.items,
      footer: isKr
        ? "서비스 전용 역할이 아닙니다. KPI 책임과 성과 보상이 있는 이익 보호 + 성장 가속 포지션입니다."
        : valerieTracieTitles.footer,
    },
    compensation: {
      section: isKr ? "보상 구조 — 유지 생태계" : "Compensation Structure — Retention Ecosystem",
      formulaTitle: isKr ? "보상 공식" : "Compensation Formula",
      formulaBody: isKr
        ? "기본 시급 + 유지 점수 보너스 + 교차판매 포인트 보너스 + 해지 방어 보너스 + Prime Agency 정렬 보너스 + 대리점 성과 보너스"
        : "Base Hourly + Retention Score Bonus + Cross-Sell Point Bonus + Cancellation Save Bonus + Prime Agency Alignment Bonus + Agency Achievement Bonus",
      formulaSub: isKr
        ? "수수료 중심이 아님. 안정성 우선. 성과 보너스는 보존과 성장에 보상 — 생산량만이 아님."
        : "Not commission-heavy. Stability first. Performance bonuses reward preservation and growth — not production volume alone.",
      tierTitle: isKr ? "유지 점수 보너스 — 월간 티어" : "Retention Score Bonus — Monthly Tiers",
      tierSub: isKr
        ? "Folio 기간 기준 월간 측정. 유지 보험료 + 가구 유지 + 해지 방지 + 재작성 방지 + PIF 보존."
        : "Measured monthly on folio period dates. Uses retained premium + household retention + cancellation prevention + rewrite prevention + PIF preservation. Not raw policy count alone.",
      crossSellTitle: isKr ? "교차판매 포인트 시스템" : "Cross-Sell Point System",
      crossSellHeaders: isKr ? ["활동", "포인트", "비고"] : ["Activity", "Points", "Notes"],
      saveTitle: isKr ? "해지 방어 보너스 규칙" : "Cancellation Save Bonus Rules",
      saveEligibilityTitle: isKr ? "방어 보너스 자격 — 4가지 조건 모두 필요" : "Save Bonus Eligibility — All 4 Conditions Required",
      saveHeaders: isKr ? ["방어 유형", "가중치", "비고"] : ["Save Type", "Weighted Value", "Notes"],
    },
    agencyZoom: {
      section: isKr
        ? "AgencyZoom 파이프라인 — 유지 레이어 (Arminda 데이터 입력)"
        : "AgencyZoom Pipelines — Retention Layer (Arminda Manages Data Entry)",
      alertTitle: isKr ? "Arminda 역할 명확화" : "Arminda's Role Clarification",
      alertBody: isKr
        ? "Arminda Sumido는 CERT + AgencyZoom 데이터 입력만 담당합니다. 파이프라인 설계나 운영 워크플로 소유권은 없습니다."
        : "Arminda Sumido is confirmed as CERT + AgencyZoom data entry only. She does not own pipeline setup or operational workflows.",
      headers: isKr
        ? ["파이프라인", "소유자 (AZ)", "Kyle 자동화", "Monday 보드"]
        : ["Pipeline", "Owner (AZ)", "Kyle Automation", "Monday Board Owner"],
      pipelines: agencyZoomPipelines,
    },
    systemOwnership: {
      section: isKr ? "시스템 소유권 — 유지 레이어" : "System Ownership — Retention Layer",
      title: isKr ? "누가 무엇을 구축 — 유지 모듈" : "Who Builds What — Retention Module",
      headers: isKr ? ["시스템", "구축자", "구축 내용"] : ["System", "Who Builds", "What They Build"],
      rows: systemOwnership,
    },
    futureRoadmap: {
      section: isKr ? "향후 Agency OS 기능 — 유지 레이어 (3단계+)" : "Future Agency OS Features — Retention Layer (Phase 3+)",
      title: isKr ? "향후 개발 — 유지 인텔리전스" : "Future Development — Retention Intelligence",
      headers: isKr ? ["기능", "설명", "단계"] : ["Feature", "What It Does", "Phase"],
      rows: futureRoadmap,
    },
    bonusTiers: retentionBonusTiers,
    crossSellPoints,
    cancellationSaveEligibility: isKr
      ? [
          "방어 후 60일 이상 계약 유지",
          "해당 기간 보험료 정상 수납",
          "AgencyZoom 메모에 방어 기록",
          "재작성 조작 없음 — 진정한 방어만",
        ]
      : cancellationSaveEligibility,
    cancellationSaveTypes,
    footer: retentionHeader.footer,
    patent: retentionHeader.patent,
  };
}

export type RetentionCopy = ReturnType<typeof getRetentionCopy>;
