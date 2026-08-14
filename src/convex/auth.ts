// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { ROLES } from "./schema";

/**
 * The showroom only ever has a handful of admin accounts:
 * the CEO, the developer, and one recovery account.
 */
export const MAX_ADMIN_ACCOUNTS = 3;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      // Normalize the email and stamp every account as an admin.
      profile: (params) => ({
        email: String(params.email ?? "").trim().toLowerCase(),
        role: ROLES.ADMIN,
      }),
    }),
  ],
  callbacks: {
    // Runs inside the auth mutation every time an account is created.
    // Enforces the account policy server-side (not just in the UI):
    //  - Public sign-up is only ever allowed for the very first account
    //    (the bootstrap). After that, seats are granted by an existing
    //    admin via api.accounts.createUser, which passes `_createdByAdmin`.
    //  - The total is hard-capped at MAX_ADMIN_ACCOUNTS for every path.
    createOrUpdateUser: async (ctx, { existingUserId, profile }) => {
      const { _createdByAdmin = false, ...userFields } = profile as Record<
        string,
        unknown
      > & { _createdByAdmin?: boolean };
      if (existingUserId === null) {
        const count = (await ctx.db.query("users").collect()).length;
        if (count >= MAX_ADMIN_ACCOUNTS) {
          throw new ConvexError(
            `All ${MAX_ADMIN_ACCOUNTS} admin seats are taken — no more accounts can be created, My Bratha.`,
          );
        }
        if (!_createdByAdmin && count >= 1) {
          throw new ConvexError(
            "Public sign-ups are closed — new accounts are added by an existing admin, My Bratha.",
          );
        }
        return await ctx.db.insert("users", userFields);
      }
      await ctx.db.patch(existingUserId, userFields);
      return existingUserId;
    },
  },
});
