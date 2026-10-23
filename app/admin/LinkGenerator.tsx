"use client";

import { useRef, useState } from "react";
import { cleanName, displayName, invitationMessage, prefixOptions, type Prefix } from "@/lib/guest";
import { coupleNames, wedding } from "@/lib/wedding";
import styles from "./admin.module.css";

function baseUrl() {
  return (wedding.baseUrl || window.location.origin).replace(/\/+$/, "");
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("copy failed");
}

export default function LinkGenerator() {
  const [prefix, setPrefix] = useState<Prefix>("mr");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ link: string; message: string } | null>(null);
  // Editing after generating would make the shown link stale, so copying waits for a new Generate
  const [stale, setStale] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const guest = cleanName(name);
    if (!guest) {
      setError("Please enter the guest's name.");
      return;
    }
    setError("");
    const display = displayName(prefix, guest);
    const link = `${baseUrl()}/${encodeURIComponent(display)}`;
    setResult({ link, message: invitationMessage(display, link, coupleNames) });
    setStale(false);
  }

  function showToast(text: string) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }

  function copy(text: string, done: string) {
    copyText(text).then(() => showToast(done), () => showToast("Couldn't copy - please copy it manually"));
  }

  const canCopy = !!result && !stale;

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h1 className={styles.title}>{coupleNames}</h1>
        <p className={styles.sub}>Personalised link &amp; WhatsApp message</p>

        <form onSubmit={generate} noValidate>
          <div className={styles.row}>
            <div>
              <label className={styles.label} htmlFor="prefix">Select prefix</label>
              <select id="prefix" className={styles.input} value={prefix}
                onChange={(e) => { setPrefix(e.target.value as Prefix); setStale(true); }}>
                {prefixOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={styles.label} htmlFor="guest">Guest name</label>
              <input id="guest" className={styles.input} type="text" placeholder="e.g. Sanjaya" autoComplete="off"
                value={name} onChange={(e) => { setName(e.target.value); setStale(true); }} />
            </div>
          </div>
          <p className={styles.error} role="alert">{error}</p>

          <div className={styles.buttons}>
            <button type="submit" className={`${styles.button} ${styles.primary}`}>Generate Link</button>
            <button type="button" className={styles.button} disabled={!canCopy}
              onClick={() => result && copy(result.link, "Link copied!")}>Copy Link Only</button>
            <button type="button" className={styles.button} disabled={!canCopy}
              onClick={() => result && copy(result.message, "Message copied!")}>Copy Full Message</button>
          </div>
        </form>

        {result && (
          <section className={styles.result}>
            <span className={styles.label}>Invitation link</span>
            <a className={styles.linkBox} href={result.link} target="_blank" rel="noopener noreferrer">{result.link}</a>
            <span className={`${styles.label} ${styles.spaced}`}>Message preview</span>
            <pre className={styles.preview}>{result.message}</pre>
          </section>
        )}
      </main>

      <div className={`${styles.toast} ${toast ? styles.show : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
