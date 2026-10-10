"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, EventT, fmt } from "@/lib/api";

const CATS = ["All", "Tech", "Workshop", "Hackathon", "Social", "Talk"];

export default function Home() {
  const [events, setEvents] = useState<EventT[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (cat !== "All") p.set("category", cat);
      try { setEvents(await api<EventT[]>(`/api/events?${p}`)); } catch {}
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q, cat]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Discover Events</h1>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events..."
          className="flex-1 rounded border bg-white px-3 py-2"
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded border bg-white px-3 py-2">
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <p>Loading...</p> : events.length === 0 ? <p>No events found.</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => {
            const left = e.capacity - e._count.regs;
            return (
              <Link key={e.id} href={`/events/${e.id}`} className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{e.category}</span>
                <h2 className="mt-2 font-semibold">{e.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{fmt(e.date)}</p>
                <p className="text-sm text-gray-600">{e.venue}</p>
                <p className={`mt-2 text-sm font-medium ${left <= 0 ? "text-red-600" : "text-green-600"}`}>
                  {left <= 0 ? "Full" : `${left} seats left`}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}