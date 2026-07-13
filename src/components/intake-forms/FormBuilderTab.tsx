"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  formBuilderHeader,
  formBuilderSteps,
  formTypeLabels,
  getCompletionPercent,
  getCoverageOptions,
  getDocumentFields,
  getFieldErrors,
  getFieldValidationState,
  getFormDataByType,
  getReviewSections,
  getStep1Title,
  getStepCompletionPercent,
  getStepMissingCount,
  getStepVisualState,
  getSuggestedCoverages,
  intakeLanguageOptions,
  isPersonalForm,
  routingPreview,
  stepContinueLabels,
  stepStatusLabels,
  type FormBuilderStepId,
  type FieldValidationState,
  type IntakeFormData,
} from "@/data/formBuilder";
import { getIntakeStep1Label } from "@/data/bilingualClient";
import type { IntakeFormType } from "@/data/intakeForms";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { FormSkeleton } from "@/components/shared/loading";
import { UploadProgressBar, type UploadPhase } from "@/components/shared/loading/UploadProgressBar";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { toastMessages } from "@/lib/toastMessages";
import { FormReviewDrawer } from "./FormReviewDrawer";
import { SubmissionRulesDrawer } from "./SubmissionRulesDrawer";
import { IntakeFormSection } from "./IntakeFormSection";
import { IntakeAiAssistant } from "./IntakeAiAssistant";

const US_STATES = ["CA", "TX", "NY", "WA", "FL", "AZ", "NV", "CO", "IL", "GA"];

function resolveFormType(param: string | null): IntakeFormType {
  if (param === "restaurants" || param === "personal-lines" || param === "contractors") {
    return param;
  }
  return "contractors";
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  validationState?: FieldValidationState;
  validationMessage?: string;
  children: React.ReactNode;
  className?: string;
};

const validationStateClass: Record<FieldValidationState, string> = {
  valid: "intake-field-status--valid",
  missing: "intake-field-status--missing",
  incomplete: "intake-field-status--incomplete",
  needs_review: "intake-field-status--review",
};

const validationStateLabel: Record<FieldValidationState, string> = {
  valid: "Valid",
  missing: "Missing",
  incomplete: "Incomplete",
  needs_review: "Needs review",
};

function FormField({
  label,
  required,
  error,
  validationState,
  validationMessage,
  children,
  className,
}: FormFieldProps) {
  return (
    <label className={cn("intake-form-field", className)}>
      <span className="intake-form-label-row">
        <span className="intake-form-label">
          {label}
          {required && <span className="intake-form-required"> *</span>}
        </span>
        {validationState && (
          <span className={cn("intake-field-status", validationStateClass[validationState])}>
            {validationMessage ?? validationStateLabel[validationState]}
          </span>
        )}
      </span>
      {children}
      {error && <span className="intake-form-error">{error}</span>}
    </label>
  );
}

