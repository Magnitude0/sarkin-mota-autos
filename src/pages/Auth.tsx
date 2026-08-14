import { LogoMark } from "@/components/site/SiteLogo";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Suspense, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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

const RESEND_SECONDS = 30;

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dev fallback: when no email key is configured, Convex stores the code and
  // this reactive query reveals it so the flow stays testable. It returns null
  // the moment real email delivery (RESEND_API_KEY) is configured.
  const devCode = useQuery(api.otp.getDevCode);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  useEffect(() => () => {
    if (resendTimer.current) clearInterval(resendTimer.current);
  }, []);

  const startResendCountdown = () => {
    setResendIn(RESEND_SECONDS);
    if (resendTimer.current) clearInterval(resendTimer.current);
    resendTimer.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          if (resendTimer.current) clearInterval(resendTimer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const requestCode = async (targetEmail = email) => {
    if (!targetEmail.trim()) {
      setError("Enter the email My Bratha keeps on file first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCode("");
    try {
      await signIn("email", { email: targetEmail.trim() });
      setEmail(targetEmail.trim());
      setStep("code");
      startResendCountdown();
    } catch (err) {
      console.error("OTP request error:", err);
      setError(
        "We couldn't send a code to that address. Check the email and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (value = code) => {
    if (value.length < 6) return;
    setIsLoading(true);
    setError(null);
    try {
      await signIn("email", { email, code: value });
      navigate(redirect);
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(
        "That code didn't match. Check it and try again — or request a fresh one.",
      );
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToEmail = () => {
    setStep("email");
    setCode("");
    setError(null);
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
              {step === "email" ? (
                <ShieldCheck className="h-5 w-5 text-gold" />
              ) : (
                <KeyRound className="h-5 w-5 text-gold" />
              )}
            </span>
            <h1 className="mt-4 font-display text-xl font-black text-white">
              {step === "email" ? (
                <>
                  Admin <span className="text-gold">Access</span>
                </>
              ) : (
                <>
                  Check Your <span className="text-gold">Inbox</span>
                </>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-[#888]">
              {step === "email"
                ? "No passwords, no accounts to create. My Bratha sends you a one-time code."
                : `We emailed a 6-digit code to ${email}. Enter it to enter the command room.`}
            </p>
          </div>

          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void requestCode();
              }}
              className="mt-7 flex flex-col gap-4"
            >
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
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
                  </>
                ) : (
                  <>
                    Send One-Time Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-relaxed text-[#666]">
                The code expires in 10 minutes. Same email works every time —
                no password to remember, My Bratha.
              </p>
            </form>
          ) : (
            <div className="mt-7 flex flex-col gap-4">
              <div className="flex justify-center">
                <InputOTP
                  value={code}
                  onChange={setCode}
                  onComplete={(value) => void verifyCode(value)}
                  maxLength={6}
                  pattern="^[0-9]*$"
                  disabled={isLoading}
                  autoFocus
                  aria-label="Six digit one-time code"
                  containerClassName="gap-2.5"
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-11 rounded-lg border border-white/15 bg-[#101012] text-lg font-black text-white"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-11 rounded-lg border border-white/15 bg-[#101012] text-lg font-black text-white"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {devCode && (
                <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-center text-sm">
                  <span className="font-display text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-gold">
                    Dev mode · no email key configured
                  </span>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-[0.35em] text-gold">
                    {devCode}
                  </p>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-[#ff8b97]"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={isLoading}
                onClick={() => void verifyCode()}
                className="btn btn-red btn-block disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Verify &amp; Enter <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-2 text-sm">
                <button
                  type="button"
                  disabled={isLoading || resendIn > 0}
                  onClick={() => void requestCode()}
                  className="font-semibold text-gold/90 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:text-[#666]"
                >
                  {resendIn > 0
                    ? `Resend code in ${resendIn}s`
                    : "Resend code"}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={resetToEmail}
                  className="inline-flex items-center gap-1.5 text-xs text-[#888] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" /> Use a different email
                </button>
              </div>
            </div>
          )}

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
