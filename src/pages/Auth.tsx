import { LogoMark } from "@/components/site/SiteLogo";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

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

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    try {
      await signIn("password", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        flow: mode,
      });
      navigate(redirect);
    } catch (err) {
      console.error("Password sign-in error:", err);
      setError(
        mode === "signUp"
          ? "Could not create that account. Use a valid email and a password of at least 8 characters."
          : "Invalid email or password. Try again — or create your admin account below.",
      );
      setIsLoading(false);
    }
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
              <Lock className="h-5 w-5 text-gold" />
            </span>
            <h1 className="mt-4 font-display text-xl font-black text-white">
              Admin Access
            </h1>
            <p className="mt-1.5 text-sm text-[#888]">
              Authorised personnel only — My Bratha&apos;s command room.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                disabled={isLoading}
                autoComplete="email"
                className="input-dark pl-10"
                aria-label="Email address"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Password"
                disabled={isLoading}
                autoComplete={mode === "signUp" ? "new-password" : "current-password"}
                className="input-dark pl-10"
                aria-label="Password"
              />
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
                  <Loader2 className="h-4 w-4 animate-spin" /> One moment…
                </>
              ) : (
                <>
                  {mode === "signIn" ? "Sign In" : "Create Admin Account"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signIn" ? "signUp" : "signIn");
                setError(null);
              }}
              disabled={isLoading}
              className="text-sm font-semibold text-gold/90 transition-colors hover:text-gold"
            >
              {mode === "signIn"
                ? "First time here? Create your admin account"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-[#666]">
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
