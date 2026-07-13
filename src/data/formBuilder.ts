import type { IntakeFormType } from "./intakeForms";
import type { SupportedLanguage } from "./bilingualClient";
import { supportedLanguages } from "./bilingualClient";

export const formBuilderHeader = {
  title: "New Submission",
  subtitle: "Complete all required fields to start a new submission.",
  quickActions: [
    { id: "rules", label: "View Submission Rules", icon: "clipboard" as const },
  ],
};

export const formBuilderSteps = [
  { id: 1, label: "Business Info" },
  { id: 2, label: "Operations" },
  { id: 3, label: "Coverage" },
  { id: 4, label: "Claims" },
  { id: 5, label: "Documents" },
  { id: 6, label: "Review & Submit" },
] as const;

export type FormBuilderStepId = (typeof formBuilderSteps)[number]["id"];

export const stepContinueLabels: Record<FormBuilderStepId, string> = {
  1: "Continue",
  2: "Next: Coverage Needs",
  3: "Next: Claims History",
  4: "Next: Upload Documents",
  5: "Review Submission",
  6: "Submit Intake",
};

export const commercialCoverageOptions = [
  "General Liability",
  "Workers Comp",
  "Commercial Auto",
  "BOP",
  "Umbrella",
  "EPLI",
  "Cyber",
  "Property",
] as const;

export const personalCoverageOptions = ["Auto", "Home", "Renters", "Life"] as const;

export type CommercialCoverage = (typeof commercialCoverageOptions)[number];
export type PersonalCoverage = (typeof personalCoverageOptions)[number];
export type CoverageOption = CommercialCoverage | PersonalCoverage;

export type DocumentField = {
  id: string;
  label: string;
  required: boolean;
};

export const contractorDocuments: DocumentField[] = [
  { id: "lossRuns", label: "Loss Runs", required: true },
  { id: "coi", label: "COI", required: true },
  { id: "payrollReport", label: "Payroll Report", required: true },
  { id: "safetyProgram", label: "Safety Program", required: false },
];

export const restaurantDocuments: DocumentField[] = [
  { id: "healthPermit", label: "Health Permit", required: true },
  { id: "menu", label: "Menu", required: true },
  { id: "salesReport", label: "Sales Report", required: true },
  { id: "lossRuns", label: "Loss Runs", required: true },
];

export const personalDocuments: DocumentField[] = [
  { id: "decPages", label: "Dec Pages", required: true },
  { id: "driverLicense", label: "Driver License", required: true },
  { id: "vin", label: "VIN", required: true },
  { id: "homeInspection", label: "Home Inspection", required: false },
];

export { supportedLanguages as intakeLanguageOptions };

export function getDocumentFields(formType: IntakeFormType): DocumentField[] {
  if (formType === "restaurants") return restaurantDocuments;
  if (formType === "personal-lines") return personalDocuments;
  return contractorDocuments;
}

export function getCoverageOptions(formType: IntakeFormType): readonly string[] {
  return formType === "personal-lines" ? personalCoverageOptions : commercialCoverageOptions;
}

export function isPersonalForm(formType: IntakeFormType) {
  return formType === "personal-lines";
}

export type YesNo = "yes" | "no" | "";

export type IntakeFormData = {
  // Step 1: identity
  preferredClientLanguage: SupportedLanguage;
  businessName: string;
  dbaName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  yearsInBusiness: string;
  // Step 2: contractors
  typeOfWork: string;
  payroll: string;
  subcontractorUsage: YesNo;
  annualRevenue: string;
  numberOfEmployees: string;
  licenseStatus: string;
  // Step 2: restaurants
  seatingCapacity: string;
  alcoholServed: YesNo;
  delivery: YesNo;
  cookingType: string;
  annualSales: string;
  // Step 2: personal
  propertyType: string;
  vehicles: string;
  drivers: string;
  currentPolicy: string;
  // Step 3
  coverageNeeded: string[];
  // Step 4
  currentCarrier: string;
  expirationDate: string;
  claimsLast5Years: YesNo;
  numberOfClaims: string;
  totalLossAmount: string;
  policyCancellations: YesNo;
  coverageGaps: YesNo;
  // Step 5
  documents: Record<string, boolean>;
  internalNotes: string;
};

