import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEV_CODE_KEY = "otp:dev-code";

/**
 * Dev-only: stash the latest generated one-time code so the auth page can
 * show it when no email provider key is configured yet. When
 * `RESEND_API_KEY` is set, codes are delivered by email and this function
 * refuses to write, so the code can never leak in production.
 */
export const storeDevCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    if (process.env.RESEND_API_KEY) {
      return;
    }
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", DEV_CODE_KEY))
      .unique();
    if (existing !== null) {
      await ctx.db.patch(existing._id, { value: code });
    } else {
      await ctx.db.insert("settings", { key: DEV_CODE_KEY, value: code });
    }
  },
});

/**
 * Dev-only: return the last generated OTP for the auth page to display.
 * Returns null as soon as real email delivery (RESEND_API_KEY) is
 * configured, and null when no code has been requested yet.
 */
export const getDevCode = query({
  args: {},
  handler: async (ctx) => {
    if (process.env.RESEND_API_KEY) {
      return null;
    }
    const doc = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", DEV_CODE_KEY))
      .unique();
    return doc?.value ?? null;
  },
});
