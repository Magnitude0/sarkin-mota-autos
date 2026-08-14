import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LogoMark } from "@/components/site/SiteLogo";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Crown, Loader2, Lock, Mail, UserX } from "lucide-react";
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
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      className="hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10"
    >
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
          {step === "signIn" ? (
            <>
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

              <form onSubmit={handleEmailSubmit} className="mt-7 flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="input-dark pl-10"
                    aria-label="Email address"
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-[#ff8b97]">
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#666]">
                  Or
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="btn btn-outline-gold btn-block disabled:opacity-60"
              >
                <UserX className="h-4 w-4" />
                Continue as Guest
              </button>

              <p className="mt-5 text-center text-xs text-[#666]">
                <Link to="/" className="text-gold/80 transition-colors hover:text-gold">
                  ← Back to website
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                  <Crown className="h-5 w-5 text-gold" fill="currentColor" strokeWidth={1.2} />
                </span>
                <h1 className="mt-4 font-display text-xl font-black text-white">
                  Check your email
                </h1>
                <p className="mt-1.5 text-sm text-[#888]">
                  We&apos;ve sent a code to{" "}
                  <span className="font-semibold text-gold">{step.email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="mt-7 flex flex-col gap-4">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) form.requestSubmit();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && (
                  <p role="alert" className="text-center text-sm text-[#ff8b97]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="btn btn-red btn-block disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                    </>
                  ) : (
                    <>
                      Verify code <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="btn btn-outline-white btn-block"
                >
                  Use different email
                </button>
              </form>
            </>
          )}
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