function emptyDocuments(formType: IntakeFormType): Record<string, boolean> {
  return Object.fromEntries(getDocumentFields(formType).map((d) => [d.id, false]));
}

export const defaultFormData: IntakeFormData = {
  preferredClientLanguage: "Spanish",
  businessName: "Martinez Landscaping",
  dbaName: "",
  ownerName: "Carlos Martinez",
  email: "info@martinezlandscaping.com",
  phone: "(555) 234-8901",
  address: "1240 Oak Valley Rd, San Jose, CA 95112",
  state: "CA",
  yearsInBusiness: "8",
  typeOfWork: "Landscaping & tree trimming",
  payroll: "420000",
  subcontractorUsage: "yes",
  annualRevenue: "1200000",
  numberOfEmployees: "24",
  licenseStatus: "Active: CA C-27",
  seatingCapacity: "",
  alcoholServed: "",
  delivery: "",
  cookingType: "",
  annualSales: "",
  propertyType: "",
  vehicles: "",
  drivers: "",
  currentPolicy: "",
  coverageNeeded: ["General Liability", "Workers Comp"],
  currentCarrier: "State Farm",
  expirationDate: "2026-08-15",
  claimsLast5Years: "yes",
  numberOfClaims: "1",
  totalLossAmount: "12500",
  policyCancellations: "no",
  coverageGaps: "no",
  documents: emptyDocuments("contractors"),
  internalNotes: "",
};

export const formTypeLabels: Record<IntakeFormType, string> = {
  contractors: "Contractors Intake",
  restaurants: "Restaurants Intake",
  "personal-lines": "Personal Lines Intake",
};

export type FieldError = {
  field: keyof IntakeFormData | string;
  message: string;
  step: FormBuilderStepId;
};

function step1Required(formType: IntakeFormType): (keyof IntakeFormData)[] {
  if (formType === "personal-lines") {
    return ["businessName", "email", "phone", "address", "preferredClientLanguage"];
  }
  return ["businessName", "ownerName", "email", "phone", "address", "state", "yearsInBusiness", "preferredClientLanguage"];
}

function step2Required(formType: IntakeFormType): (keyof IntakeFormData)[] {
  if (formType === "contractors") {
    return ["typeOfWork", "payroll", "subcontractorUsage", "annualRevenue", "numberOfEmployees", "licenseStatus"];
  }
  if (formType === "restaurants") {
    return ["seatingCapacity", "alcoholServed", "delivery", "cookingType", "annualSales"];
  }
  return ["propertyType", "vehicles", "drivers", "currentPolicy"];
}

function step4Required(formType: IntakeFormType): (keyof IntakeFormData)[] {
  void formType;
  return [
    "currentCarrier",
    "expirationDate",
    "claimsLast5Years",
    "policyCancellations",
    "coverageGaps",
  ];
}

