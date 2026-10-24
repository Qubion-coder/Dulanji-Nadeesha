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
    // Fill in names like "Mr. & Mrs. Sunil Perera"; entries left empty are hidden on the site
    { label: "Parents of Dulanji", names: "" },
    { label: "Parents of Nadeesha", names: "" },
  ],

  venue: {
    name: "Colombo Court Hotel",
    area: "Colombo 03",
    address: "Colombo 03, Sri Lanka",
    mapQuery: "Colombo Court Hotel, Colombo 03, Sri Lanka",
  },

  // Order of the day, shown as cards in the Details section
  events: [
    { title: "Arrival & Settle In", time: "9:30 AM", icon: "pin", note: "Colombo Court Hotel, Colombo 03" },
    { title: "Marriage Registration", time: "10:10 AM", icon: "rings", note: "The signing of our marriage" },
    { title: "Bar Opens", time: "10:45 AM", icon: "glass", note: "Drinks & mingling" },
    { title: "Toast to Love", time: "11:00 AM", icon: "heart", note: "Raise a glass with us" },
    { title: "Lunch Served", time: "12:00 PM", icon: "utensils", note: "Lunch together" },
    { title: "Farewell & Wrap Up", time: "2:30 PM", icon: "sparkle", note: "Thank you for celebrating with us" },
  ],

  contacts: [
    { label: "Dulanji · 076 198 419", href: "tel:076198419", whatsapp: false },
    { label: "Nadeesha · +371 28 397 103 (WhatsApp)", href: "https://wa.me/37128397103", whatsapp: true },
  ],

  maxGuests: 6,

  // Google Apps Script web app that saves RSVPs to the sheet (google-apps-script/Code.gs).
  // The RSVP_SCRIPT_URL environment variable overrides this.
  rsvpScriptUrl: "https://script.google.com/macros/s/AKfycbyRO7fzMXAzLATvuyPd_ys-dT7sZ1fVfItE2CuR0xtClqXkNgTvh47The8I8xenmFPDbg/exec",
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=14&output=embed";
