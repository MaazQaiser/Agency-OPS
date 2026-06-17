import { cn } from "@/lib/cn";

export type AlertVariant =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "yellow"
  | "amber";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/** Module-style alert block (production / retention) */
export function Alert({ variant = "blue", title, children, className, style }: AlertProps) {
  return (
    <div className={cn("alert", `alert-${variant}`, className)} style={style}>
      {title && <div className="alert-title">{title}</div>}
      {children}
    </div>
  );
}

type AlertBoxVariant = "red" | "yellow" | "blue" | "green";

type AlertBoxProps = {
  variant: AlertBoxVariant;
  title: string;
  body: string;
  className?: string;
};

/** Commercial-style alert row with dot indicator */
export function AlertBox({ variant, title, body, className }: AlertBoxProps) {
  const dotVariant = variant === "blue" ? "blue" : variant;

  return (
    <div className={cn("alert-box", `alert-${variant}`, className)}>
      <div className={cn("alert-dot", `dot-${dotVariant}`)} />
      <div className="alert-text">
        <div className="alert-title">{title}</div>
        <div className="alert-body">{body}</div>
      </div>
    </div>
  );
}