export function getFieldErrors(
  data: IntakeFormData,
  formType: IntakeFormType,
  step?: FormBuilderStepId,
): FieldError[] {
  const errors: FieldError[] = [];
  const docs = getDocumentFields(formType);

  const check = (s: FormBuilderStepId) => !step || step === s;

  if (check(1)) {
    step1Required(formType).forEach((field) => {
      const value = data[field];
      if (String(value).trim() === "") {
        errors.push({ field, message: `${fieldLabel(field, formType)} is required`, step: 1 });
      }
    });
  }

  if (check(2)) {
    step2Required(formType).forEach((field) => {
      const value = data[field];
      if (String(value).trim() === "") {
        errors.push({ field, message: `${fieldLabel(field, formType)} is required`, step: 2 });
      }
    });
  }

  if (check(3)) {
    if (data.coverageNeeded.length === 0) {
      errors.push({ field: "coverageNeeded", message: "Select at least one coverage type", step: 3 });
    }
  }

  if (check(4)) {
    step4Required(formType).forEach((field) => {
      const value = data[field];
      if (String(value).trim() === "") {
        errors.push({ field, message: `${fieldLabel(field, formType)} is required`, step: 4 });
      }
    });
    if (data.claimsLast5Years === "yes") {
      if (!data.numberOfClaims.trim()) {
        errors.push({ field: "numberOfClaims", message: "Number of claims is required", step: 4 });
      }
      if (!data.totalLossAmount.trim()) {
        errors.push({ field: "totalLossAmount", message: "Total loss amount is required", step: 4 });
      }
    }
  }

  if (check(5)) {
    docs.forEach((doc) => {
      if (doc.required && !data.documents[doc.id]) {
        errors.push({ field: doc.id, message: `${doc.label} is required`, step: 5 });
      }
    });
  }

  return errors;
}

function fieldLabel(field: keyof IntakeFormData, formType: IntakeFormType): string {
  const labels: Partial<Record<keyof IntakeFormData, string>> = {
    businessName: formType === "personal-lines" ? "Full name" : "Business name",
    ownerName: "Owner name",
    email: "Email",
    phone: "Phone",
    address: formType === "personal-lines" ? "Address" : "Business address",
    state: "State",
    yearsInBusiness: "Years in business",
    preferredClientLanguage: "Preferred client language",
    typeOfWork: "Type of work",
    payroll: "Payroll",
    subcontractorUsage: "Subcontractor usage",
    annualRevenue: "Annual revenue",
    numberOfEmployees: "Number of employees",
    licenseStatus: "License status",
    seatingCapacity: "Seating capacity",
    alcoholServed: "Alcohol served",
    delivery: "Delivery",
    cookingType: "Cooking type",
    annualSales: "Annual sales",
    propertyType: "Property type",
    vehicles: "Vehicles",
    drivers: "Drivers",
    currentPolicy: "Current policy",
    currentCarrier: "Current carrier",
    expirationDate: "Expiration date",
    claimsLast5Years: "Claims in last 5 years",
    numberOfClaims: "Number of claims",
    totalLossAmount: "Total loss amount",
    policyCancellations: "Policy cancellations",
    coverageGaps: "Coverage gaps",
  };
  return labels[field] ?? String(field);
}

export function countTrackedFields(data: IntakeFormData, formType: IntakeFormType) {
  const docs = getDocumentFields(formType);
  const allFields: (keyof IntakeFormData)[] = [
    ...step1Required(formType),
    "dbaName",
    ...step2Required(formType),
    "currentCarrier",
    "expirationDate",
    "claimsLast5Years",
    "policyCancellations",
    "coverageGaps",
  ];

  let completed = 0;
  allFields.forEach((field) => {
    const value = data[field];
    if (Array.isArray(value) ? value.length > 0 : String(value).trim() !== "") {
      completed += 1;
    }
  });

  if (data.coverageNeeded.length > 0) completed += 1;
  if (data.claimsLast5Years === "yes" && data.numberOfClaims.trim()) completed += 1;
  if (data.claimsLast5Years === "yes" && data.totalLossAmount.trim()) completed += 1;

  docs.forEach((doc) => {
    if (data.documents[doc.id]) completed += 1;
  });

  const total = allFields.length + 1 + docs.length + 2;
  const remaining = total - completed;
  const missingRequired = getFieldErrors(data, formType).length;

  return { completed, remaining, missingRequired, total };
}

