import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardList,
  DollarSign,
  Flag,
  FolderOpen,
  Globe,
  HelpCircle,
  Home,
  MessageSquare,
  Phone,
  Pin,
  LogOut,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Telescope,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Upload,
  Download,
  UserPlus,
  Users,
  X,
  XCircle,
  Zap,
  FileText,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";

export const appIcons = {
  pin: Pin,
  "bar-chart": BarChart3,
  flag: Flag,
  users: Users,
  target: CircleDot,
  bell: Bell,
  sparkles: Sparkles,
  search: Search,
  "triangle-alert": TriangleAlert,
  check: CheckCircle2,
  x: XCircle,
  close: X,
  star: Star,
  shield: Shield,
  folder: FolderOpen,
  rocket: Rocket,
  settings: Settings,
  "log-out": LogOut,
  clipboard: ClipboardList,
  dollar: DollarSign,
  refresh: RefreshCw,
  telescope: Telescope,
  trophy: Trophy,
  "chevron-down": ChevronDown,
  globe: Globe,
  home: Home,
  "help-circle": HelpCircle,
  phone: Phone,
  "message-square": MessageSquare,
  "user-plus": UserPlus,
  plus: Plus,
  send: Send,
  upload: Upload,
  download: Download,
  "trending-up": TrendingUp,
  zap: Zap,
  "file-text": FileText,
  "arrow-right-left": ArrowRightLeft,
} as const satisfies Record<string, LucideIcon>;

export type AppIconName = keyof typeof appIcons;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function AppIcon({
  name,
  size = 16,
  className,
  strokeWidth = 2,
}: AppIconProps) {
  const Icon = appIcons[name];
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}

/** Remove leading warning/status emoji from banner or alert copy. */
export function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\s⚠️⚠✅❌🟡]+/, "").trim();
}
