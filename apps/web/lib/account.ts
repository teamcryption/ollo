'use client';
// Account state for the sign-in, onboarding, checkout and account screens (Figma "Website Screens",
// sections "Sign in, sign up and verification" … "Account, plan and billing").
//
// Stand-in until accounts and payments go live: everything is kept in this browser only
// (localStorage "ollo-account"). No password or card detail is ever stored or sent anywhere.
// When the auth provider and payment checkout are connected, replace the actions below with
// their calls; the screens only use this module.
//
// Pricing (Figma landing v1, "Pay once. Keep it forever."): no subscription.
//   Free      $0
//   Pro       $49 once (was $79): every style and type, plus the next 12 weekly batches (3 months)
//   Lifetime  $99 once (was $149): everything in Pro, every weekly batch forever, up to 5 people
import { useEffect, useState } from 'react';

export type Plan = 'free' | 'pro' | 'lifetime';
export type PaidPlan = Exclude<Plan, 'free'>;
export type Role = 'designer' | 'developer' | 'marketing' | 'founder' | 'student';
export type Use = 'website' | 'figma' | 'code' | 'slides';

export type Account = {
  name: string;
  email: string;
  verified: boolean;
  plan: Plan;
  /** ISO date the plan was bought */
  purchased?: string;
  /** ISO date new weekly batches stop (Pro). Lifetime: none (forever). */
  batchesUntil?: string;
  role?: Role;
  uses: Use[];
  onboarded: boolean;
  figma?: { connected: string };
  invoices: { date: string; label: string; amount: number }[];
};

/** USD, paid once. `was` is the price after the launch offer ends. */
export const PRICE: Record<PaidPlan, { now: number; was: number }> = {
  pro: { now: 49, was: 79 },
  lifetime: { now: 99, was: 149 },
};
export const PLAN_NAME: Record<Plan, string> = { free: 'Free', pro: 'Pro', lifetime: 'Lifetime' };
export const offPercent = (p: PaidPlan) => Math.round((1 - PRICE[p].now / PRICE[p].was) * 100);
/** Pro includes this many weekly batches after purchase. */
export const PRO_BATCHES = 12;

const KEY = 'ollo-account';
const listeners = new Set<(a: Account | null) => void>();
let current: Account | null = null;
let loaded = false;

function read(): Account | null {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (v && typeof v.email === 'string') {
        // Accounts saved before pay-once pricing had plan 'pro' with a renewal date: keep them on Pro.
        const plan: Plan = v.plan === 'lifetime' ? 'lifetime' : v.plan === 'pro' ? 'pro' : 'free';
        current = { uses: [], invoices: [], ...v, plan };
      } else current = null;
    } catch {
      current = null;
    }
  }
  return current;
}

function write(next: Account | null) {
  current = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((f) => f(next));
}

const patch = (p: Partial<Account>) => {
  const a = read();
  if (a) write({ ...a, ...p });
};

export function useAccount() {
  const [a, setA] = useState<Account | null>(null);
  useEffect(() => {
    setA(read());
    listeners.add(setA);
    return () => {
      listeners.delete(setA);
    };
  }, []);
  return a;
}
export const getAccount = read;

const iso = (d: Date) => d.toISOString().slice(0, 10);
export const longDate = (s: string) =>
  new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
/** Date new batches stop for a Pro bought today. */
export const proBatchesEnd = (from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + PRO_BATCHES * 7);
  return d;
};
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('') || 'You';
export const firstName = (a: Account | null) => a?.name.split(/\s+/)[0] || 'there';
/** Upgrade price from Pro to Lifetime: the difference. */
export const lifetimeUpgrade = () => PRICE.lifetime.now - PRICE.pro.now;

export const account = {
  /** New account, waiting for the 6-digit email code. */
  signUp(name: string, email: string) {
    write({ name, email, verified: false, plan: 'free', uses: [], onboarded: false, invoices: [] });
  },
  verify() {
    patch({ verified: true });
  },
  signIn(email: string) {
    const a = read();
    if (a && a.email.toLowerCase() === email.toLowerCase()) write({ ...a, verified: true });
    else write({ name: email.split('@')[0], email, verified: true, plan: 'free', uses: [], onboarded: true, invoices: [] });
  },
  signOut() {
    write(null);
  },
  answers(p: { role?: Role; uses?: Use[] }) {
    patch(p);
  },
  finishOnboarding() {
    patch({ onboarded: true });
  },
  /** Paid plan after a successful checkout (pay once). Pro → Lifetime charges the difference. */
  buy(plan: PaidPlan) {
    const a = read();
    if (!a) return;
    const upgrade = a.plan === 'pro' && plan === 'lifetime';
    const amount = upgrade ? lifetimeUpgrade() : PRICE[plan].now;
    const today = new Date();
    write({
      ...a,
      plan,
      purchased: iso(today),
      batchesUntil: plan === 'pro' ? iso(proBatchesEnd(today)) : undefined,
      onboarded: true,
      invoices: [{ date: iso(today), label: upgrade ? 'ollo Lifetime · upgrade from Pro' : `ollo ${PLAN_NAME[plan]} · one-time`, amount }, ...a.invoices],
    });
  },
  connectFigma() {
    patch({ figma: { connected: iso(new Date()) } });
  },
  disconnectFigma() {
    patch({ figma: undefined });
  },
};
