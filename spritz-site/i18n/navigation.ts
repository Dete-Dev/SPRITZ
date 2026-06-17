import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware <Link>, useRouter, redirect, etc.
 * Import these instead of next/link / next/navigation in components that need
 * to preserve the current locale across navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
