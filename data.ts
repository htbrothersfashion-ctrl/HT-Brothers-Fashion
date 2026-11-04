import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, orders, products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "name";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "name", label: "Name: A–Z" },
];

export const PRICE_RANGES = [
  { label: "Under $30", min: 0, max: 2999 },
  { label: "$30 – $60", min: 3000, max: 6000 },
  { label: "$60 – $100", min: 6001, max: 10000 },
  { label: "Over $100", min: 10001, max: 999999 },
] as const;

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];

export interface ProductFilter {
  category?: string;
  q?: string;
  size?: string;
  min?: number;
  max?: number;
  sort?: SortKey;
}

function sortOrder(sort: SortKey) {
  switch (sort) {
    case "newest":
      return [desc(products.createdAt)];
    case "price-asc":
      return [asc(products.price)];
    case "price-desc":
      return [desc(products.price)];
    case "rating":
      return [desc(products.rating), desc(products.reviewCount)];
    case "name":
      return [asc(products.name)];
    case "featured":
    default:
      return [desc(products.featured), desc(products.rating), desc(products.reviewCount), desc(products.createdAt)];
  }
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(categories).orderBy(categories.id);
}

export async function getCategoryCounts(): Promise<Map<string, number>> {
  await ensureSeeded();
  const rows = await db
    .select({ category: products.category, value: count() })
    .from(products)
    .groupBy(products.category);
  return new Map(rows.map((r) => [r.category, r.value]));
}

export async function getProducts(filter: ProductFilter = {}) {
  await ensureSeeded();
  const conds = [];
  if (filter.category) conds.push(eq(products.category, filter.category));
  if (filter.q) {
    const like = `%${filter.q}%`;
    conds.push(or(ilike(products.name, like), ilike(products.description, like), ilike(products.category, like)));
  }
  if (filter.size) conds.push(sql`${products.sizes} @> ARRAY[${filter.size}]::text[]`);
  if (filter.min != null) conds.push(gte(products.price, filter.min));
  if (filter.max != null) conds.push(lte(products.price, filter.max));
  return db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(...sortOrder(filter.sort ?? "featured"));
}

export async function getFeaturedProducts(limit = 8) {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.rating), desc(products.reviewCount))
    .limit(limit);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getReviewsForProduct(productId: number) {
  await ensureSeeded();
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

export async function getRelatedProducts(productId: number, category: string, limit = 4) {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, category), sql`${products.id} <> ${productId}`))
    .orderBy(desc(products.rating))
    .limit(limit);
}

export async function getHomeReviews(limit = 6) {
  await ensureSeeded();
  return db
    .select({
      id: reviews.id,
      author: reviews.author,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.rating), desc(reviews.createdAt))
    .limit(limit);
}

export async function getProductSlugs(): Promise<string[]> {
  await ensureSeeded();
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((r) => r.slug);
}

export async function getProductsByIds(ids: number[]) {
  await ensureSeeded();
  if (ids.length === 0) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}

export async function getOrderByNumber(orderNumber: string) {
  await ensureSeeded();
  const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return rows[0] ?? null;
}

export async function getStats() {
  await ensureSeeded();
  const [{ products: productCount }] = await db.select({ products: count() }).from(products);
  const [{ reviews: reviewCount }] = await db.select({ reviews: count() }).from(reviews);
  const [{ orders: orderCount }] = await db.select({ orders: count() }).from(orders);
  return { productCount, reviewCount, orderCount };
}
