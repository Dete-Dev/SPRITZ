import CompleteSignIn from "./CompleteSignIn";

/**
 * Where the magic link lands. The work happens in the browser, not here, and
 * that is the whole point of this file being three lines long.
 *
 * The obvious version — exchange the code in this Server Component — looks
 * right and silently does not work: a Server Component cannot write cookies,
 * so the session is created and thrown away on the same request. The symptom
 * is a clean `/auth/callback → /dashboard → /login` in the logs with no error
 * anywhere. It cost a round of debugging with production logs to see.
 *
 * The browser client can write cookies, and it also holds the PKCE verifier,
 * so it can handle both shapes of link. See CompleteSignIn.
 */
export default function CallbackPage() {
  return <CompleteSignIn />;
}
