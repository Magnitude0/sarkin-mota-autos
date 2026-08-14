// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";
import { api } from "./_generated/api";

const OTP_DIGITS = 6;

/**
 * Generate a 6-digit one-time code (000000 – 999999) for the admin login.
 */
function generateOtpCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(OTP_DIGITS, "0");
}

/**
 * Email + one-time-code provider for the admin dashboard. The flow:
 *   1. client calls signIn("email", { email })  → we email a 6-digit code
 *   2. client calls signIn("email", { email, code }) → verified & signed in
 *
 * Codes are delivered with Resend when `RESEND_API_KEY` is set. Without a
 * key (e.g. fresh preview deployments), the code is stored via
 * `otp:storeDevCode` so the auth page can reveal it for testing — that
 * write is refused the moment a key exists.
 */
const emailOtpProvider = Email({
  sendVerificationRequest: async (
    { identifier, token }: { identifier: string; token: string },
    ctx?: { runMutation: (mutation: unknown, args: unknown) => Promise<unknown> },
  ) => {
    const email = identifier;
    const code = token;
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const from =
        process.env.RESEND_EMAIL_FROM ??
        "Sarkin Mota Autos <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Your Sarkin Mota admin code — My Bratha 👑",
          html: [
            `<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">`,
            `<div style="max-width:480px;margin:0 auto;padding:40px 24px;">`,
            `<div style="text-align:center;font-weight:900;font-size:20px;letter-spacing:3px;color:#ffffff;">SARKIN <span style="color:#e6b400;">MOTA</span></div>`,
            `<div style="text-align:center;font-size:11px;letter-spacing:5px;color:#888888;margin-top:4px;">KING OF CARS · ABUJA</div>`,
            `<div style="height:1px;background:#2a2a2a;margin:28px 0;"></div>`,
            `<p style="color:#ffffff;font-size:16px;font-weight:bold;margin:0 0 6px 0;">Admin Access — My Bratha 👑</p>`,
            `<p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0;">Use the one-time code below to enter the dashboard. It expires in 10 minutes.</p>`,
            `<div style="text-align:center;margin:28px 0;background:#151517;border:1px solid #2a2a2a;border-radius:14px;padding:22px;">`,
            `<div style="font-size:11px;letter-spacing:3px;color:#888888;">YOUR CODE</div>`,
            `<div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#e6b400;margin-top:8px;">${code}</div>`,
            `</div>`,
            `<p style="color:#777;font-size:12px;line-height:1.6;margin:0;">Didn't request this? You can safely ignore this email — the code can't be used once it expires.</p>`,
            `</div></body></html>`,
          ].join(""),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`OTP email failed (${res.status}): ${body}`);
      }
    } else if (ctx?.runMutation) {
      await ctx.runMutation(api.otp.storeDevCode, { code });
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
    {
      ...emailOtpProvider,
      maxAge: 60 * 10, // codes expire after 10 minutes
      generateVerificationToken: generateOtpCode,
    },
  ],
});
