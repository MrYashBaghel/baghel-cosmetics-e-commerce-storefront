"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ReviewForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: String(data.get("author") ?? ""),
          location: String(data.get("location") ?? ""),
          title: String(data.get("title") ?? ""),
          body: String(data.get("body") ?? ""),
          rating,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setRating(5);
      setOpen(false);
      setSuccess(true);
      router.refresh();
    } catch {
      setError("We could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-sm border border-plum/12 bg-white/55 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-gold">Join the conversation</p>
          <h3 className="display-font mt-2 text-3xl">Have you tried this piece?</h3>
          <p className="mt-2 text-sm text-plum/60">Your note helps another woman find her new favourite.</p>
        </div>
        <button type="button" onClick={() => { setOpen((value) => !value); setSuccess(false); }} className="btn-outline shrink-0">
          {open ? "Close form" : "Write a review"}
        </button>
      </div>

      {success && (
        <p className="mt-5 border border-[#b7c9aa] bg-[#f1f6ec] px-4 py-3 text-sm text-[#4f6943]">
          Thank you — your review has been added to the product page.
        </p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-7 grid gap-5 border-t border-plum/10 pt-7 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="review-author">Your name *</label>
            <input id="review-author" name="author" required minLength={2} maxLength={100} className="field-input" placeholder="e.g. Ananya R." />
          </div>
          <div>
            <label className="field-label" htmlFor="review-location">City</label>
            <input id="review-location" name="location" maxLength={100} className="field-input" placeholder="e.g. Jaipur" />
          </div>
          <div className="sm:col-span-2">
            <span className="field-label">Your rating *</span>
            <div className="flex gap-1" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  aria-pressed={rating === value}
                  className={`text-2xl leading-none transition-transform hover:scale-110 ${value <= rating ? "text-gold" : "text-plum/20"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="review-title">Review title *</label>
            <input id="review-title" name="title" required minLength={3} maxLength={160} className="field-input" placeholder="Sum it up in a few words" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="review-body">Your review *</label>
            <textarea id="review-body" name="body" required minLength={10} maxLength={1200} rows={4} className="field-input resize-y" placeholder="Tell us about the fit, finish, formula or gifting experience..." />
          </div>
          {error && <p className="sm:col-span-2 border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-wine">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
