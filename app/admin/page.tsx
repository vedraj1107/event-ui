"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, EventT, fmt } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

const empty = { title: "", description: "", date: "", venue: "", capacity: "", category: "Tech" };
const toLocal = (iso: string) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function Admin() {
  const { user, ready } = useAuth();
  const [events, setEvents] = useState<EventT[]>([]);
  const [stats, setStats] = useState<{ users: number; events: number; registrations: number } | null>(null);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setEvents(await api<EventT[]>("/api/events"));
    setStats(await api("/api/admin/stats"));
  }, []);

  useEffect(() => { if (user?.role === "ADMIN") load(); }, [user, load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const body = JSON.stringify({ ...f, date: new Date(f.date).toISOString(), capacity: Number(f.capacity) });
      if (editId) await api(`/api/events/${editId}`, { method: "PUT", body });
      else await api("/api/events", { method: "POST", body });
      setF(empty); setEditId(null);
      load();
    } catch (e) { setMsg((e as Error).message); }
  }

  async function remove(id: number) {
    if (!confirm("Delete this event?")) return;
    await api(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  function edit(ev: EventT) {
    setEditId(ev.id);
    setF({ title: ev.title, description: ev.description, date: toLocal(ev.date), venue: ev.venue, capacity: String(ev.capacity), category: ev.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!ready) return null;
  if (user?.role !== "ADMIN") return <p>Admin only. <Link href="/login" className="text-blue-600">Login</Link></p>;

  const input = "w-full rounded border px-3 py-2";
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      {stats && (
        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="rounded-lg border bg-white p-3">
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-sm capitalize text-gray-600">{k}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={save} className="mb-8 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">{editId ? "Edit event" : "Create event"}</h2>
        <input className={input} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <select className={input} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
          {["Tech", "Workshop", "Hackathon", "Social", "Talk"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className={input} type="datetime-local" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} required />
        <input className={input} placeholder="Venue" value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} required />
        <input className={input} type="number" min={1} placeholder="Capacity" value={f.capacity} onChange={(e) => setF({ ...f, capacity: e.target.value })} required />
        <textarea className={`${input} sm:col-span-2`} placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} required />
        {msg && <p className="text-sm text-red-600 sm:col-span-2">{msg}</p>}
        <div className="flex gap-2 sm:col-span-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white">{editId ? "Update" : "Create"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setF(empty); }} className="rounded border px-4 py-2">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-4">
            <div>
              <p className="font-semibold">{ev.title}</p>
              <p className="text-sm text-gray-600">{fmt(ev.date)} · {ev._count.regs}/{ev.capacity} registered</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(ev)} className="rounded border px-3 py-1 text-sm">Edit</button>
              <button onClick={() => remove(ev.id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}