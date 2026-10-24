"use client";

import { useState } from "react";
import Icon from "./Icon";
import { wedding } from "@/lib/wedding";

export default function RsvpForm({ defaultName = "" }: { defaultName?: string }) {
  const [name, setName] = useState(defaultName);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!attending) {
      setMessage("Please let us know if you'll attend.");
      return;
    }
    const who = name.trim();
    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: who, attending, guests: attending === "yes" ? guests : 0, invitedAs: defaultName }),
      });
      const result = await res.json().catch(() => ({ ok: false }));
      if (!result.ok) throw new Error();
      setMessage(attending === "yes"
        ? `Thank you, ${who}! We can't wait to celebrate with you.`
        : `Thank you, ${who}. You'll be missed!`);
      setSent(true);
    } catch {
      setMessage("Sorry, we couldn't send your RSVP. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="rsvp-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="se-name">Full name</label>
        <input id="se-name" type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <p className="flabel">Will you attend?</p>
        <div className="choice">
          <button type="button" className={attending === "yes" ? "selected" : ""} onClick={() => setAttending("yes")}>Joyfully accepts</button>
          <button type="button" className={attending === "no" ? "selected" : ""} onClick={() => setAttending("no")}>Regretfully declines</button>
        </div>
      </div>
      {attending !== "no" && (
        <div className="field">
          <p className="flabel">Number of guests</p>
          <div className="stepper">
            <button type="button" aria-label="Decrease guest count" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)}>-</button>
            <span id="gCount">{guests}</span>
            <button type="button" aria-label="Increase guest count" disabled={guests >= wedding.maxGuests} onClick={() => setGuests((g) => g + 1)}>+</button>
          </div>
        </div>
      )}
      <button type="submit" className="btn btn-block" disabled={sent || sending}>
        <Icon name="send" size={16} stroke={1.6} />{sending ? "Sending..." : sent ? "RSVP sent" : "Send our RSVP"}
      </button>
      <p className="form-msg" role="status" aria-live="polite">{message}</p>
    </form>
  );
}
