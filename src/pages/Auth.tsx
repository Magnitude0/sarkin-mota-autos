import { LogoMark } from "@/components/site/SiteLogo";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/admin",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

type Mode = "signin" | "signup";

const PASSWORD_MIN = 8;

function friendlyAuthError(err: unknown, mode: Mode): string {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes("invalid credentials") || lower.includes("invalid password")) {
    return "That email or password doesn't match. Double-check and try again, My Bratha.";
  }
  if (lower.includes("account already exists") || lower.includes("already in use")) {
    return "An account with that email already exists — sign in instead.";
  }
  if (lower.includes("password") && lower.includes("at least")) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (lower.includes("email")) {
    return "That email doesn't look right. Check it and try again.";
  }
  if (mode === "signup") {
    return "We couldn't create that account. Check the details and try again.";
  }
  return "We couldn't sign you in. Check your details and try again.";
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Enter the email My Bratha keeps on file first.");
      return;
    }
    if (!password) {
      setError("Enter your password to continue.");
      return;
    }
    if (mode === "signup" && password.length < PASSWORD_MIN) {
      setError(`Password must be at least ${PASSWORD_MIN} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signIn("password", {
        flow: mode === "signup" ? "signUp" : "signIn",
        email: trimmed,
        password,
      });
      // Signed in — the effect above navigates to `redirect`.
    } catch (err) {
      console.error("Auth error:", err);
      setError(friendlyAuthError(err, mode));
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword("");
  };

  return (
    <div className="hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-3"
          aria-label="Back to Sarkin Mota Autos home"
        >
          <LogoMark size={44} />
          <span className="flex flex-col leading-none text-left">
            <span className="font-display text-xl font-black tracking-[0.06em] text-white">
              SARKIN <span className="text-gold">MOTA</span>
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-[#888]">
              Autos · Abuja
            </span>
          </span>
        </Link>

        <div className="rounded-[20px] border border-gold/20 bg-[#151517] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
              {mode === "signin" ? (
                <ShieldCheck className="h-5 w-5 text-gold" />
              ) : (
                <UserPlus className="h-5 w-5 text-gold" />
              )}
            </span>
            <h1 className="mt-4 font-display text-xl font-black text-white">
              {mode === "signin" ? (
                <>
                  Admin <span className="text-gold">Access</span>
                </>
              ) : (
                <>
                  Claim Your <span className="text-gold">Throne</span>
                </>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-[#888]">
              {mode === "signin"
                ? "Enter your email and password to reach the command room."
                : "Create the one account that runs the showroom. Sign in right after."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#101012] p-1">
            {(
              [
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Create Account" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchMode(t.id)}
                className={cn(
                  "rounded-lg py-2 font-display text-xs font-extrabold uppercase tracking-[0.12em] transition-colors",
                  mode === t.id
                    ? "bg-gold/15 text-gold"
                    : "text-[#888] hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
                autoComplete="email"
                autoFocus
                className="input-dark pl-10"
                aria-label="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={mode === "signup" ? PASSWORD_MIN : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "signup"
                    ? `Create a password (min. ${PASSWORD_MIN} characters)`
                    : "Your password"
                }
                disabled={isLoading}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="input-dark pl-10 pr-11"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] transition-colors hover:text-gold"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-[#ff8b97]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-red btn-block disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "signup" ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                <>
                  {mode === "signup" ? "Create Account" : "Enter Dashboard"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-relaxed text-[#666]">
              {mode === "signin"
                ? "First time here? Create your account above — one account, full access, My Bratha."
                : "Passwords are stored encrypted. This account is the single key to the showroom."}
            </p>
          </form>

          <p className="mt-6 text-center text-xs text-[#666]">
            <Link
              to="/"
              className="text-gold/80 transition-colors hover:text-gold"
            >
              ← Back to website
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#666]">
          © {new Date().getFullYear()} Sarkin Mota Autos — My Bratha 👑
        </p>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
