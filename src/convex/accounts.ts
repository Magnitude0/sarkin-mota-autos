import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import { ROLES } from "./schema";

/** Total admin seats. Must match MAX_ADMIN_ACCOUNTS in auth.ts. */
export const MAX_ADMIN_ACCOUNTS = 3;

/** Every admin account, oldest first (signed-in admins only). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not signed in.");
    }
    return await ctx.db.query("users").order("asc").collect();
  },
});

/**
 * Grant a new admin seat (existing admins only).
 *
 * Public sign-up closes after the very first account — from then on, new
 * accounts are created here. The `_createdByAdmin` marker lets the auth
 * callback in auth.ts tell this path apart from public sign-up.
 */
export const createUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (callerId === null) {
      throw new ConvexError("You must be signed in as an admin.");
    }

    const email = args.email.trim().toLowerCase();
    if (!email.includes("@") || email.length < 5) {
      throw new ConvexError("Enter a valid email address.");
    }
    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters.");
    }

    const count = await ctx.runQuery(api.users.count);
    if (count >= MAX_ADMIN_ACCOUNTS) {
      throw new ConvexError(
        `All ${MAX_ADMIN_ACCOUNTS} admin seats are taken — no more accounts can be created.`,
      );
    }

    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: args.password },
      // `_createdByAdmin` is stripped by the createOrUpdateUser callback in
      // auth.ts before the user document is written.
      profile: {
        email,
        name: args.name?.trim() || email,
        role: ROLES.ADMIN,
        _createdByAdmin: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });

    return true;
  },
});
