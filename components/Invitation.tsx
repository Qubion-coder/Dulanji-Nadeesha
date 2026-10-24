"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Countdown from "./Countdown";
import CalendarButton from "./CalendarButton";
import RsvpForm from "./RsvpForm";
import { coupleNames, mapsEmbed, mapsLink, wedding } from "@/lib/wedding";

type Phase = "closed" | "opening" | "gone" | "removed";

const sections = ["hero", "events", "venue", "rsvp", "footer"];

const topNav = [
  { id: "hero", label: "Home" },
  { id: "events", label: "Details" },
  { id: "rsvp", label: "RSVP" },
  { id: "venue", label: "Location" },
];

const bottomNav: { id: string; label: string; icon: IconName }[] = [
  { id: "hero", label: "Home", icon: "home" },
  { id: "events", label: "Details", icon: "calendar" },
  { id: "rsvp", label: "RSVP", icon: "mail" },
  { id: "venue", label: "Location", icon: "pin" },
  { id: "footer", label: "Contact", icon: "phone" },
];

const tiles: { href: string; icon: IconName; pre: string; title: string; sub?: string; accent?: boolean }[] = [
  { href: "#events", icon: "calendar", pre: "The", title: "Details", sub: "How the day unfolds" },
  { href: "#venue", icon: "pin", pre: "The", title: "Location", sub: "How to find us" },
  { href: "#rsvp", icon: "mail", pre: "Kindly", title: "Rsvp", accent: true },
  { href: "#footer", icon: "clock", pre: "The", title: "Day", sub: "Save the date" },
];

const parents = wedding.parents.filter((p) => p.names.trim());

function Monogram({ className }: { className?: string }) {
  const [a, b] = wedding.monogram;
  return <span className={className}>{a}<span className="amp">&amp;</span>{b}</span>;
}

