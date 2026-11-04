"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { IconStar } from "./icons";

export function ReviewForm({ slug }: { slug: string }) {
  const router = useRouter();
  const { toast } = useCart();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!author.trim() || !title.trim() || !body.trim()) {
      setError("Please fill in your name, a title and a few words.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author: author.trim(), rating, title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      toast("Thanks — your review is live!");
      setAuthor("");
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-clay";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-parchment p-6 md:p-8">
      <h3 className="font-display text-2xl font-semibold">Write a review</h3>
      <p className="mt-1 text-sm text-ink-soft">Bought this piece? Tell the brothers how it fits and feels.</p>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Your rating</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className={`transition hover:scale-110 ${(hover || rating) >= star ? "text-gold" : "text-sand"}`}
            >
              <IconStar width={24} height={24} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          className={inputCls}
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
        />
        <input
          className={inputCls}
          placeholder="Review title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
      </div>
      <textarea
        className={`${inputCls} mt-4 min-h-28 resize-y`}
        placeholder="How does it fit? How does it feel? Would you recommend it?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={600}
      />

      {error && <p className="mt-3 text-sm font-medium text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-clay disabled:opacity-50"
      >
        {submitting ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
