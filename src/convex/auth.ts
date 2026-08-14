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
    // Enforces the account cap server-side (not just in the UI).
    createOrUpdateUser: async (ctx, { existingUserId, profile }) => {
      if (existingUserId === null) {
        const count = (await ctx.db.query("users").collect()).length;
        if (count >= MAX_ADMIN_ACCOUNTS) {
          throw new ConvexError(
            `All ${MAX_ADMIN_ACCOUNTS} admin seats are taken — sign-ups are closed, My Bratha.`,
          );
        }
        return await ctx.db.insert("users", profile);
      }
      await ctx.db.patch(existingUserId, profile);
      return existingUserId;
    },
  },
});
