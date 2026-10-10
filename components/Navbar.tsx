"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold">EventHub</Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/">Events</Link>
          {user && <Link href="/my-events">My Events</Link>}
          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
          {user ? (
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="rounded bg-gray-900 px-3 py-1 text-white"
            >
              Logout ({user.name})
            </button>
          ) : (
            <Link href="/login" className="rounded bg-blue-600 px-3 py-1 text-white">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}