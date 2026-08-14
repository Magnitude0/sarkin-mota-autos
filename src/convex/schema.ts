import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Machine statuses and badges
export const carStatusValidator = v.union(
  v.literal("available"),
  v.literal("sold"),
  v.literal("reserved"),
);
export type CarStatus = Infer<typeof carStatusValidator>;

export const carBadgeValidator = v.union(
  v.literal("new"),
  v.literal("hot"),
  v.literal(""),
);
export type CarBadge = Infer<typeof carBadgeValidator>;

export const inquiryStatusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
);
export type InquiryStatus = Infer<typeof inquiryStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Machine inventory — the showroom floor
    inventory: defineTable({
      title: v.string(), // e.g. "Toyota Highlander 2021"
      make: v.optional(v.string()),
      model: v.optional(v.string()),
      year: v.optional(v.number()),
      price: v.number(), // in Naira
      mileage: v.optional(v.string()), // e.g. "45,000 km"
      fuel: v.optional(v.string()),
      bodyType: v.optional(v.string()),
      engine: v.optional(v.string()),
      transmission: v.optional(v.string()),
      color: v.optional(v.string()),
      status: carStatusValidator, // available | sold | reserved
      badge: carBadgeValidator, // new | hot | "" (none)
      description: v.optional(v.string()),
      images: v.array(v.string()), // public image URLs
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    })
      .index("by_status", ["status"])
      .index("by_createdAt", ["createdAt"]),

    // Lead inquiries from all site forms (WhatsApp/phone-first — no email collected)
    inquiries: defineTable({
      name: v.string(),
      phone: v.string(),
      carInterest: v.optional(v.string()),
      message: v.optional(v.string()),
      status: inquiryStatusValidator, // new | contacted
      createdAt: v.number(),
    }).index("by_createdAt", ["createdAt"]),

    // Internal flags (e.g. whether demo seed data has been loaded)
    settings: defineTable({
      key: v.string(),
      value: v.optional(v.string()),
    }).index("by_key", ["key"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