export function getCompletionPercent(
  data: IntakeFormData,
  formType: IntakeFormType,
  currentStep: FormBuilderStepId,
) {
  const stepWeight = 100 / formBuilderSteps.length;
  let filledSteps = 0;

  for (let step = 1; step <= formBuilderSteps.length; step += 1) {
    const stepId = step as FormBuilderStepId;
    if (stepId < currentStep) {
      filledSteps += 1;
      continue;
    }
    if (stepId > currentStep) break;

    const stepErrors = getFieldErrors(data, formType, stepId);
    let stepFieldCount = 0;
    if (stepId === 1) stepFieldCount = step1Required(formType).length;
    else if (stepId === 2) stepFieldCount = step2Required(formType).length;
    else if (stepId === 3) stepFieldCount = 1;
    else if (stepId === 4) {
      stepFieldCount =
        step4Required(formType).length
        + (data.claimsLast5Years === "yes" ? 2 : 0);
    } else if (stepId === 5) {
      stepFieldCount = getDocumentFields(formType).filter((d) => d.required).length;
    } else if (stepId === 6) {
      const complete = getFieldErrors(data, formType).length === 0;
      return Math.min(100, Math.round((filledSteps + (complete ? 1 : 0)) * stepWeight));
    }

    const stepFilled = Math.max(0, stepFieldCount - stepErrors.length);
    const stepProgress = stepFieldCount > 0 ? stepFilled / stepFieldCount : 0;
    return Math.min(100, Math.round((filledSteps + stepProgress) * stepWeight));
  }

  return Math.min(100, Math.round(filledSteps * stepWeight));
}

export function getStepCompletionSummary(
  data: IntakeFormData,
  formType: IntakeFormType,
  currentStep: FormBuilderStepId,
) {
  const stepMeta = formBuilderSteps.find((step) => step.id === currentStep)!;
  const stepErrors = getFieldErrors(data, formType, currentStep);

  if (currentStep === 6) {
    const allErrors = getFieldErrors(data, formType);
    return {
      stepLabel: stepMeta.label,
      completed: allErrors.length === 0 ? 1 : 0,
      total: 1,
      remaining: allErrors.length,
    };
  }

  let total = 0;
  if (currentStep === 1) total = step1Required(formType).length;
  else if (currentStep === 2) total = step2Required(formType).length;
  else if (currentStep === 3) total = 1;
  else if (currentStep === 4) {
    total =
      step4Required(formType).length
      + (data.claimsLast5Years === "yes" ? 2 : 0);
  } else if (currentStep === 5) {
    total = getDocumentFields(formType).filter((d) => d.required).length;
  }

  const completed = Math.max(0, total - stepErrors.length);
  return {
    stepLabel: stepMeta.label,
    completed,
    total,
    remaining: stepErrors.length,
  };
}

export function getQualityChecksForStep(
  data: IntakeFormData,
  formType: IntakeFormType,
  currentStep: FormBuilderStepId,
) {
  const checks = getQualityChecks(data, formType);
  if (currentStep <= 1) return checks.slice(0, 1);
  if (currentStep === 2) return checks.slice(0, 2);
  if (currentStep === 3) return checks.slice(0, 3);
  return checks;
}

export function getQualityChecks(data: IntakeFormData, formType: IntakeFormType) {
  const docs = getDocumentFields(formType);
  const requiredDocs = docs.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter((d) => data.documents[d.id]).length;

  return [
    {
      label: isPersonalForm(formType) ? "Personal info complete" : "Business info complete",
      ok: getFieldErrors(data, formType, 1).length === 0,
    },
    {
      label: "Operations profile complete",
      ok: getFieldErrors(data, formType, 2).length === 0,
    },
    {
      label: "Coverage selected",
      ok: data.coverageNeeded.length > 0,
    },
    {
      label: "Required documents uploaded",
      ok: uploadedRequired === requiredDocs.length,
    },
  ];
}

