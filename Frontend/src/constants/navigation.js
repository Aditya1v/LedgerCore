import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  BarChart3,
  Settings as SettingsIcon,
  UserCircle,
} from "lucide-react";

// Primary workflow — the pages someone visits day to day.
export const primaryNavigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Accounts", path: "/accounts", icon: Landmark },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

// Account-level pages — settings and identity, grouped below a divider.
export const accountNavigation = [
  { name: "Settings", path: "/settings", icon: SettingsIcon },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

// Preserved for any code that still expects a single flat list.
export const navigation = [...primaryNavigation, ...accountNavigation];
