import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-24 pt-40 text-center md:pt-52">
      <p className="font-display text-8xl font-semibold text-clay">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">This piece is out of stock… forever.</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The page you're looking for doesn't exist — but the shop is fully open. Let's get you back to the good stuff.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-clay"
        >
          Shop all
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-line px-8 py-4 text-sm font-bold uppercase tracking-widest transition hover:border-ink"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
