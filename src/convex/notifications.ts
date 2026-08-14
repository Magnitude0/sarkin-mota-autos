import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Email the admin when a new lead lands.
 *
 * Uses Knock's REST API. This function is a graceful no-op until the project
 * has a KNOCK_API_KEY and ADMIN_EMAIL configured (project Keys/API keys tab),
 * and a "lead-submitted" workflow exists in the Knock dashboard.
 */
export const notifyAdmin = action({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    carInterest: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (_ctx, lead) => {
    const apiKey = process.env.KNOCK_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const workflow = process.env.KNOCK_LEAD_WORKFLOW ?? "lead-submitted";
    if (!apiKey || !adminEmail) {
      return false;
    }
    try {
      const res = await fetch("https://api.knock.app/v1/notifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow,
          recipients: [{ id: "admin", email: adminEmail }],
          data: {
            name: lead.name,
            phone: lead.phone,
            email: lead.email ?? "",
            carInterest: lead.carInterest ?? "General",
            message: lead.message ?? "",
            site: "sarkinmota.com",
          },
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
});
