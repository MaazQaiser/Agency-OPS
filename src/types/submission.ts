export type SubmissionStatus =
  | "Quoted"
  | "Pending"
  | "Overdue"
  | "Declined"
  | "Bound";

export type Submission = {
  id: string;
  client: string;
  producer: string;
  va: string;
  lob: string;
  subDate: string;
  markets: number;
  quotes: number;
  declines: number;
  carrier: string;
  premium: number;
  followUp: string;
  daysOpen: number;
  status: SubmissionStatus;
  missingDocs: string;
  uw: string;
  notes: string;
  binding: string;
};
