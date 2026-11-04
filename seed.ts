import { count, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, reviews, type NewProduct, type NewReview } from "./schema";

/* ------------------------------------------------------------------ */
/*  Idempotent bootstrap: create tables if missing, seed when empty.   */
/* ------------------------------------------------------------------ */

const DDL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    image text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text NOT NULL,
    price integer NOT NULL,
    compare_at_price integer,
    category_id integer REFERENCES categories(id) ON DELETE SET NULL,
    category text NOT NULL,
    colors text[] NOT NULL DEFAULT '{}',
    sizes text[] NOT NULL DEFAULT '{}',
    images text[] NOT NULL DEFAULT '{}',
    rating double precision NOT NULL DEFAULT 0,
    review_count integer NOT NULL DEFAULT 0,
    stock integer NOT NULL DEFAULT 0,
    tags text[] NOT NULL DEFAULT '{}',
    featured boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id serial PRIMARY KEY,
    product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    author text NOT NULL,
    rating integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    verified boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    order_number text NOT NULL UNIQUE,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    address text NOT NULL,
    city text NOT NULL,
    state text,
    zip text NOT NULL,
    country text NOT NULL,
    items jsonb NOT NULL,
    subtotal integer NOT NULL,
    discount integer NOT NULL DEFAULT 0,
    shipping integer NOT NULL,
    tax integer NOT NULL,
    total integer NOT NULL,
    payment_method text NOT NULL,
    status text NOT NULL DEFAULT 'confirmed',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews (product_id)`,
  `CREATE INDEX IF NOT EXISTS products_category_idx ON products (category)`,
];

const globalForSeed = globalThis as typeof globalThis & { __htbSeedPromise?: Promise<void> };

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__htbSeedPromise) {
    globalForSeed.__htbSeedPromise = (async () => {
      for (const stmt of DDL_STATEMENTS) {
        await db.execute(sql.raw(stmt));
      }
      const [{ value }] = await db.select({ value: count() }).from(products);
      if (value === 0) {
        await seedDatabase();
      }
    })().catch((err) => {
      globalForSeed.__htbSeedPromise = undefined;
      console.error("[seed] failed:", err);
      throw err;
    });
  }
  return globalForSeed.__htbSeedPromise;
}

/* ------------------------------------------------------------------ */
/*  Demo catalogue                                                     */
/* ------------------------------------------------------------------ */

const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["28", "30", "32", "34", "36", "38"];

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

interface ReviewSeed {
  author: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
  verified?: boolean;
}

interface ProductSeed {
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  colors: string[];
  sizes: string[];
  stock: number;
  tags: string[];
  featured?: boolean;
  daysAgo: number;
  description: string;
  images: string[];
  reviews: ReviewSeed[];
}

const img = (...names: string[]) => names.map((n) => `/images/${n}`);

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    name: "Essential Cotton Crew Tee",
    slug: "essential-cotton-crew-tee",
    category: "t-shirts",
    price: 2400,
    compareAtPrice: 2900,
    colors: ["White", "Black", "Heather Grey"],
    sizes: TOP_SIZES,
    stock: 120,
    tags: ["bestseller"],
    featured: true,
    daysAgo: 180,
    description:
      "Our signature 240gsm organic cotton crew neck, pre-shrunk and garment-dyed for a lived-in feel from day one. A clean, structured collar that never sags, with a boxy-but-not-baggy cut that sits right whether it's tucked or loose. The tee every wardrobe is built around.",
    images: img("p01-1.jpg", "p01-2.jpg", "p01-3.jpg"),
    reviews: [
      { author: "Marcus T.", rating: 5, title: "Bought three more the next week", body: "Fit is perfect — not too tight, not a tent. The collar keeps its shape after washes, which never happens with cheap tees. Already ordered two more colors.", daysAgo: 40 },
      { author: "Daniel K.", rating: 5, title: "Heavyweight without the heat", body: "Thick fabric that still breathes. Wore it in October and it was perfect. Shipping was fast too.", daysAgo: 25 },
      { author: "Andre L.", rating: 4, title: "Great tee, runs slightly long", body: "Quality is clearly there. I'm 5'9\" and the L is a touch long on me, but the fabric and stitching make up for it.", daysAgo: 12 },
      { author: "Jamal R.", rating: 5, title: "My new white tee", body: "Crisp white that doesn't go see-through. HT Brothers never misses.", daysAgo: 6 },
    ],
  },
  {
    name: "Heavyweight Boxy Tee",
    slug: "heavyweight-boxy-tee",
    category: "t-shirts",
    price: 3200,
    compareAtPrice: 4000,
    colors: ["Black", "Charcoal", "White"],
    sizes: TOP_SIZES,
    stock: 85,
    tags: ["sale"],
    daysAgo: 150,
    description:
      "A 280gsm boxy-cut tee with dropped shoulders and a ribbed collar that holds its shape. Garment-dyed in small batches so every piece has its own subtle character. Made to be layered under or worn solo.",
    images: img("p02-1.jpg", "p02-2.jpg", "p02-3.jpg"),
    reviews: [
      { author: "Chris P.", rating: 5, title: "The drape is unreal", body: "Heavy fabric, perfect boxy fit. Looks expensive — people ask where it's from every time.", daysAgo: 33 },
      { author: "Tomás G.", rating: 5, title: "Worth every penny", body: "You can feel the weight the second you pick it up. No more thin, clingy tees for me.", daysAgo: 18 },
      { author: "Kevin O.", rating: 4, title: "Sizing up recommended", body: "It's boxy as advertised — size down if you want a closer fit. Great quality though.", daysAgo: 9 },
    ],
  },
  {
    name: "Garment-Dyed Pocket Tee",
    slug: "garment-dyed-pocket-tee",
    category: "t-shirts",
    price: 2800,
    colors: ["Heather Grey", "Sand", "Olive"],
    sizes: TOP_SIZES,
    stock: 64,
    tags: [],
    daysAgo: 95,
    description:
      "Soft-hand pocket tee dyed after cutting, so the color soaks evenly into every seam. Reinforced chest pocket, side-seamed body, and a neckline that won't stretch out. Subtle vintage wash included.",
    images: img("p03-1.jpg", "p03-2.jpg", "p03-3.jpg"),
    reviews: [
      { author: "Ryan M.", rating: 4, title: "Nice faded look", body: "The garment dye gives it a vintage vibe straight out of the bag. Pocket is actually big enough for a phone.", daysAgo: 21 },
      { author: "Samuel A.", rating: 5, title: "Perfect everyday tee", body: "Soft, breathable, and the pocket is useful. This is my third one from HT.", daysAgo: 14 },
      { author: "Omar H.", rating: 5, title: "Color is gorgeous", body: "Got the olive — deep and rich, photos don't do it justice.", daysAgo: 4 },
    ],
  },
  {
    name: "Oversized Vintage Wash Tee",
    slug: "oversized-vintage-wash-tee",
    category: "t-shirts",
    price: 3600,
    colors: ["Sand", "Black", "Cream"],
    sizes: TOP_SIZES,
    stock: 48,
    tags: ["new", "bestseller"],
    featured: true,
    daysAgo: 12,
    description:
      "Cut wide and long with a vintage enzyme wash that feels broken-in on arrival. Ribbed collar, double-needle hems, and a relaxed shoulder. The statement tee of the season.",
    images: img("p04-1.jpg", "p04-2.jpg", "p04-3.jpg"),
    reviews: [
      { author: "Luca B.", rating: 5, title: "Straight off the runway", body: "The oversized fit is exactly what I wanted for layering. Fabric is thick but soft. New favorite.", daysAgo: 8 },
      { author: "Ethan W.", rating: 5, title: "Wash looks premium", body: "You can tell it's garment washed — no stiffness at all. Wore it the day it arrived.", daysAgo: 3 },
    ],
  },
  {
    name: "Pique Knit Polo",
    slug: "pique-knit-polo",
    category: "t-shirts",
    price: 3900,
    compareAtPrice: 4600,
    colors: ["Navy", "White", "Black"],
    sizes: TOP_SIZES,
    stock: 70,
    tags: [],
    daysAgo: 120,
    description:
      "A modern pique polo in breathable cotton with a soft, unstructured collar and a trim two-button placket. Clean enough for the office, casual enough for the weekend. Pre-washed to minimize shrinkage.",
    images: img("p05-1.jpg", "p05-2.jpg", "p05-3.jpg"),
    reviews: [
      { author: "Nathan S.", rating: 5, title: "Elevated my whole rotation", body: "Wore it to a dinner and got compliments all night. The pique texture looks premium.", daysAgo: 30 },
      { author: "Victor D.", rating: 4, title: "Great polo", body: "Collar sits flat, no curling. Wish they had more colors but the navy is perfect.", daysAgo: 16 },
      { author: "Isaac F.", rating: 5, title: "Fit is spot on", body: "True to size with a modern slim fit. Material breathes well on hot days.", daysAgo: 7 },
    ],
  },
  {
    name: "Core Pullover Hoodie",
    slug: "core-pullover-hoodie",
    category: "hoodies",
    price: 5800,
    colors: ["Black", "Heather Grey", "Navy"],
    sizes: TOP_SIZES,
    stock: 56,
    tags: ["bestseller"],
    featured: true,
    daysAgo: 200,
    description:
      "Our best-selling pullover: a 380gsm brushed-back fleece with a double-lined hood, kangaroo pocket, and ribbed cuffs that keep their shape. Garment-dyed for depth of color. Built for cold mornings and late nights.",
    images: img("p06-1.jpg", "p06-2.jpg", "p06-3.jpg"),
    reviews: [
      { author: "Marcus T.", rating: 5, title: "Living in this hoodie", body: "Bought it in November, basically haven't taken it off. Warm, heavy, and the hood actually stays up.", daysAgo: 45 },
      { author: "Hassan M.", rating: 5, title: "Best hoodie I own", body: "The fleece inside is incredibly soft. Washes well too — no pilling after 10+ washes.", daysAgo: 28 },
      { author: "Daniel K.", rating: 4, title: "Warm and well made", body: "Slightly oversized which I like. Sleeves are a bit long but easy to cuff.", daysAgo: 11 },
      { author: "Chris P.", rating: 5, title: "Instant classic", body: "This is the hoodie everyone should own. Zero complaints.", daysAgo: 2 },
    ],
  },
  {
    name: "Heather Zip-Up Hoodie",
    slug: "heather-zip-up-hoodie",
    category: "hoodies",
    price: 6400,
    colors: ["Heather Grey", "Black", "Olive"],
    sizes: TOP_SIZES,
    stock: 42,
    tags: [],
    daysAgo: 80,
    description:
      "A versatile full-zip in marled heather fleece with a two-way YKK zip, hidden phone pocket, and a tailored fit through the body. Layer it over a tee or under a jacket — it works everywhere.",
    images: img("p07-1.jpg", "p07-2.jpg", "p07-3.jpg"),
    reviews: [
      { author: "Andre L.", rating: 5, title: "Perfect zip hoodie", body: "The zip is smooth and the fit is flattering. The hidden pocket is a nice touch.", daysAgo: 22 },
      { author: "Jamal R.", rating: 4, title: "Great for layering", body: "Heather grey goes with everything. Wish the hood was a bit bigger but overall excellent.", daysAgo: 10 },
    ],
  },
  {
    name: "Cloud Fleece Oversized Hoodie",
    slug: "cloud-fleece-oversized-hoodie",
    category: "hoodies",
    price: 7200,
    colors: ["Cream", "Sand", "Black"],
    sizes: TOP_SIZES,
    stock: 33,
    tags: ["new"],
    featured: true,
    daysAgo: 8,
    description:
      "Our softest fleece yet — a 420gsm loopback cotton brushed four times for a cloud-like hand feel. Oversized fit with dropped shoulders and an extended drawcord hood. The one you reach for first.",
    images: img("p08-1.jpg", "p08-2.jpg", "p08-3.jpg"),
    reviews: [
      { author: "Tomás G.", rating: 5, title: "Like wearing a blanket", body: "Absurdly soft. The oversized cut looks great with baggy jeans. Shipping was quick.", daysAgo: 5 },
      { author: "Kevin O.", rating: 5, title: "New favorite hoodie", body: "You can literally feel the quality. Heavy, cozy, perfect hood.", daysAgo: 2 },
    ],
  },
  {
    name: "Slim-Fit Stretch Chino",
    slug: "slim-fit-stretch-chino",
    category: "pants",
    price: 4800,
    colors: ["Khaki", "Charcoal", "Olive"],
    sizes: WAIST_SIZES,
    stock: 60,
    tags: [],
    daysAgo: 140,
    description:
      "A smart-casual chino with 2% elastane for movement. Tapered leg, flat front, and a garment-dyed khaki that ages beautifully. From the office to dinner — one pant that does it all.",
    images: img("p09-1.jpg", "p09-2.jpg", "p09-3.png"),
    reviews: [
      { author: "Ryan M.", rating: 5, title: "Finally, chinos that fit", body: "The stretch makes them so comfortable. Khaki color is rich, not that weird pale beige.", daysAgo: 35 },
      { author: "Samuel A.", rating: 4, title: "Great pants", body: "Slim without being skinny. Waist fits true. Docking one star because I wish there were more inseam options.", daysAgo: 19 },
      { author: "Omar H.", rating: 5, title: "My go-to work pant", body: "Wore them five days a week. No sagging at the knees.", daysAgo: 8 },
    ],
  },
  {
    name: "Straight-Leg Selvedge Jean",
    slug: "straight-leg-selvedge-jean",
    category: "pants",
    price: 6200,
    compareAtPrice: 7400,
    colors: ["Indigo", "Black"],
    sizes: WAIST_SIZES,
    stock: 45,
    tags: ["bestseller"],
    featured: true,
    daysAgo: 160,
    description:
      "13.5oz Japanese selvedge denim with a straight leg, mid rise, and a clean five-pocket layout. Rigid at first, then molds to your body for a custom fit. The jean you'll keep for a decade.",
    images: img("p10-1.jpg", "p10-2.jpg", "p10-3.jpg"),
    reviews: [
      { author: "Luca B.", rating: 5, title: "Denim nerd approved", body: "Selvedge detail, proper weight, great cut. These will fade beautifully. Already planning my second pair.", daysAgo: 40 },
      { author: "Ethan W.", rating: 5, title: "Perfect straight fit", body: "Not too tight, not baggy. The indigo is deep and rich. Breaking them in now.", daysAgo: 24 },
      { author: "Nathan S.", rating: 4, title: "Great jeans, stiff at first", body: "Rigid denim takes a few wears to soften — expected with selvedge. Fit is excellent.", daysAgo: 13 },
      { author: "Victor D.", rating: 5, title: "Worth the price", body: "Quality is obvious. Stitching, hardware, everything is solid.", daysAgo: 5 },
    ],
  },
  {
    name: "Ripstop Cargo Pant",
    slug: "ripstop-cargo-pant",
    category: "pants",
    price: 5400,
    colors: ["Olive", "Black", "Sand"],
    sizes: WAIST_SIZES,
    stock: 38,
    tags: [],
    daysAgo: 60,
    description:
      "Utilitarian cargo cut from durable cotton ripstop with reinforced knees, six pockets, and an adjustable hem. Relaxed through the thigh with a slight taper. Built for the city and beyond.",
    images: img("p11-1.jpg", "p11-2.jpg", "p11-3.jpg"),
    reviews: [
      { author: "Isaac F.", rating: 5, title: "Pockets for days", body: "Finally cargo pants that look good and not like a costume. The ripstop fabric feels tough.", daysAgo: 26 },
      { author: "Hassan M.", rating: 4, title: "Solid utility pant", body: "Olive color is perfect. Adjustable hem is a clever touch. Slightly warm in summer but fine.", daysAgo: 12 },
    ],
  },
  {
    name: "Pleated Wide-Leg Trouser",
    slug: "pleated-wide-leg-trouser",
    category: "pants",
    price: 5600,
    colors: ["Charcoal", "Sand", "Black"],
    sizes: WAIST_SIZES,
    stock: 29,
    tags: ["new"],
    daysAgo: 20,
    description:
      "A tailored wide-leg trouser with a single forward pleat, high waist, and cropped hem. Cut from a fluid wool-blend twill that drapes beautifully. Smart enough for a meeting, cool enough for the street.",
    images: img("p12-1.jpg", "p12-2.jpg", "p12-3.jpg"),
    reviews: [
      { author: "Marcus T.", rating: 5, title: "The drape is chef's kiss", body: "These fall perfectly. Wore them to a wedding and got more compliments than the groom.", daysAgo: 15 },
      { author: "Daniel K.", rating: 5, title: "Elegant and comfortable", body: "Pleats give room without looking baggy. Fabric feels expensive.", daysAgo: 6 },
    ],
  },
  {
    name: "Essential Oxford Shirt",
    slug: "essential-oxford-shirt",
    category: "shirts",
    price: 4600,
    colors: ["White", "Washed Blue", "Black"],
    sizes: TOP_SIZES,
    stock: 52,
    tags: ["bestseller"],
    featured: true,
    daysAgo: 170,
    description:
      "The definitive button-down: washed oxford cloth, button-down collar, chest pocket, and a relaxed-regular fit that works tucked or untucked. Pre-washed for softness, with reinforced single-needle stitching throughout.",
    images: img("p13-1.jpg", "p13-2.jpg", "p13-3.jpg"),
    reviews: [
      { author: "Chris P.", rating: 5, title: "The only shirt I need", body: "I own this in white and blue. The collar rolls perfectly and the fit is consistent. Instant 5 stars.", daysAgo: 38 },
      { author: "Andre L.", rating: 5, title: "Crisp and comfortable", body: "Oxford cloth that doesn't feel stiff. Wore it to a job interview, got the job.", daysAgo: 20 },
      { author: "Jamal R.", rating: 4, title: "Great shirt", body: "Slightly long in the body for me but the quality is undeniable.", daysAgo: 9 },
    ],
  },
  {
    name: "Linen Camp-Collar Shirt",
    slug: "linen-camp-collar-shirt",
    category: "shirts",
    price: 5200,
    colors: ["Sage", "Sand", "White"],
    sizes: TOP_SIZES,
    stock: 26,
    tags: ["new"],
    featured: true,
    daysAgo: 10,
    description:
      "A breezy camp-collar shirt in a linen-cotton blend that resists wrinkles and creases. Relaxed fit, tonal buttons, and a straight hem — made for beach days, barbecues, and summer evenings.",
    images: img("p14-1.jpg", "p14-2.jpg", "p14-3.jpg"),
    reviews: [
      { author: "Tomás G.", rating: 5, title: "Summer perfection", body: "The sage color is exactly like the photos. Breathable, light, looks great open over a tee.", daysAgo: 7 },
      { author: "Kevin O.", rating: 4, title: "Great vacation shirt", body: "Wore it all week in the heat — zero sweat marks showing. Fit is relaxed as described.", daysAgo: 3 },
    ],
  },
  {
    name: "Brushed Flannel Overshirt",
    slug: "brushed-flannel-overshirt",
    category: "shirts",
    price: 5800,
    compareAtPrice: 6800,
    colors: ["Rust", "Olive", "Charcoal"],
    sizes: TOP_SIZES,
    stock: 34,
    tags: ["sale"],
    daysAgo: 90,
    description:
      "A shirt-jacket hybrid in brushed cotton flannel — substantial enough to wear as a light jacket over a tee. Two chest pockets, corozo buttons, and a soft hand feel that only gets better with wear.",
    images: img("p15-1.jpg", "p15-2.jpg", "p15-3.jpg"),
    reviews: [
      { author: "Ryan M.", rating: 5, title: "Perfect fall layer", body: "The rust check looks amazing in person. Warm without overheating. HT Brothers delivers again.", daysAgo: 27 },
      { author: "Samuel A.", rating: 5, title: "Soft and sturdy", body: "Brushed flannel is thick but not bulky. Buttons feel premium.", daysAgo: 15 },
      { author: "Omar H.", rating: 4, title: "Great overshirt", body: "Runs slightly big which works for layering. Quality is top tier.", daysAgo: 6 },
    ],
  },
  {
    name: "Denim Trucker Jacket",
    slug: "denim-trucker-jacket",
    category: "jackets",
    price: 9800,
    colors: ["Washed Blue", "Black", "Indigo"],
    sizes: TOP_SIZES,
    stock: 24,
    tags: ["bestseller"],
    featured: true,
    daysAgo: 130,
    description:
      "The classic Type III trucker, rebuilt: 12oz comfort-stretch denim, adjustable waist tabs, copper shank buttons, and a slightly cropped body. One wash, ready to wear — it'll only get better from here.",
    images: img("p16-1.jpg", "p16-2.jpg", "p16-3.jpg"),
    reviews: [
      { author: "Luca B.", rating: 5, title: "Iconic trucker", body: "Fit is spot on — cropped but not too short. The wash is beautiful. This jacket will last forever.", daysAgo: 42 },
      { author: "Ethan W.", rating: 5, title: "Best denim jacket I've owned", body: "Breaks in fast because of the stretch. Pockets are deep. Adjustable tabs are a nice detail.", daysAgo: 29 },
      { author: "Nathan S.", rating: 4, title: "Great jacket", body: "Slightly stiff at first but softening up nicely. Would buy again.", daysAgo: 14 },
    ],
  },
  {
    name: "Night Rider Bomber Jacket",
    slug: "night-rider-bomber-jacket",
    category: "jackets",
    price: 11000,
    compareAtPrice: 12500,
    colors: ["Black", "Olive"],
    sizes: TOP_SIZES,
    stock: 18,
    tags: ["sale", "new"],
    daysAgo: 15,
    description:
      "A modern bomber in matte technical nylon with ribbed collar, cuffs, and hem. Water-resistant, lightweight, and cut with a clean bomber silhouette. Zip pockets, satin lining, and a two-way zip. Made for city nights.",
    images: img("p17-1.jpg", "p17-2.jpg", "p17-3.jpg"),
    reviews: [
      { author: "Victor D.", rating: 5, title: "Sleek and warm enough", body: "Wore it on a cold night out and was perfectly warm. The matte finish looks premium.", daysAgo: 10 },
      { author: "Isaac F.", rating: 5, title: "Instant outfit upgrade", body: "Throw this over anything and you look put together. Zipper is buttery smooth.", daysAgo: 4 },
    ],
  },
  {
    name: "Linen Blend Drawstring Short",
    slug: "linen-blend-drawstring-short",
    category: "shorts",
    price: 3400,
    colors: ["Sand", "White", "Navy"],
    sizes: WAIST_SIZES,
    stock: 40,
    tags: ["new"],
    daysAgo: 6,
    description:
      "A 7-inch inseam short in a breathable linen-cotton twill with an elastic drawstring waist and slash pockets. Quick-dry, wrinkle-resistant, and cut with a relaxed leg. Summer sorted.",
    images: img("p18-1.jpg", "p18-2.jpg", "p18-3.jpg"),
    reviews: [
      { author: "Hassan M.", rating: 5, title: "Beach-ready", body: "Light, cool, and the drawstring keeps everything in place. Perfect length.", daysAgo: 4 },
      { author: "Marcus T.", rating: 4, title: "Great summer short", body: "Sand color hides everything. Wish there were a back pocket but minor.", daysAgo: 2 },
    ],
  },
];

const CATEGORY_SEEDS = [
  { name: "T-Shirts", slug: "t-shirts", description: "Heavyweight tees, polos and everyday staples with a clean modern fit.", image: "/images/col-tshirts.jpg" },
  { name: "Hoodies", slug: "hoodies", description: "Brushed fleece pullovers and zip-ups built for cold mornings.", image: "/images/col-hoodies.jpg" },
  { name: "Pants", slug: "pants", description: "Chinos, selvedge denim, cargos and tailored trousers that drape right.", image: "/images/col-pants.jpg" },
  { name: "Shirts", slug: "shirts", description: "Oxfords, linen camp collars and flannel overshirts for every occasion.", image: "/images/col-shirts.jpg" },
  { name: "Jackets", slug: "jackets", description: "Trucker denim and night-ready bombers — the outer layer that finishes the fit.", image: "/images/col-jackets.jpg" },
  { name: "Shorts", slug: "shorts", description: "Breathable summer shorts with a relaxed, easy cut.", image: "/images/col-shorts.jpg" },
];

/* ------------------------------------------------------------------ */

async function seedDatabase(): Promise<void> {
  await db.insert(categories).values(CATEGORY_SEEDS).onConflictDoNothing({ target: categories.slug });

  const categoryRows = await db.select().from(categories);
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const productRows: NewProduct[] = PRODUCT_SEEDS.map((p) => {
    const ratings = p.reviews.map((r) => r.rating);
    const avg = ratings.reduce((a, b) => a + b, 0) / Math.max(ratings.length, 1);
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      categoryId: categoryIdBySlug.get(p.category) ?? null,
      category: p.category,
      colors: p.colors,
      sizes: p.sizes,
      images: p.images,
      rating: Math.round(avg * 10) / 10,
      reviewCount: p.reviews.length,
      stock: p.stock,
      tags: p.tags,
      featured: p.featured ?? false,
      createdAt: daysAgo(p.daysAgo),
    };
  });

  const inserted = await db
    .insert(products)
    .values(productRows)
    .onConflictDoNothing({ target: products.slug })
    .returning({ id: products.id, slug: products.slug });

  const idBySlug = new Map(inserted.map((r) => [r.slug, r.id]));

  const reviewRows: NewReview[] = PRODUCT_SEEDS.flatMap((p) =>
    p.reviews.map((r) => ({
      productId: idBySlug.get(p.slug) ?? 0,
      author: r.author,
      rating: r.rating,
      title: r.title,
      body: r.body,
      verified: r.verified ?? true,
      createdAt: daysAgo(r.daysAgo),
    })),
  );

  if (reviewRows.length > 0) {
    await db.insert(reviews).values(reviewRows).onConflictDoNothing();
  }

  console.log(`[seed] inserted ${inserted.length} products, ${reviewRows.length} reviews, ${categoryRows.length} categories`);
}
