import { AppIcon, stripLeadingEmoji } from "@/components/ui/AppIcon";

type ConfBannerProps = {
  text: string;
  variant?: "default" | "commercial";
};

export function ConfBanner({ text, variant = "default" }: ConfBannerProps) {
  return (
    <div className={`conf-banner${variant === "commercial" ? " commercial" : ""}`}>
      <AppIcon name="triangle-alert" size={14} className="conf-banner-icon" strokeWidth={2.25} />
      <span>{stripLeadingEmoji(text)}</span>
    </div>
  );
}
