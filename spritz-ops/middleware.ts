/**
 * Refreshes the Supabase session cookie on every request and bounces anyone
 * without one to /login. The page-level `currentStaff()` check is what
 * actually enforces the allowlist — this only keeps tokens fresh and saves a
 * flash of empty UI.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const db = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await db.auth.getUser();

  const open = ["/login", "/auth"].some((p) => request.nextUrl.pathname.startsWith(p));

  if (!user && !open) {
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  // Everything except static assets and the webhook, which authenticates with
  // an HMAC signature and has no cookie to refresh. /auth/callback stays in
  // the matcher on purpose — it needs the cookie writer to store the new
  // session — but the `open` list above keeps it from bouncing to /login.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:png|jpg|svg|webp)$).*)"],
};