export default function Invitation({ guest = "" }: { guest?: string }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [active, setActive] = useState("hero");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const playMusic = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = 0.5;
    el.play().then(() => setPlaying(true), () => setPlaying(false));
  }, []);

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) playMusic();
    else { el.pause(); setPlaying(false); }
  }

  function openInvite() {
    if (phase !== "closed") return;
    playMusic(); // tapping the seal counts as the user gesture browsers require for audio
    setPhase("opening");
    setTimeout(() => setPhase("gone"), 2200);
    setTimeout(() => setPhase("removed"), 3200);
  }

  // Lock scrolling behind the envelope; #open skips it (handy while editing)
  useEffect(() => {
    if (location.hash === "#open") { setPhase("removed"); return; }
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  const introDone = phase === "gone" || phase === "removed";

  useEffect(() => {
    if (introDone) document.body.classList.remove("locked");
  }, [introDone]);

  // Reveal-on-scroll starts once the envelope is out of the way
  useEffect(() => {
    if (!introDone) return;
    const els = document.querySelectorAll(".reveal, .reveal-scale");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [introDone]);

  useEffect(() => {
    const onScroll = () => {
      let current = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const introClass = [phase !== "closed" && "opening", introDone && "gone"].filter(Boolean).join(" ");

  return (
    <>
      {/* ============ ENVELOPE INTRO ============ */}
      {phase !== "removed" && (
        <div id="intro" className={introClass} role="dialog" aria-label="Tap the wax seal to open your invitation">
          <div className="intro-vignette" aria-hidden="true" />
          <div className="intro-top">
            <p className="intro-kicker">You are invited</p>
            <p className="intro-names">{coupleNames}</p>
          </div>
          <div className="envelope">
            <img src="/assets/envelope-closed.webp" alt="" className="env-img env-closed" draggable={false} fetchPriority="high" />
            <img src="/assets/envelope-open.webp" alt="" className="env-img env-open" draggable={false} />
            <span className="env-guest" aria-hidden="true">{guest || "Our Dear Guest"}</span>
            <span className="env-date" aria-hidden="true">{wedding.dateShort}</span>
            <Monogram className="env-mono monogram" />
            <button type="button" className="env-seal" onClick={openInvite}
              aria-label={`Open invitation - tap the wax seal, ${wedding.partner1} and ${wedding.partner2}`}>
              <span className="seal-halo" aria-hidden="true" />
            </button>
          </div>
          <p className="intro-hint">Tap the seal to open</p>
        </div>
      )}

      <main id="main">
        {/* ============ HEADER ============ */}
        <header className="site-header">
          <a href="#hero" className="logo" aria-label={`${wedding.partner1} and ${wedding.partner2}`}>
            {wedding.monogram[0]}<span className="amp">&amp;</span>{wedding.monogram[1]}
          </a>
          <nav className="top-nav">
            {topNav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? "active" : ""}>{n.label}</a>
            ))}
          </nav>
          <span aria-hidden="true" />
        </header>

        {/* ============ HERO ============ */}
        <section id="hero" className="wrap hero">
          <div className="hero-grid">
            <div className="hero-text reveal">
              <span className="kicker">Together with their families</span>
              <h1 className="hero-names">
                <span className="big">{wedding.partner1}</span>
                <span className="and">and</span>
                <span className="big">{wedding.partner2}</span>
              </h1>
              <p className="hero-sub">Invite you to their {wedding.eventName.toLowerCase()}</p>
              <div className="divider" aria-hidden="true"><span /><i /><span /></div>
              {parents.length > 0 && (
                <div className="parents">
                  {parents.map((p) => (
                    <div className="parent" key={p.label}>
                      <span className="p-label">{p.label}</span>
                      <span className="p-names">{p.names}</span>
                    </div>
                  ))}
                </div>
              )}
              {guest && (
                <div className="guest-note">
                  <span className="gn-line">We cordially invite</span>
                  <span className="gn-name">{guest}</span>
                  <span className="gn-line">to celebrate our special day with us.</span>
                </div>
              )}
              <a href="#rsvp" className="btn">You&apos;re invited <Icon name="arrow" size={16} stroke={1.6} /></a>
              <a href="#events" className="scroll-cue">Scroll<span><Icon name="chevron" size={16} stroke={1.6} /></span></a>
            </div>

            <div className="hero-visual">
              <div className="hero-card-wrap">
                <img src="/assets/sprig.webp" alt="" aria-hidden="true" className="hero-sprig" />
                <img src="/assets/wax-seal.webp" alt="" aria-hidden="true" className="hero-seal" />
                <img src="/assets/hero-card.webp" alt="Wedding invitation tucked into a sage envelope" className="hero-card reveal-scale" />
                <Monogram className="hero-mono monogram" />
                <div className="hero-date" aria-hidden="true">{wedding.dateShort}</div>
              </div>
            </div>
          </div>

          <div className="explore reveal">
            <div className="explore-head">
              <span className="script-label">explore</span>
              <h2>Our Celebration</h2>
            </div>
            <div className="tiles">
              {tiles.map((t) => (
                <a key={t.title} href={t.href} className={`tile reveal${t.accent ? " tile-accent" : ""}`}>
                  <span className="tile-icon"><Icon name={t.icon} size={24} stroke={1.4} /></span>
                  <span className="tile-pre">{t.pre}</span>
                  <span className="tile-title">{t.title}</span>
                  {t.sub && <span className="tile-sub">{t.sub}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ============ COUNTDOWN ============ */}
        <section id="countdown" className="countdown">
          <img src="/assets/band-sprig.webp" alt="" aria-hidden="true" className="band-sprig left" />
          <img src="/assets/band-sprig.webp" alt="" aria-hidden="true" className="band-sprig right" />
          <div className="band">
            <img src="/assets/torn-band.webp" alt="" aria-hidden="true" className="torn" />
            <div className="band-inner reveal">
              <div className="band-script">We&apos;re getting</div>
              <h2 className="band-title">Married</h2>
              <Countdown to={wedding.start} />
            </div>
          </div>
        </section>

        {/* ============ DETAILS ============ */}
        <section id="events" className="wrap section">
          <div className="sec-head reveal">
            <span className="kicker">{wedding.dateLong}</span>
            <h2>The <span className="script">Details</span></h2>
            <p className="lead">Here&apos;s how our special day will unfold. We&apos;d love for you to be there for every moment.</p>
          </div>
          <div className="events">
            {wedding.events.map((ev) => (
              <div className="event reveal" key={ev.title}>
                <span className="ev-icon"><Icon name={ev.icon as IconName} size={26} stroke={1.3} /></span>
                <span className="ev-title">{ev.title}</span>
                <div className="ev-time">{ev.time}</div>
                <span className="ev-rule" aria-hidden="true" />
                <p>{ev.note}</p>
              </div>
            ))}
          </div>
          <CalendarButton />
        </section>

        {/* ============ LOCATION ============ */}
        <section id="venue" className="wrap section">
          <div className="sec-head reveal">
            <span className="kicker">How to find us</span>
            <h2>The <span className="script">Location</span></h2>
          </div>
          <div className="venue-grid">
            <div className="venue-card-col">
              <div className="venue-card">
                <span className="ev-icon small"><Icon name="pin" size={22} stroke={1.4} /></span>
                <div className="venue-info">
                  <span className="ev-title sm">Venue</span>
                  <h3>{wedding.venue.name}</h3>
                  <p>{wedding.venue.address}</p>
                  <a className="dir-link" href={mapsLink} target="_blank" rel="noopener noreferrer">
                    <Icon name="navigate" size={14} stroke={1.6} /> Get directions
                  </a>
                </div>
              </div>
            </div>
            <div className="map-col">
              <div className="map">
                <iframe title={`Map of ${wedding.venue.name}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <a className="btn btn-sm" href={mapsLink} target="_blank" rel="noopener noreferrer">
                <Icon name="map" size={15} stroke={1.6} /> Open in Maps
              </a>
            </div>
          </div>
        </section>

        {/* ============ RSVP ============ */}
        <section id="rsvp" className="rsvp">
          <div className="rsvp-inner reveal">
            <span className="kicker">We&apos;d love to have you</span>
            <h2 className="rsvp-title">Kindly <span className="script">Rsvp</span></h2>
            <p className="lead narrow">Your presence is the greatest gift. Please let us know if you&apos;ll be joining us.</p>
            <p className="rsvp-by">Please reply at your earliest convenience</p>
            <RsvpForm defaultName={guest} />
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <section id="footer" className="wrap footer-sec">
          <div className="footer-card reveal">
            <div className="f-kicker">{wedding.eventName}</div>
            <div className="f-date">{wedding.dateShort}</div>
            <div className="f-script">We can&apos;t wait to celebrate with you!</div>
            <div className="f-names">{coupleNames}</div>
            <div className="f-phones">
              {wedding.contacts.map((c) => (
                <a key={c.href} href={c.href} {...(c.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <Icon name={c.whatsapp ? "whatsapp" : "phone"} size={15} stroke={1.6} /> {c.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="credit">
          <p>Made with love for {coupleNames}</p>
          <p className="credit-promo">
            Want a beautiful wedding website like this? Create yours with{" "}
            <a href="https://wa.me/94707819074" target="_blank" rel="noreferrer">invitemint</a>
          </p>
        </div>

        {/* ============ MOBILE BOTTOM NAV ============ */}
        <nav className="bottom-nav" aria-label="Section navigation">
          {bottomNav.map((n) =>
            n.id === "rsvp" ? (
              <a key={n.id} href="#rsvp" className="bn-rsvp">
                <span className="bn-bubble"><Icon name="mail" size={22} /></span><span>RSVP</span>
              </a>
            ) : (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? "active" : ""}>
                <Icon name={n.icon} /><span>{n.label}</span>
              </a>
            )
          )}
        </nav>
      </main>

      {/* Background music: "Ordinary" (violin cover) by ViOLiNiA Zhanna Stelmakh */}
      <audio ref={audio} src="/assets/music.mp3" loop preload="auto" />
      {phase !== "closed" && (
        <button type="button" className="music-btn" onClick={toggleMusic}
          aria-label={playing ? "Pause music" : "Play music"} aria-pressed={playing}>
          <Icon name="music" className="ic-on" />
          <Icon name="musicOff" className="ic-off" />
        </button>
      )}
    </>
  );
}