export function getSuggestedCoverages(data: IntakeFormData, formType: IntakeFormType): string[] {
  if (formType === "personal-lines") {
    const suggestions: string[] = [];
    if (data.propertyType && !data.coverageNeeded.includes("Home") && !data.coverageNeeded.includes("Renters")) {
      suggestions.push("Home or Renters recommended");
    }
    if (parseInt(data.vehicles, 10) > 0 && !data.coverageNeeded.includes("Auto")) {
      suggestions.push("Auto recommended");
    }
    return suggestions;
  }

  const suggestions: string[] = [];
  const employees = parseInt(data.numberOfEmployees, 10) || 0;
  const payroll = parseInt(data.payroll, 10) || 0;

  if (payroll >= 300000 && !data.coverageNeeded.includes("Umbrella")) {
    suggestions.push("Umbrella recommended");
  }
  if (employees >= 20 && !data.coverageNeeded.includes("EPLI")) {
    suggestions.push("EPLI recommended");
  }
  if (formType === "restaurants" && data.alcoholServed === "yes" && !data.coverageNeeded.includes("General Liability")) {
    suggestions.push("Liquor liability via GL/BOP");
  }
  if (formType === "contractors" && data.subcontractorUsage === "yes" && !data.coverageNeeded.includes("General Liability")) {
    suggestions.push("GL recommended for subcontractor exposure");
  }
  return suggestions;
}

export const routingPreview = ["AgencyZoom", "Slack alert", "Monday board"];

export type SubmissionRulesSection = {
  title: string;
  items: string[];
};

const sharedSubmissionRules: SubmissionRulesSection[] = [
  {
    title: "Required Before Submit",
    items: [
      "All 6 steps must be completed: Business Info, Operations, Coverage, Claims, Documents, and Review.",
      "Every required field marked with * must be filled before advancing or submitting.",
      "At least one coverage type must be selected in Step 3.",
      "All required documents must be uploaded in Step 5.",
      "Review step must show zero validation errors before Submit Intake is enabled.",
    ],
  },
  {
    title: "Claims & Underwriting",
    items: [
      "Current carrier and policy expiration date are required in Step 4.",
      "If claims in the last 5 years is Yes, number of claims and total loss amount are required.",
      "Policy cancellations and coverage gaps must be answered Yes or No.",
      "Incomplete claims history blocks submission until resolved.",
    ],
  },
  {
    title: "Auto-Routing on Submit",
    items: [
      "Successful submissions route to AgencyZoom as the primary CRM record.",
      "A Slack alert is sent to the intake channel for team visibility.",
      "A Monday board item is created in the appropriate pipeline.",
      "Failed routes are queued for retry and flagged in Submission History.",
    ],
  },
];

const formTypeSubmissionRules: Record<IntakeFormType, SubmissionRulesSection[]> = {
  contractors: [
    {
      title: "Contractors: Step Requirements",
      items: [
        "Step 1: Business name, owner name, email, phone, address, state, and years in business.",
        "Step 2: Type of work, payroll, subcontractor usage, annual revenue, employee count, and license status.",
        "Step 3: Select from GL, Workers Comp, Commercial Auto, BOP, Umbrella, EPLI, Cyber, or Property.",
        "Step 4: Prior carrier, expiration, and full claims history.",
        "Step 5: Upload Loss Runs, COI, and Payroll Report (required). Safety Program is optional.",
      ],
    },
    {
      title: "Who Can Submit",
      items: ["Producers, VAs, and intake team members with commercial intake access."],
    },
  ],
  restaurants: [
    {
      title: "Restaurants: Step Requirements",
      items: [
        "Step 1: Business name, owner name, email, phone, address, state, and years in business.",
        "Step 2: Seating capacity, alcohol served, delivery, cooking type, and annual sales.",
        "Step 3: Select from GL, Workers Comp, Commercial Auto, BOP, Umbrella, EPLI, Cyber, or Property.",
        "Step 4: Prior carrier, expiration, and full claims history.",
        "Step 5: Upload Health Permit, Menu, Sales Report, and Loss Runs (all required).",
      ],
    },
    {
      title: "Who Can Submit",
      items: ["Producers, VAs, and intake team members with commercial intake access."],
    },
  ],
  "personal-lines": [
    {
      title: "Personal Lines: Step Requirements",
      items: [
        "Step 1: Full name, email, phone, and address.",
        "Step 2: Property type, number of vehicles, drivers, and current policy details.",
        "Step 3: Select from Auto, Home, Renters, or Life.",
        "Step 4: Prior carrier, expiration, and full claims history.",
        "Step 5: Upload Dec Pages, Driver License, and VIN (required). Home Inspection is optional.",
      ],
    },
    {
      title: "Who Can Submit",
      items: ["Producers, VAs, and CSRs with personal lines intake access."],
    },
  ],
};

