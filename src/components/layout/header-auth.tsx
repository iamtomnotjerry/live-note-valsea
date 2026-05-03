"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function userInitials(user: User): string {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const fromName = (meta.full_name ?? meta.name ?? "").trim();
  if (fromName) {
    const parts = fromName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (
        parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
      ).toUpperCase();
    }
    return fromName.slice(0, 2).toUpperCase();
  }
  const em = user.email?.trim();
  if (em) return em.slice(0, 2).toUpperCase();
  return "?";
}

function avatarUrl(user: User): string | undefined {
  const meta = user.user_metadata as Record<string, string | undefined>;
  return meta.avatar_url ?? meta.picture;
}

type HeaderAuthProps = {
  headerTone?: "default" | "landing";
};

export function HeaderAuth({ headerTone = "default" }: HeaderAuthProps) {
  const neo = headerTone === "landing";
  const t = useTranslations("Header");
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let sub: { unsubscribe: () => void } | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        setUser(session?.user ?? null);
        setReady(true);
      });
      const { data } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null);
        setReady(true);
      });
      sub = data.subscription;
    } catch {
      queueMicrotask(() => {
        if (cancelled) return;
        setUser(null);
        setReady(true);
      });
    }

    return () => {
      cancelled = true;
      sub?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(ev: PointerEvent) {
      if (wrapRef.current?.contains(ev.target as Node)) return;
      setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const signOut = useCallback(async () => {
    setMenuOpen(false);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    router.refresh();
  }, [router]);

  if (!ready) {
    return (
      <span
        className={cn(
          "inline-block h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--muted)]",
          neo &&
            "border-2 border-[var(--neo-ink)] bg-[var(--surface)] shadow-[3px_3px_0_0_var(--neo-raised)]",
        )}
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          "cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)]",
          neo &&
            "neo-btn neo-btn--ghost rounded-full !px-3 !py-1.5 text-xs font-extrabold no-underline",
        )}
      >
        {t("login")}
      </Link>
    );
  }

  const url = avatarUrl(user);
  const label = user.email ?? userInitials(user);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        className={cn(
          "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--foreground)] shadow-sm outline-none transition-colors hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          neo &&
            "border-2 border-[var(--neo-ink)] shadow-[3px_3px_0_0_var(--neo-raised)] hover:bg-[var(--surface)]",
        )}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-label={t("accountOpenAria")}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {url ? (
          // Google avatar — external URL; skip next/image to avoid remotePatterns churn.
          // eslint-disable-next-line @next/next/no-img-element -- OAuth provider URL
          <img
            src={url}
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span aria-hidden>{userInitials(user)}</span>
        )}
      </button>
      {menuOpen ? (
        <div
          className={cn(
            "absolute right-0 top-[calc(100%+6px)] z-[60] min-w-[12.5rem] rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1.5 text-left shadow-lg",
            neo &&
              "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
          )}
          role="menu"
        >
          <p className="max-w-[14rem] truncate px-3 py-2 text-xs text-[var(--muted-fg)]">
            {label}
          </p>
          <Link
            href="/profile"
            role="menuitem"
            className={cn(
              buttonClassName(
                "ghost",
                "block w-full justify-start rounded-none px-3 py-2 text-xs font-bold no-underline",
              ),
              neo &&
                "hover:bg-[color-mix(in_srgb,var(--landing-sky)_18%,transparent)]",
            )}
            onClick={() => setMenuOpen(false)}
          >
            {t("profile")}
          </Link>
          <div
            className={cn(
              "border-t border-[var(--border)] pt-1",
              neo && "border-[var(--neo-ink)]",
            )}
          >
            <button
              type="button"
              role="menuitem"
              className={cn(
                buttonClassName(
                  "ghost",
                  "w-full justify-start rounded-none px-3 py-2 text-xs font-bold",
                ),
                neo &&
                  "hover:bg-[color-mix(in_srgb,var(--landing-sky)_18%,transparent)]",
              )}
              onClick={() => void signOut()}
            >
              {t("signOut")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
