export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 md:px-6 md:pt-32">
      <div className="h-10 w-72 animate-pulse rounded-xl bg-sand" />
      <div className="mt-4 h-6 w-40 animate-pulse rounded-lg bg-sand" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-sand" />
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-sand" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-sand" />
          </div>
        ))}
      </div>
    </div>
  );
}
