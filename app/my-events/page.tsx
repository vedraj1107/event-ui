"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, RegT, fmt } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function MyEvents() {
  const { user, ready } = useAuth();
  const [regs, setRegs] = useState<RegT[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try { setRegs(await api<RegT[]>("/api/me/registrations")); }
    catch (e) { setMsg((e as Error).message); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  async function unregister(eventId: number) {
    await api(`/api/events/${eventId}/register`, { method: "DELETE" });
    load();
  }

  if (!ready) return null;
  if (!user) return <p>Please <Link href="/login" className="text-blue-600">login</Link> to see your events.</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Registrations</h1>
      {msg && <p>{msg}</p>}
      {regs.length === 0 ? <p>You have not registered for any event.</p> : (
        <div className="space-y-3">
          {regs.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border bg-white p-4">
              <div>
                <Link href={`/events/${r.eventId}`} className="font-semibold">{r.event.title}</Link>
                <p className="text-sm text-gray-600">{fmt(r.event.date)} · {r.event.venue}</p>
              </div>
              <button onClick={() => unregister(r.eventId)} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
                Unregister
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}