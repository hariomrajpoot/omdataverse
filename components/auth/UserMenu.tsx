"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, LogOut, Palette, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type AuthUser } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

function displayName(user: AuthUser): string {
  const first = user.profile?.firstName?.trim();
  const last = user.profile?.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return user.email.split("@")[0];
}

function initials(user: AuthUser): string {
  const first = user.profile?.firstName?.trim();
  const last = user.profile?.lastName?.trim();
  if (first || last) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "U";
  }
  return user.email.slice(0, 2).toUpperCase();
}

// Renders the uploaded profile image when present, otherwise initials.
function Avatar({ user, className }: { user: AuthUser; className?: string }) {
  const url = user.profile?.avatarUrl;
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className={cn("h-9 w-9 shrink-0 rounded-full object-cover", className)} />
    );
  }
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-accent to-indigo-600 text-xs font-semibold text-white",
        className,
      )}
    >
      {initials(user)}
    </span>
  );
}

/** Avatar + dropdown menu shown in the navbar when a user is signed in. */
export function UserMenu({ user }: { user: AuthUser }) {
  const { logout } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-brand-fg/80 transition-colors hover:bg-brand-surface hover:text-brand-fg focus-visible:outline-none focus-visible:bg-brand-surface";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        <Avatar user={user} className="ring-2 ring-brand-bg" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-brand-border/60 bg-brand-bg p-1.5 shadow-lg shadow-black/10"
          >
            <div className="flex items-center gap-3 border-b border-brand-border/50 px-2.5 pb-2.5 pt-1.5">
              <Avatar user={user} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-brand-fg">
                  {displayName(user)}
                </div>
                <div className="truncate text-xs text-brand-fg/60">{user.email}</div>
              </div>
            </div>

            <div className="py-1">
              <Link href="/account" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <User className="h-4 w-4" />
                Profile &amp; settings
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" />
                  Admin dashboard
                </Link>
              )}
            </div>

            {/* Theme toggle lives here in the profile popup */}
            <div className="flex items-center justify-between border-t border-brand-border/50 px-2.5 py-1.5">
              <span className="flex items-center gap-2.5 text-sm text-brand-fg/80">
                <Palette className="h-4 w-4" />
                Theme
              </span>
              <ThemeToggle />
            </div>

            <div className="border-t border-brand-border/50 pt-1">
              <button
                type="button"
                role="menuitem"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
                className={cn(itemClass, "text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40")}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
