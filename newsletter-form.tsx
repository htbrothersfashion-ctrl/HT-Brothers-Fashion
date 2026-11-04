"use client";

import { useState } from "react";
import { IconArrowRight, IconCheck } from "./icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <p className="flex items-center justify-center gap-2 rounded-full bg-moss px-6 py-4 font-semibold text-cream">
        <IconCheck /> You're in! Check your inbox for 10% off.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-cream p-2 pl-5 shadow-sm focus-within:border-clay">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/60"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-widest text-cream transition hover:bg-clay"
        >
          Join <IconArrowRight width={14} height={14} />
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-clay">{error}</p>}
    </form>
  );
}
