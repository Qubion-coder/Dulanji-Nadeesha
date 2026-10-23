// All invitation content lives here: edit this file to customise the site.

export const wedding = {
  partner1: "Dulanji",
  partner2: "Nadeesha",
  monogram: ["D", "N"] as const,

  // Public address of the site, used for guest links and link previews.
  // Leave empty to use whatever domain the admin page is opened on.
  baseUrl: "",

  eventName: "Wedding Registration Ceremony",
  dateShort: "03 . 12 . 26",
  dateLong: "03 December 2026",
  start: "2026-12-03T09:30:00+05:30",
  end: "2026-12-03T14:30:00+05:30",

  parents: [
    { label: "Parents of Dulanji", names: "Mr. & Mrs. [Parents' Names]" },
    { label: "Parents of Nadeesha", names: "Mr. & Mrs. [Parents' Names]" },
  ],

  venue: {
    name: "Colombo Court Hotel",
    area: "Colombo 03",
    address: "Colombo 03, Sri Lanka",
    mapQuery: "Colombo Court Hotel, Colombo 03, Sri Lanka",
  },

  events: [
    { title: "Registration", time: "From 9:30 AM", icon: "rings", lines: ["Colombo Court Hotel", "Colombo 03"] },
    { title: "Celebration", time: "11:00 AM", icon: "glass", lines: ["Colombo Court Hotel", "A toast to love & lunch together"] },
  ],

  agenda: [
    { time: "9:30 AM", title: "Arrival & Settle In" },
    { time: "10:10 AM", title: "Marriage Registration" },
    { time: "10:45 AM", title: "Bar Opens" },
    { time: "11:00 AM", title: "Toast to Love" },
    { time: "12:00 PM", title: "Lunch Served" },
    { time: "2:30 PM", title: "Farewell & Wrap Up" },
  ],

  contacts: [
    { label: "Dulanji · 076 198 419", href: "tel:076198419", whatsapp: false },
    { label: "Nadeesha · +371 28 397 103 (WhatsApp)", href: "https://wa.me/37128397103", whatsapp: true },
  ],

  maxGuests: 6,
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=14&output=embed";