function YesNoGroup({
  label,
  name,
  value,
  onChange,
  error,
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (val: "yes" | "no") => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <fieldset className="intake-form-field intake-form-yesno">
      <legend className="intake-form-label">
        {label}
        {required && <span className="intake-form-required"> *</span>}
      </legend>
      <div className="intake-form-yesno-options">
        {(["yes", "no"] as const).map((opt) => (
          <label key={opt} className="intake-form-radio">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
      {error && <span className="intake-form-error">{error}</span>}
    </fieldset>
  );
}

function errorFor(errors: ReturnType<typeof getFieldErrors>, field: string) {
  return errors.find((e) => e.field === field)?.message;
}

export function FormBuilderTab() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const formType = resolveFormType(searchParams.get("form"));
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => formType,
    deps: [formType],
    isEmpty: () => false,
    errorPreset: "supabase-timeout",
  });

  const [currentStep, setCurrentStep] = useState<FormBuilderStepId>(1);
  const [data, setData] = useState<IntakeFormData>(() => getFormDataByType(formType));
  const [touched, setTouched] = useState<FormBuilderStepId | null>(null);
  const [visitedSteps, setVisitedSteps] = useState<Set<FormBuilderStepId>>(() => new Set([1]));
  const [lastAutosaved, setLastAutosaved] = useState("2m ago");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [uploadState, setUploadState] = useState<{
    docId: string;
    fileName: string;
    progress: number;
    phase: UploadPhase;
  } | null>(null);

  useEffect(() => {
    setData(getFormDataByType(formType));
    setCurrentStep(1);
    setTouched(null);
    setVisitedSteps(new Set([1]));
  }, [formType]);

  useEffect(() => {
    const timer = window.setInterval(() => setLastAutosaved("Just now"), 120_000);
    return () => window.clearInterval(timer);
  }, [data]);

  useSyncBreadcrumbDetail(`Step ${currentStep}`, {
    paramKey: "step",
    paramValue: String(currentStep),
  });

  const documentFields = useMemo(() => getDocumentFields(formType), [formType]);
  const coverageOptions = useMemo(() => getCoverageOptions(formType), [formType]);
  const personal = isPersonalForm(formType);

  const stepErrors = useMemo(
    () => getFieldErrors(data, formType, currentStep),
    [data, formType, currentStep],
  );
  const allErrors = useMemo(() => getFieldErrors(data, formType), [data, formType]);
  const showErrors = touched === currentStep;
  const completion = getCompletionPercent(data, formType, currentStep);
  const suggestions = currentStep >= 3 ? getSuggestedCoverages(data, formType) : [];
  const reviewSections = getReviewSections(data, formType);

  const update = useCallback(<K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setLastAutosaved("Just now");
  }, []);

  const fieldStatus = (field: keyof IntakeFormData) => {
    const { state, message } = getFieldValidationState(field, data, formType);
    return { validationState: state, validationMessage: message };
  };

  const toggleCoverage = (coverage: string) => {
    setData((prev) => ({
      ...prev,
      coverageNeeded: prev.coverageNeeded.includes(coverage)
        ? prev.coverageNeeded.filter((c) => c !== coverage)
        : [...prev.coverageNeeded, coverage],
    }));
  };

  const uploadDocument = useCallback(
    (docId: string) => {
      const doc = documentFields.find((d) => d.id === docId);
      const fileName = `${doc?.label ?? docId}.pdf`;
      const toastId = toast.processing(toastMessages.intake.documentUploading);
      setUploadState({ docId, fileName, progress: 0, phase: "uploading" });

      let progress = 0;
      const interval = window.setInterval(() => {
        progress += 18;
        if (progress >= 100) {
          window.clearInterval(interval);
          setUploadState({ docId, fileName, progress: 100, phase: "processing" });
          window.setTimeout(() => {
            try {
              setData((prev) => ({
                ...prev,
                documents: { ...prev.documents, [docId]: true },
              }));
              setUploadState({ docId, fileName, progress: 100, phase: "completed" });
              toast.update(toastId, toastMessages.intake.documentUploaded, "success");
              window.setTimeout(() => setUploadState(null), 1200);
            } catch {
              setUploadState(null);
              toast.update(toastId, toastMessages.intake.uploadFailed, "error", {
                action: { label: "Retry", onClick: () => uploadDocument(docId) },
              });
            }
          }, 480);
          return;
        }
        setUploadState({ docId, fileName, progress, phase: "uploading" });
      }, 120);
    },
    [documentFields, toast],
  );

  const toggleDocument = (docId: string) => {
    const isUploaded = data.documents[docId];
    if (isUploaded) {
      setData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [docId]: false },
      }));
      setUploadState(null);
      return;
    }

    uploadDocument(docId);
  };

  const validateAndContinue = () => {
    setTouched(currentStep);
    setVisitedSteps((prev) => new Set([...prev, currentStep]));
    if (stepErrors.length > 0) return;
    if (currentStep < 6) {
      const next = (currentStep + 1) as FormBuilderStepId;
      setCurrentStep(next);
      setVisitedSteps((prev) => new Set([...prev, next]));
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as FormBuilderStepId);
  };

  const handleSaveDraft = () => {
    toast.success(toastMessages.intake.draftSaved);
  };

  const handleDiscard = () => {
    setData(getFormDataByType(formType));
    setCurrentStep(1);
    setTouched(null);
  };

  const renderStep1 = (errs: ReturnType<typeof getFieldErrors>) => {
    const lang = data.preferredClientLanguage;
    const L = (key: string) => getIntakeStep1Label(key, lang);

    if (personal) {
      return (
        <div className="intake-form-grid">
          <FormField label={L("preferredLanguage")} required error={errorFor(errs, "preferredClientLanguage")} className="intake-form-field-full">
            <select className="intake-form-input" value={data.preferredClientLanguage} onChange={(e) => update("preferredClientLanguage", e.target.value as IntakeFormData["preferredClientLanguage"])}>
              {intakeLanguageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </FormField>
          <FormField label={L("fullName")} required error={errorFor(errs, "businessName")}>
            <input className="intake-form-input" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} />
          </FormField>
          <FormField label={L("email")} required error={errorFor(errs, "email")}>
            <input className="intake-form-input" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} />
          </FormField>
          <FormField label={L("phone")} required error={errorFor(errs, "phone")}>
            <input className="intake-form-input" type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} />
          </FormField>
          <FormField label={L("address")} required error={errorFor(errs, "address")} className="intake-form-field-full">
            <input className="intake-form-input" value={data.address} onChange={(e) => update("address", e.target.value)} />
          </FormField>
        </div>
      );
    }

    return (
      <div className="intake-form-sections">
        <IntakeFormSection title="Business Information">
          <div className="intake-form-grid">
            <FormField label={L("businessName")} required error={errorFor(errs, "businessName")} {...fieldStatus("businessName")}>
              <input className="intake-form-input" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} />
            </FormField>
            <FormField label={L("dbaName")}>
              <input className="intake-form-input" value={data.dbaName} onChange={(e) => update("dbaName", e.target.value)} />
            </FormField>
            <FormField label={L("yearsInBusiness")} required error={errorFor(errs, "yearsInBusiness")} {...fieldStatus("yearsInBusiness")}>
              <input className="intake-form-input" type="number" value={data.yearsInBusiness} onChange={(e) => update("yearsInBusiness", e.target.value)} />
            </FormField>
            <FormField label={L("state")} required error={errorFor(errs, "state")} {...fieldStatus("state")}>
              <select className="intake-form-input" value={data.state} onChange={(e) => update("state", e.target.value)}>
                <option value="">{L("selectState")}</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
          </div>
        </IntakeFormSection>

        <IntakeFormSection title="Owner Details">
          <div className="intake-form-grid">
            <FormField label={L("ownerName")} required error={errorFor(errs, "ownerName")} {...fieldStatus("ownerName")}>
              <input className="intake-form-input" value={data.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </FormField>
          </div>
        </IntakeFormSection>

        <IntakeFormSection title="Contact Information">
          <div className="intake-form-grid">
            <FormField label={L("preferredLanguage")} required error={errorFor(errs, "preferredClientLanguage")} className="intake-form-field-full" {...fieldStatus("preferredClientLanguage")}>
              <select className="intake-form-input" value={data.preferredClientLanguage} onChange={(e) => update("preferredClientLanguage", e.target.value as IntakeFormData["preferredClientLanguage"])}>
                {intakeLanguageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormField>
            <FormField label={L("email")} required error={errorFor(errs, "email")} {...fieldStatus("email")}>
              <input className="intake-form-input" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} />
            </FormField>
            <FormField label={L("phone")} required error={errorFor(errs, "phone")} {...fieldStatus("phone")}>
              <input className="intake-form-input" type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} />
            </FormField>
          </div>
        </IntakeFormSection>

        <IntakeFormSection title="Location Information">
          <div className="intake-form-grid">
            <FormField label={L("address")} required error={errorFor(errs, "address")} className="intake-form-field-full" {...fieldStatus("address")}>
              <input className="intake-form-input" value={data.address} onChange={(e) => update("address", e.target.value)} />
            </FormField>
          </div>
        </IntakeFormSection>
      </div>
    );
  };

  const renderStep2 = (errs: ReturnType<typeof getFieldErrors>) => {
    if (formType === "contractors") {
      return (
        <div className="intake-form-grid">
          <FormField label="Type of Work" required error={errorFor(errs, "typeOfWork")} className="intake-form-field-full">
            <input className="intake-form-input" value={data.typeOfWork} onChange={(e) => update("typeOfWork", e.target.value)} placeholder="e.g. General contracting, roofing, landscaping" />
          </FormField>
          <FormField label="Payroll" required error={errorFor(errs, "payroll")}>
            <input className="intake-form-input" value={data.payroll} onChange={(e) => update("payroll", e.target.value)} placeholder="$420,000" />
          </FormField>
          <YesNoGroup label="Subcontractor Usage?" name="subcontractorUsage" value={data.subcontractorUsage} onChange={(v) => update("subcontractorUsage", v)} error={errorFor(errs, "subcontractorUsage")} />
          <FormField label="Annual Revenue" required error={errorFor(errs, "annualRevenue")}>
            <input className="intake-form-input" value={data.annualRevenue} onChange={(e) => update("annualRevenue", e.target.value)} placeholder="$1,200,000" />
          </FormField>
          <FormField label="Number of Employees" required error={errorFor(errs, "numberOfEmployees")}>
            <input className="intake-form-input" type="number" value={data.numberOfEmployees} onChange={(e) => update("numberOfEmployees", e.target.value)} />
          </FormField>
          <FormField label="License Status" required error={errorFor(errs, "licenseStatus")}>
            <input className="intake-form-input" value={data.licenseStatus} onChange={(e) => update("licenseStatus", e.target.value)} placeholder="Active: CA C-27" />
          </FormField>
        </div>
      );
    }

    if (formType === "restaurants") {
      return (
        <div className="intake-form-grid">
          <FormField label="Seating Capacity" required error={errorFor(errs, "seatingCapacity")}>
            <input className="intake-form-input" type="number" value={data.seatingCapacity} onChange={(e) => update("seatingCapacity", e.target.value)} />
          </FormField>
          <YesNoGroup label="Alcohol Served?" name="alcoholServed" value={data.alcoholServed} onChange={(v) => update("alcoholServed", v)} error={errorFor(errs, "alcoholServed")} />
          <YesNoGroup label="Delivery?" name="delivery" value={data.delivery} onChange={(v) => update("delivery", v)} error={errorFor(errs, "delivery")} />
          <FormField label="Cooking Type" required error={errorFor(errs, "cookingType")}>
            <input className="intake-form-input" value={data.cookingType} onChange={(e) => update("cookingType", e.target.value)} placeholder="Full kitchen, fast casual, etc." />
          </FormField>
          <FormField label="Annual Sales" required error={errorFor(errs, "annualSales")}>
            <input className="intake-form-input" value={data.annualSales} onChange={(e) => update("annualSales", e.target.value)} placeholder="$950,000" />
          </FormField>
        </div>
      );
    }

    return (
      <div className="intake-form-grid">
        <FormField label="Property Type" required error={errorFor(errs, "propertyType")}>
          <select className="intake-form-input" value={data.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
            <option value="">Select type</option>
            <option value="Single-family home">Single-family home</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Rental property">Rental property</option>
          </select>
        </FormField>
        <FormField label="Vehicles" required error={errorFor(errs, "vehicles")}>
          <input className="intake-form-input" type="number" min={0} value={data.vehicles} onChange={(e) => update("vehicles", e.target.value)} />
        </FormField>
        <FormField label="Drivers" required error={errorFor(errs, "drivers")}>
          <input className="intake-form-input" type="number" min={0} value={data.drivers} onChange={(e) => update("drivers", e.target.value)} />
        </FormField>
        <FormField label="Current Policy" required error={errorFor(errs, "currentPolicy")} className="intake-form-field-full">
          <input className="intake-form-input" value={data.currentPolicy} onChange={(e) => update("currentPolicy", e.target.value)} placeholder="Carrier and policy type" />
        </FormField>
      </div>
    );
  };

  const renderStep3 = (errs: ReturnType<typeof getFieldErrors>) => (
    <IntakeFormSection title="Coverage Basics">
      <div className="intake-form-step-content">
        <fieldset className="intake-form-field intake-form-field-full">
          <legend className="intake-form-label">Coverage Needed *</legend>
          <div className="intake-form-checkboxes">
            {coverageOptions.map((cov) => (
              <label key={cov} className="intake-form-checkbox">
                <input
                  type="checkbox"
                  checked={data.coverageNeeded.includes(cov)}
                  onChange={() => toggleCoverage(cov)}
                />
                {cov}
              </label>
            ))}
          </div>
          {showErrors && errorFor(errs, "coverageNeeded") && (
            <span className="intake-form-error">{errorFor(errs, "coverageNeeded")}</span>
          )}
        </fieldset>
      </div>
    </IntakeFormSection>
  );

  const renderStep4 = (errs: ReturnType<typeof getFieldErrors>) => (
    <IntakeFormSection title="Claims History">
      <div className="intake-form-step-content">
        <div className="intake-form-grid">
          <FormField label="Current Carrier" required error={errorFor(errs, "currentCarrier")} {...fieldStatus("currentCarrier")}>
            <input className="intake-form-input" value={data.currentCarrier} onChange={(e) => update("currentCarrier", e.target.value)} />
          </FormField>
          <FormField label="Expiration Date" required error={errorFor(errs, "expirationDate")} {...fieldStatus("expirationDate")}>
            <input className="intake-form-input" type="date" value={data.expirationDate} onChange={(e) => update("expirationDate", e.target.value)} />
          </FormField>
        </div>
        <YesNoGroup label="Claims in Last 5 Years?" name="claimsLast5Years" value={data.claimsLast5Years} onChange={(v) => update("claimsLast5Years", v)} error={errorFor(errs, "claimsLast5Years")} />
        {data.claimsLast5Years === "yes" && (
          <div className="intake-form-grid">
            <FormField label="Number of Claims" required error={errorFor(errs, "numberOfClaims")} {...fieldStatus("numberOfClaims")}>
              <input className="intake-form-input" type="number" min={1} value={data.numberOfClaims} onChange={(e) => update("numberOfClaims", e.target.value)} />
            </FormField>
            <FormField label="Total Loss Amount" required error={errorFor(errs, "totalLossAmount")} {...fieldStatus("totalLossAmount")}>
              <input className="intake-form-input" value={data.totalLossAmount} onChange={(e) => update("totalLossAmount", e.target.value)} placeholder="$12,500" />
            </FormField>
          </div>
        )}
        <YesNoGroup label="Policy Cancellations?" name="policyCancellations" value={data.policyCancellations} onChange={(v) => update("policyCancellations", v)} error={errorFor(errs, "policyCancellations")} />
        <YesNoGroup label="Coverage Gaps?" name="coverageGaps" value={data.coverageGaps} onChange={(v) => update("coverageGaps", v)} error={errorFor(errs, "coverageGaps")} />
      </div>
    </IntakeFormSection>
  );

  const renderStep5 = (errs: ReturnType<typeof getFieldErrors>) => (
    <div>
      {uploadState && (
        <UploadProgressBar
          fileName={uploadState.fileName}
          progress={uploadState.progress}
          phase={uploadState.phase}
        />
      )}
    <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
      <table className="commercial-hub-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Required</th>
            <th>Status</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {documentFields.map((doc) => {
            const uploaded = data.documents[doc.id];
            const docError = showErrors ? errorFor(errs, doc.id) : undefined;
            return (
              <tr key={doc.id} className={docError ? "intake-doc-row-error" : ""}>
                <td className="commercial-hub-client-cell">{doc.label}</td>
                <td>{doc.required ? "Yes" : "No"}</td>
                <td>
                  <span className={cn("badge", uploaded ? "badge-green" : "badge-yellow")}>
                    {uploaded ? "Uploaded" : "Missing"}
                  </span>
                  {docError && <div className="intake-form-error">{docError}</div>}
                </td>
                <td>
                  <button type="button" className="va-ops-action-btn" onClick={() => toggleDocument(doc.id)}>
                    {uploaded ? "Remove" : "Upload"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="intake-review-sections">
      {reviewSections.map((section) => (
        <div key={section.title} className="intake-review-block">
          <h4 className="intake-review-block-title">{section.title}</h4>
          <dl className="intake-review-dl">
            {section.items.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      ))}
      <div className="intake-review-block">
        <h4 className="intake-review-block-title">Routing Destination</h4>
        <ul className="va-ops-gap-list">
          {routingPreview.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>
      {allErrors.length > 0 && (
        <div className="intake-review-block intake-review-block-errors">
          <h4 className="intake-review-block-title">Issues to resolve</h4>
          <ul className="intake-review-errors">
            {allErrors.map((err) => <li key={`${err.field}-${err.message}`}>{err.message}</li>)}
          </ul>
        </div>
      )}
      <button type="button" className="intake-review-full-btn" onClick={() => setReviewOpen(true)}>
        View Full Review Summary
      </button>
    </div>
  );

  const renderStep = () => {
    const errs = showErrors ? stepErrors : [];

    switch (currentStep) {
      case 1: return renderStep1(errs);
      case 2: return renderStep2(errs);
      case 3: return renderStep3(errs);
      case 4: return renderStep4(errs);
      case 5: return renderStep5(errs);
      case 6: return renderStep6();
      default: return null;
    }
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "rules") setRulesOpen(true);
  };

  const currentStepMeta = formBuilderSteps.find((s) => s.id === currentStep)!;
  const stepTitle = currentStep === 1 ? getStep1Title(formType) : currentStepMeta.label;
  const continueLabel = stepContinueLabels[currentStep];
  const hasNotesContent = Boolean(data.internalNotes.trim());
  const showSidebar = true;
  const stepMissingCount = getStepMissingCount(currentStep, data, formType);

  const notesPanel = (
    <section className="va-ops-panel">
      <div className="va-ops-panel-header">
        <h3 className="va-ops-section-title">Notes</h3>
        <p className="va-ops-section-sub">Internal notes before submit.</p>
      </div>
      <textarea
        className="intake-form-input intake-form-textarea intake-helper-notes"
        rows={4}
        placeholder="Add internal notes..."
        value={data.internalNotes}
        onChange={(e) => update("internalNotes", e.target.value)}
      />
    </section>
  );

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view intake-form-builder">
          <FormSkeleton fields={8} />
        </div>
      }
      empty={<HubEmptyState preset="intake-forms" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <div className="va-ops-role-view intake-form-builder">
      <RoleTabHeader
        title={formBuilderHeader.title}
        subtitle={`${formTypeLabels[formType]}: ${formBuilderHeader.subtitle}`}
        quickActions={formBuilderHeader.quickActions}
        onQuickActionClick={handleQuickAction}
      />

      <div className="intake-form-progress intake-form-progress--enhanced" aria-label="Form progress">
        <div className="intake-form-progress-meta">
          <span>Step {currentStep} of {formBuilderSteps.length}</span>
          <span>{completion}% completed</span>
          <span className="intake-form-autosave">Autosaved {lastAutosaved}</span>
          {stepMissingCount > 0 && (
            <span className="intake-form-missing-count">{stepMissingCount} missing field{stepMissingCount === 1 ? "" : "s"}</span>
          )}
        </div>
        <div className="intake-form-progress-bar">
          <div className="intake-form-progress-fill" style={{ width: `${completion}%` }} />
        </div>
        <ol className="intake-form-stepper intake-form-stepper--enhanced">
          {formBuilderSteps.map((step) => {
            const visualState = getStepVisualState(step.id, currentStep, data, formType, visitedSteps);
            const stepPct = getStepCompletionPercent(step.id, data, formType);
            const missing = getStepMissingCount(step.id, data, formType);
            return (
              <li
                key={step.id}
                className={cn(
                  "intake-form-step",
                  `intake-form-step--${visualState}`,
                  step.id === currentStep && "active",
                )}
              >
                <button
                  type="button"
                  className="intake-form-step-btn"
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  disabled={visualState === "locked"}
                  aria-current={step.id === currentStep ? "step" : undefined}
                >
                  <span className="intake-form-step-index">{step.id}</span>
                  <span className="intake-form-step-label">{step.label}</span>
                  <span className="intake-form-step-status">{stepStatusLabels[visualState]}</span>
                  <span className="intake-form-step-pct">{stepPct}%</span>
                  {missing > 0 && visualState !== "locked" && (
                    <span className="intake-form-step-missing">{missing} missing</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={cn("intake-form-builder-main", !showSidebar && "intake-form-builder-main--solo")}>
        <section className="va-ops-panel intake-form-panel" aria-label="Form fields">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">{stepTitle}</h3>
            <p className="va-ops-section-sub">Step {currentStep}: complete all required fields marked with *</p>
          </div>
          {renderStep()}
        </section>

        <aside className="intake-form-helper intake-form-helper--sticky">
          <IntakeAiAssistant onSuggestCoverages={() => toast.success("AI suggested coverages applied")} />
          {suggestions.length > 0 && (
            <section className="va-ops-panel">
              <div className="va-ops-panel-header">
                <h3 className="va-ops-section-title">Suggested Coverages</h3>
              </div>
              <ul className="intake-suggestions-list">
                {suggestions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}
          {notesPanel}
        </aside>
      </div>

      {!showSidebar && (
        <div className="intake-form-notes-inline">
          {notesPanel}
        </div>
      )}

      <div className="intake-form-sticky-actions" role="toolbar" aria-label="Form actions">
        <div className="intake-form-sticky-inner">
          <div className="intake-form-sticky-left">
            <button type="button" className="intake-form-action-btn intake-form-action-discard" onClick={handleDiscard}>
              Discard
            </button>
          </div>
          <div className="intake-form-sticky-center">
            <button type="button" className="intake-form-action-btn intake-form-action-secondary" onClick={handleSaveDraft}>
              <AppIcon name="folder" size={15} strokeWidth={2} />
              Save Draft
            </button>
          </div>
          {currentStep > 1 && (
            <button type="button" className="intake-form-action-btn intake-form-action-secondary intake-form-sticky-back" onClick={goBack}>
              Back
            </button>
          )}
          {currentStep < 6 ? (
            <button
              type="button"
              className="intake-form-action-btn intake-form-action-primary intake-form-sticky-primary"
              onClick={validateAndContinue}
            >
              {continueLabel}
            </button>
          ) : (
            <button
              type="button"
              className="intake-form-action-btn intake-form-action-primary intake-form-sticky-primary"
              disabled={allErrors.length > 0}
              onClick={() => setReviewOpen(true)}
            >
              <AppIcon name="send" size={15} strokeWidth={2} />
              Submit Intake
            </button>
          )}
        </div>
      </div>

      <FormReviewDrawer
        open={reviewOpen}
        data={data}
        formType={formType}
        errors={allErrors}
        onClose={() => setReviewOpen(false)}
        onEditStep={(step) => setCurrentStep(step)}
      />

      <SubmissionRulesDrawer
        open={rulesOpen}
        formType={formType}
        onClose={() => setRulesOpen(false)}
      />
    </div>
    </DataStateView>
  );
}
