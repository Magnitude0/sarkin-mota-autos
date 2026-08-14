import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

/**
 * List every machine in the showroom, newest first.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inventory").order("desc").collect();
  },
});

/**
 * Get a single machine by id.
 */
export const get = query({
  args: { id: v.id("inventory") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Featured machines for the homepage — the 6 most recently added that are
 * still available or reserved.
 */
export const featured = query({
  args: {},
  handler: async (ctx) => {
    const cars = await ctx.db.query("inventory").order("desc").collect();
    return cars.filter((c) => c.status !== "sold").slice(0, 6);
  },
});

/** Resolve a Convex storage id to a public URL (used for image previews). */
export const getStorageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

const carFields = {
  title: v.string(),
  make: v.optional(v.string()),
  model: v.optional(v.string()),
  year: v.optional(v.number()),
  price: v.number(),
  mileage: v.optional(v.string()),
  fuel: v.optional(v.string()),
  bodyType: v.optional(v.string()),
  engine: v.optional(v.string()),
  transmission: v.optional(v.string()),
  color: v.optional(v.string()),
  status: v.union(
    v.literal("available"),
    v.literal("sold"),
    v.literal("reserved"),
  ),
  badge: v.union(v.literal("new"), v.literal("hot"), v.literal("")),
  description: v.optional(v.string()),
};

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Not authorised. Please sign in first.");
  }
  return userId;
}

/** Get a fresh upload URL for a car image (admin only). */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Create or update a machine. Pass `id` to update, omit it to create.
 * Images may be plain URLs or `storageId:<id>` references which get resolved
 * to public URLs server-side.
 */
export const saveCar = mutation({
  args: {
    id: v.optional(v.id("inventory")),
    data: v.object(carFields),
    images: v.array(v.string()),
  },
  handler: async (ctx, { id, data, images }) => {
    await requireAdmin(ctx);

    const resolvedImages: string[] = [];
    for (const img of images) {
      if (img.startsWith("storageId:")) {
        const url = await ctx.storage.getUrl(img.slice("storageId:".length));
        if (url) resolvedImages.push(url);
      } else if (img.trim()) {
        resolvedImages.push(img.trim());
      }
    }

    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) {
        throw new ConvexError("Machine not found.");
      }
      await ctx.db.patch(id, {
        ...data,
        images: resolvedImages,
        updatedAt: Date.now(),
      });
      return id;
    }

    return await ctx.db.insert("inventory", {
      ...data,
      images: resolvedImages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/** Delete a machine (admin only). */
export const removeCar = mutation({
  args: { id: v.id("inventory") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new ConvexError("Machine not found.");
    }
    await ctx.db.delete(id);
    return true;
  },
});