export function getSubmissionRules(formType: IntakeFormType): SubmissionRulesSection[] {
  const requiredDocs = getDocumentFields(formType)
    .filter((d) => d.required)
    .map((d) => d.label);

  return [
    ...formTypeSubmissionRules[formType],
    {
      title: "Required Documents",
      items: requiredDocs.map((doc) => `${doc} must be uploaded before submit.`),
    },
    ...sharedSubmissionRules,
  ];
}

export function getFormDataByType(formType: IntakeFormType): IntakeFormData {
  if (formType === "restaurants") {
    return {
      ...defaultFormData,
      businessName: "Green Leaf Café",
      ownerName: "Sarah Chen",
      email: "sarah@greenleafcafe.com",
      phone: "(555) 876-5432",
      address: "450 Market St, San Francisco, CA 94102",
      state: "CA",
      yearsInBusiness: "5",
      typeOfWork: "",
      payroll: "280000",
      subcontractorUsage: "",
      annualRevenue: "",
      numberOfEmployees: "18",
      licenseStatus: "",
      seatingCapacity: "85",
      alcoholServed: "yes",
      delivery: "yes",
      cookingType: "Full kitchen: gas range",
      annualSales: "950000",
      coverageNeeded: ["General Liability", "Workers Comp", "BOP", "Property"],
      documents: {
        healthPermit: true,
        menu: true,
        salesReport: false,
        lossRuns: false,
      },
    };
  }

  if (formType === "personal-lines") {
    return {
      ...defaultFormData,
      businessName: "Maria Rivera",
      dbaName: "",
      ownerName: "",
      email: "maria.rivera@email.com",
      phone: "(512) 555-0198",
      address: "892 Maple St, Austin, TX 78701",
      state: "",
      yearsInBusiness: "",
      typeOfWork: "",
      payroll: "",
      subcontractorUsage: "",
      annualRevenue: "",
      numberOfEmployees: "",
      licenseStatus: "",
      propertyType: "Single-family home",
      vehicles: "2",
      drivers: "2",
      currentPolicy: "State Farm: bundled auto/home",
      coverageNeeded: ["Auto", "Home"],
      currentCarrier: "State Farm",
      expirationDate: "2026-09-01",
      claimsLast5Years: "no",
      numberOfClaims: "",
      totalLossAmount: "",
      policyCancellations: "no",
      coverageGaps: "no",
      documents: {
        decPages: true,
        driverLicense: true,
        vin: false,
        homeInspection: false,
      },
    };
  }

  return {
    ...defaultFormData,
    coverageNeeded: [...defaultFormData.coverageNeeded],
    documents: {
      lossRuns: false,
      coi: true,
      payrollReport: true,
      safetyProgram: false,
    },
  };
}

export function getStep1Title(formType: IntakeFormType) {
  return isPersonalForm(formType) ? "Personal Information" : "Business Information";
}

