"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function remaining(target: number) {
  const t = Math.floor(Math.max(0, target - Date.now()) / 1000);
  return [Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60];
}

const labels = ["Days", "Hours", "Minutes", "Seconds"];

export default function Countdown({ to }: { to: string }) {
  // Start at zeros so server and client markup match, then tick on the client
  const [parts, setParts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const target = new Date(to).getTime();
    setParts(remaining(target));
    const id = setInterval(() => setParts(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [to]);

  return (
    <div className="timer">
      {parts.map((value, i) => (
        <div className="unit" key={labels[i]}>
          <div>
            <span className="num">{pad(value)}</span>
            <span className="lbl">{labels[i]}</span>
          </div>
          {i < parts.length - 1 && <span className="colon">:</span>}
        </div>
      ))}
    </div>
  );
}
