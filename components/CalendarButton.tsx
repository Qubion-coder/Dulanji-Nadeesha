"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { coupleNames, wedding } from "@/lib/wedding";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export default function CalendarButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { google, ics } = useMemo(() => {
    const start = new Date(wedding.start);
    const end = new Date(wedding.end);
    const title = `${coupleNames} · ${wedding.eventName}`;
    const location = `${wedding.venue.name}, ${wedding.venue.address}`;
    const google =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + stamp(start) + "/" + stamp(end) +
      "&location=" + encodeURIComponent(location);
    const file = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//Invite//EN",
      "BEGIN:VEVENT",
      `UID:${stamp(start)}-wedding@invite`,
      `DTSTAMP:${stamp(start)}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return { google, ics: "data:text/calendar;charset=utf-8," + encodeURIComponent(file) };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="cal" ref={ref}>
      <button type="button" className="cal-btn" aria-haspopup="menu" aria-expanded={open} aria-controls="calMenu"
        onClick={() => setOpen((o) => !o)}>
        <span className="cal-ic"><Icon name="calendarPlus" size={18} stroke={1.6} /></span>
        <span className="cal-text">
          <span className="cal-title">Save Our Date</span>
          <span className="cal-sub">Add the wedding to your calendar</span>
        </span>
        <span className="cal-chev"><Icon name="chevron" size={16} stroke={1.6} /></span>
      </button>
      <div className="cal-menu" id="calMenu" role="menu" hidden={!open} onClick={() => setOpen(false)}>
        <a role="menuitem" href={google} target="_blank" rel="noopener noreferrer">Google Calendar</a>
        <a role="menuitem" href={ics} download="wedding-invitation.ics">Apple / Outlook (.ics)</a>
      </div>
    </div>
  );
}
