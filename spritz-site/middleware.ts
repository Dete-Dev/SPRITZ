import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all routes except: Next internals, API routes, and static assets
  // (anything with a file extension).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
