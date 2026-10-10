"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth, User } from "@/components/AuthProvider";

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const body = mode === "login" ? { email: f.email, password: f.password } : f;
      const d = await api<{ token: string; user: User }>(`/api/auth/${mode}`, {
        method: "POST", body: JSON.stringify(body),
      });
      setAuth(d.token, d.user);
      router.push("/");
    } catch (e) { setErr((e as Error).message); }
  }

  const input = "w-full rounded border px-3 py-2";
  return (
    <div className="mx-auto max-w-sm rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">{mode === "login" ? "Login" : "Create account"}</h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input className={input} placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        )}
        <input className={input} type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input className={input} type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded bg-blue-600 py-2 text-white">{mode === "login" ? "Login" : "Sign up"}</button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 text-sm text-blue-600">
        {mode === "login" ? "New here? Create an account" : "Have an account? Login"}
      </button>
    </div>
  );
}