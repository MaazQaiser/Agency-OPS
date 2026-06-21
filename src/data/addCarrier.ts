import type {
  CarrierRecord,
  CarrierStatus,
  RiskType,
  SubmissionMethod,
} from "./carrierLibrary";

export const addCarrierProductOptions = [
  "BOP",
  "Workers Comp",
  "GL",
  "Commercial Auto",
  "Umbrella",
] as const;

export const addCarrierVerticalOptions = [
  "Contractors",
  "Restaurants",
  "Auto Repair",
  "Retail",
  "Janitorial",
  "Logistics",
];

export const addCarrierStateOptions = ["CA", "TX", "FL", "NY", "WA", "AZ", "NV"];

export const addCarrierProductStatusOptions = ["Open", "Restricted", "Closed"] as const;
export type AddCarrierProductStatus = (typeof addCarrierProductStatusOptions)[number];

export const addCarrierStateStatusOptions = ["Active", "Restricted", "Paused"] as const;
export type AddCarrierStateStatus = (typeof addCarrierStateStatusOptions)[number];

export const standardRequiredDocuments = [
  "Signed App",
  "Loss Runs",
  "Payroll Report",
  "Driver List",
  "Business Description",
] as const;

export type AddCarrierProductRow = {
  id: string;
  productType: string;
  verticalAppetite: string;
  riskType: RiskType;
  status: AddCarrierProductStatus;
};

export type AddCarrierStateRow = {
  state: string;
  status: AddCarrierStateStatus;
};

export type AddCarrierGuidelines = {
  minimumPremium: string;
  maxRevenue: string;
  maxPayroll: string;
  yearsInBusiness: string;
  lossHistoryRules: string;
  excludedRisks: string;
};

export type AddCarrierForm = {
  carrierName: string;
  submissionMethod: SubmissionMethod | "";
  mgaContactName: string;
  email: string;
  phone: string;
  responseSlaDays: string;
  products: AddCarrierProductRow[];
  states: AddCarrierStateRow[];
  guidelines: AddCarrierGuidelines;
  requiredDocuments: string[];
  customDocument: string;
};

export function createEmptyProductRow(): AddCarrierProductRow {
  return {
    id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productType: "",
    verticalAppetite: "",
    riskType: "Standard",
    status: "Open",
  };
}

export const emptyAddCarrierForm: AddCarrierForm = {
  carrierName: "",
  submissionMethod: "",
  mgaContactName: "",
  email: "",
  phone: "",
  responseSlaDays: "",
  products: [createEmptyProductRow()],
  states: [],
  guidelines: {
    minimumPremium: "",
    maxRevenue: "",
    maxPayroll: "",
    yearsInBusiness: "",
    lossHistoryRules: "",
    excludedRisks: "",
  },
  requiredDocuments: [],
  customDocument: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapProductStatusToCarrierStatus(status: AddCarrierProductStatus): CarrierStatus {
  if (status === "Open") return "Open Appetite";
  if (status === "Restricted") return "Restricted";
  return "Paused";
}

export function validateAddCarrierForm(
  form: AddCarrierForm,
  options: { draft?: boolean } = {},
): { ok: boolean; error?: string } {
  if (options.draft) return { ok: true };

  if (!form.carrierName.trim()) return { ok: false, error: "Carrier name is required." };
  if (!form.submissionMethod) return { ok: false, error: "Submission method is required." };
  if (!form.mgaContactName.trim()) return { ok: false, error: "MGA contact name is required." };
  if (!form.email.trim()) return { ok: false, error: "Email is required." };
  if (!form.responseSlaDays.trim()) return { ok: false, error: "Response SLA is required." };

  const validProducts = form.products.filter((row) => row.productType && row.verticalAppetite);
  if (validProducts.length === 0) {
    return { ok: false, error: "Add at least one product with type and vertical." };
  }

  if (form.states.length === 0) {
    return { ok: false, error: "Select at least one state." };
  }

  return { ok: true };
}

export function buildCarrierRecordsFromForm(form: AddCarrierForm): CarrierRecord[] {
  const carrierSlug = slugify(form.carrierName) || "carrier";
  const statesLabel = form.states.map((row) => row.state).join(", ");
  const statesList = form.states.map((row) => row.state);
  const allDocs = [...form.requiredDocuments];
  const trimmedCustom = form.customDocument.trim();
  if (trimmedCustom && !allDocs.includes(trimmedCustom)) {
    allDocs.push(trimmedCustom);
  }

  const products = form.products.filter((row) => row.productType && row.verticalAppetite);
  const uniqueProducts = [...new Set(products.map((row) => row.productType))];
  const uniqueVerticals = [...new Set(products.map((row) => row.verticalAppetite))];
  const responseTime = `${form.responseSlaDays} day${form.responseSlaDays === "1" ? "" : "s"}`;

  return products.map((product, index) => {
    const productSlug = slugify(product.productType) || `product-${index}`;
    const id = `car-${carrierSlug}-${productSlug}-${Date.now()}-${index}`;

    return {
      id,
      name: form.carrierName.trim(),
      product: product.productType,
      verticalAppetite: product.verticalAppetite,
      states: statesLabel,
      riskType: product.riskType,
      submissionMethod: form.submissionMethod as SubmissionMethod,
      mgaContact: form.mgaContactName.trim(),
      responseTime,
      status: mapProductStatusToCarrierStatus(product.status),
      admitted: "Admitted" as const,
      drawer: {
        summary: `${form.carrierName.trim()} ${product.productType} appetite for ${product.verticalAppetite}.`,
        products: uniqueProducts,
        statesList,
        verticals: uniqueVerticals,
        submissionRequirements: allDocs.length > 0 ? allDocs : ["Signed application"],
        mgaEmail: form.email.trim(),
        mgaPhone: form.phone.trim(),
        brokerNotes: [],
        recentChanges: ["Carrier added to library"],
      },
    };
  });
}