export function getReviewSections(data: IntakeFormData, formType: IntakeFormType) {
  const docs = getDocumentFields(formType);
  const identityItems: [string, string][] = isPersonalForm(formType)
    ? [
        ["Full Name", data.businessName],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Address", data.address],
      ]
    : [
        ["Business Name", data.businessName],
        ["DBA", data.dbaName || "-"],
        ["Owner Name", data.ownerName],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Address", data.address],
        ["State", data.state],
        ["Years in Business", data.yearsInBusiness],
      ];

  let operationsItems: [string, string][] = [];
  if (formType === "contractors") {
    operationsItems = [
      ["Type of Work", data.typeOfWork],
      ["Payroll", data.payroll],
      ["Subcontractors", data.subcontractorUsage || "-"],
      ["Annual Revenue", data.annualRevenue],
      ["Employees", data.numberOfEmployees],
      ["License Status", data.licenseStatus],
    ];
  } else if (formType === "restaurants") {
    operationsItems = [
      ["Seating Capacity", data.seatingCapacity],
      ["Alcohol Served", data.alcoholServed || "-"],
      ["Delivery", data.delivery || "-"],
      ["Cooking Type", data.cookingType],
      ["Annual Sales", data.annualSales],
    ];
  } else {
    operationsItems = [
      ["Property Type", data.propertyType],
      ["Vehicles", data.vehicles],
      ["Drivers", data.drivers],
      ["Current Policy", data.currentPolicy],
    ];
  }

  return [
    { title: getStep1Title(formType), items: identityItems },
    { title: "Operations / Risk Profile", items: operationsItems },
    { title: "Coverage", items: [["Selected", data.coverageNeeded.join(", ") || "-"]] },
    {
      title: "Claims & Prior Insurance",
      items: [
        ["Current Carrier", data.currentCarrier],
        ["Expiration", data.expirationDate || "-"],
        ["Claims (5 yrs)", data.claimsLast5Years || "-"],
        ["# Claims", data.numberOfClaims || "-"],
        ["Total Loss", data.totalLossAmount || "-"],
        ["Cancellations", data.policyCancellations || "-"],
        ["Coverage Gaps", data.coverageGaps || "-"],
      ],
    },
    {
      title: "Documents",
      items: docs.map((d) => [d.label, data.documents[d.id] ? "Uploaded" : "Missing"] as [string, string]),
    },
  ];
}

export type FieldValidationState = "valid" | "missing" | "incomplete" | "needs_review";

export type StepVisualState = "complete" | "active" | "locked" | "error";

export const stepStatusLabels: Record<StepVisualState, string> = {
  complete: "Complete",
  active: "In Progress",
  locked: "Locked",
  error: "Needs Attention",
};

const fieldValidationMessages: Partial<Record<keyof IntakeFormData | string, string>> = {
  payroll: "Payroll docs missing",
  payrollReport: "Payroll report missing",
  lossRuns: "Loss runs missing",
  drivers: "Driver list incomplete",
  claimsLast5Years: "Claims history missing",
  numberOfClaims: "Claims count missing",
  licenseStatus: "License status needs review",
  coi: "COI document missing",
  decPages: "Dec pages missing",
  businessName: "Business name missing",
  ownerName: "Owner name missing",
  ein: "EIN missing",
};

export function getFieldValidationState(
  field: keyof IntakeFormData | string,
  data: IntakeFormData,
  formType: IntakeFormType,
): { state: FieldValidationState; message: string } {
  const errors = getFieldErrors(data, formType);
  const fieldError = errors.find((e) => e.field === field);

  if (field === "licenseStatus" && data.licenseStatus && data.licenseStatus.toLowerCase().includes("expired")) {
    return { state: "needs_review", message: "License may be expired: verify status" };
  }

  if (fieldError) {
    const message = fieldValidationMessages[field] ?? fieldError.message;
    const state: FieldValidationState =
      String(data[field as keyof IntakeFormData] ?? "").trim() === "" ? "missing" : "incomplete";
    return { state, message };
  }

  const value = data[field as keyof IntakeFormData];
  if (typeof value === "boolean" && value) {
    return { state: "valid", message: "Uploaded" };
  }
  if (String(value ?? "").trim() !== "") {
    return { state: "valid", message: "Valid" };
  }

  return { state: "missing", message: fieldValidationMessages[field] ?? "Required field" };
}

