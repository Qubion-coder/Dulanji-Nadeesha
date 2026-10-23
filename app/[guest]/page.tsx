import type { Metadata } from "next";
import Invitation from "@/components/Invitation";
import { guestFromParam } from "@/lib/guest";
import { coupleNames, wedding } from "@/lib/wedding";

type Props = { params: Promise<{ guest: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guest = guestFromParam((await params).guest);
  return {
    title: `${coupleNames} · Invitation for ${guest}`,
    openGraph: {
      title: `${guest}, you're invited · ${coupleNames}`,
      description: `${wedding.eventName} · ${wedding.dateLong} · ${wedding.venue.name}`,
    },
    robots: { index: false },
  };
}

export default async function GuestInvitation({ params }: Props) {
  const guest = guestFromParam((await params).guest);
  return <Invitation guest={guest} />;
}
