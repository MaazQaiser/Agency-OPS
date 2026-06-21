import { trainingDepartments } from "./trainingHub";
import { departmentIdToName, libraryFilterOptions, trainingResources } from "./trainingLibrary";

export const trainingDepartmentOptions = Object.values(departmentIdToName);

export const trainingTeamMemberOptions = libraryFilterOptions.assignedTo.filter(
  (name) => name !== "All Assignees",
);

export const trainingResourceOptions = trainingResources.map((resource) => resource.title);

export const trainingPriorityOptions = ["High", "Medium", "Low"] as const;
export type TrainingPriority = (typeof trainingPriorityOptions)[number];

export const defaultTrainingTags = [
  "Lead Qualification",
  "Objection Handling",
  "Carrier Follow-Up",
  "Submission Workflow",
  "Renewals",
  "Retention",
  "Client Communication",
  "Compliance",
  "Quoting",
  "Follow-Up",
  "Commercial",
];

export const defaultTrainingCategories = trainingDepartments.map((dept) => dept.title);

export type UploadTrainingPayload = {
  title: string;
  description: string;
  department: string;
  tags: string;
  duration: string;
};

export type AddNewResourcePayload = {
  title: string;
  externalUrl: string;
  description: string;
  department: string;
  duration: string;
  tags: string;
};

export type AssignTrainingPayload = {
  training: string;
  users: string[];
  dueDate: string;
  priority: TrainingPriority;
};

export function validateUploadTraining(
  form: UploadTrainingPayload,
  file: File | null,
): { ok: boolean; error?: string } {
  if (!form.title.trim()) return { ok: false, error: "Resource title is required." };
  if (!file) return { ok: false, error: "Upload a file or video." };
  if (!form.department) return { ok: false, error: "Department is required." };
  if (!form.duration.trim()) return { ok: false, error: "Duration is required." };
  return { ok: true };
}

export function validateAddNewResource(form: AddNewResourcePayload): { ok: boolean; error?: string } {
  if (!form.title.trim()) return { ok: false, error: "Resource title is required." };
  if (!form.externalUrl.trim()) return { ok: false, error: "External URL is required." };
  if (!form.department) return { ok: false, error: "Department is required." };
  if (!form.duration.trim()) return { ok: false, error: "Duration is required." };
  return { ok: true };
}

export function validateAssignTraining(form: AssignTrainingPayload): { ok: boolean; error?: string } {
  if (!form.training) return { ok: false, error: "Select a training resource." };
  if (form.users.length === 0) return { ok: false, error: "Select at least one team member." };
  if (!form.dueDate) return { ok: false, error: "Due date is required." };
  return { ok: true };
}