export function getStepMissingCount(
  step: FormBuilderStepId,
  data: IntakeFormData,
  formType: IntakeFormType,
): number {
  return getFieldErrors(data, formType, step).length;
}

export function getStepCompletionPercent(
  step: FormBuilderStepId,
  data: IntakeFormData,
  formType: IntakeFormType,
): number {
  const total = getStepMissingCount(step, data, formType);
  if (step === 1) {
    const required = step1Required(formType).length;
    const filled = step1Required(formType).filter((f) => String(data[f]).trim() !== "").length;
    return Math.round((filled / required) * 100);
  }
  if (step === 2) {
    const required = step2Required(formType).length;
    const filled = step2Required(formType).filter((f) => String(data[f]).trim() !== "").length;
    return Math.round((filled / required) * 100);
  }
  if (step === 3) return data.coverageNeeded.length > 0 ? 100 : 0;
  if (step === 4) {
    const base = step4Required(formType);
    const filled = base.filter((f) => String(data[f]).trim() !== "").length;
    return Math.round((filled / base.length) * 100);
  }
  if (step === 5) {
    const docs = getDocumentFields(formType).filter((d) => d.required);
    const uploaded = docs.filter((d) => data.documents[d.id]).length;
    return docs.length ? Math.round((uploaded / docs.length) * 100) : 100;
  }
  if (step === 6) return total === 0 ? 100 : Math.max(0, 100 - total * 10);
  return 0;
}

export function getStepVisualState(
  step: FormBuilderStepId,
  currentStep: FormBuilderStepId,
  data: IntakeFormData,
  formType: IntakeFormType,
  visitedSteps: Set<FormBuilderStepId>,
): StepVisualState {
  if (step > currentStep && !visitedSteps.has(step)) return "locked";
  if (step === currentStep) {
    const missing = getStepMissingCount(step, data, formType);
    return missing > 0 && visitedSteps.has(step) ? "error" : "active";
  }
  const missing = getStepMissingCount(step, data, formType);
  if (missing > 0 && visitedSteps.has(step)) return "error";
  return step < currentStep ? "complete" : "locked";
}

export type FormFieldGroup = {
  id: string;
  title: string;
  fields: (keyof IntakeFormData)[];
};

export function getStep1FieldGroups(formType: IntakeFormType): FormFieldGroup[] {
  if (formType === "personal-lines") {
    return [
      { id: "contact", title: "Contact Information", fields: ["businessName", "email", "phone", "preferredClientLanguage"] },
      { id: "location", title: "Location Information", fields: ["address"] },
    ];
  }
  return [
    { id: "business", title: "Business Information", fields: ["businessName", "dbaName", "yearsInBusiness", "state"] },
    { id: "owner", title: "Owner Details", fields: ["ownerName"] },
    { id: "contact", title: "Contact Information", fields: ["email", "phone", "preferredClientLanguage"] },
    { id: "location", title: "Location Information", fields: ["address"] },
    { id: "notes", title: "Additional Notes", fields: [] },
  ];
}

export const aiIntakeSuggestions = [
  { id: "extract", label: "Extract uploaded docs", icon: "upload" as const },
  { id: "autofill", label: "Autofill from ACORD", icon: "file-text" as const },
  { id: "duplicate", label: "Check duplicates", icon: "search" as const },
  { id: "coverage", label: "Suggest coverages", icon: "shield" as const },
  { id: "risk", label: "Flag risky submission", icon: "triangle-alert" as const },
  { id: "docs", label: "Recommend missing docs", icon: "folder" as const },
];
