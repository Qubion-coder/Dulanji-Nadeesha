import { wedding } from "@/lib/wedding";

// Forwards RSVP submissions to the Google Apps Script web app that writes them to the sheet.
export async function POST(req: Request) {
  const url = process.env.RSVP_SCRIPT_URL || wedding.rsvpScriptUrl;
  if (!url) return Response.json({ ok: false, error: "RSVP is not configured." }, { status: 500 });

  let body: { name?: string; attending?: string; guests?: number; invitedAs?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.name?.trim() || (body.attending !== "yes" && body.attending !== "no")) {
    return Response.json({ ok: false, error: "Name and attendance are required." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow",
    });
    const result = await res.json();
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: "Could not reach the RSVP sheet." }, { status: 502 });
  }
}
