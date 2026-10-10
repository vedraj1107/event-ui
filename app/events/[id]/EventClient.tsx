"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, EventT, RegT, fmt } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [ev, setEv] = useState<EventT | null>(null);
  const [registered, setRegistered] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setEv(await api<EventT>(`/api/events/${id}`));
      if (user) {
        const regs = await api<RegT[]>("/api/me/registrations");
        setRegistered(regs.some((r) => r.eventId === Number(id)));
      }
    } catch (e) { setMsg((e as Error).message); }
  }, [id, user]);

  useEffect(() => { load(); }, [load]);

  async function toggle() {
    if (!user) return setMsg("Please login first.");
    setBusy(true); setMsg("");
    try {
      await api(`/api/events/${id}/register`, { method: registered ? "DELETE" : "POST" });
      setMsg(registered ? "Unregistered." : "Registered successfully!");
      await load();
    } catch (e) { setMsg((e as Error).message); }
    setBusy(false);
  }

  if (!ev) return <p>{msg || "Loading..."}</p>;
  const left = ev.capacity - ev._count.regs;

  return (
    <div className="rounded-lg border bg-white p-6">
      <Link href="/" className="text-sm text-blue-600">← Back</Link>
      <span className="ml-3 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{ev.category}</span>
      <h1 className="mt-3 text-2xl font-bold">{ev.title}</h1>
      <p className="mt-3 text-gray-700">{ev.description}</p>
      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <p><b>When:</b> {fmt(ev.date)}</p>
        <p><b>Where:</b> {ev.venue}</p>
        <p><b>Seats:</b> {ev._count.regs} / {ev.capacity} registered</p>
      </div>
      <button
        onClick={toggle}
        disabled={busy || (!registered && left <= 0)}
        className={`mt-5 rounded px-4 py-2 text-white disabled:opacity-50 ${registered ? "bg-red-600" : "bg-blue-600"}`}
      >
        {registered ? "Unregister" : left <= 0 ? "Event Full" : "Register"}
      </button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}