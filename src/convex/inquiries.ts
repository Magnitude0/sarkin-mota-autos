import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";

/**
 * Save a lead inquiry from any public form. No auth required — this is the
 * public funnel (name + phone required, validated client-side).
 */
export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    carInterest: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const phone = args.phone.trim();
    if (!name || !phone) {
      throw new ConvexError("Name and phone number are required.");
    }
    await ctx.db.insert("inquiries", {
      name,
      phone,
      email: args.email?.trim() || undefined,
      carInterest: args.carInterest?.trim() || undefined,
      message: args.message?.trim() || undefined,
      status: "new",
      createdAt: Date.now(),
    });

    // Fire-and-forget email notification to the admin (no-op until a Knock
    // API key is configured).
    await ctx.scheduler.runAfter(0, api.notifications.notifyAdmin, {
      name,
      phone,
      email: args.email?.trim() || undefined,
      carInterest: args.carInterest?.trim() || undefined,
      message: args.message?.trim() || undefined,
    });

    return true;
  },
});

/** All leads, newest first (admin only). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authorised.");
    }
    return await ctx.db.query("inquiries").order("desc").collect();
  },
});

/** Mark a lead as contacted (admin only). */
export const markContacted = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not authorised.");
    }
    const lead = await ctx.db.get(id);
    if (!lead) {
      throw new ConvexError("Lead not found.");
    }
    await ctx.db.patch(id, { status: "contacted" });
    return true;
  },
});
