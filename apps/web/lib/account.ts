'use client';
// Account state for the sign-in, onboarding, checkout and account screens (Figma "Website Screens",
// sections "Sign in, sign up and verification" … "Account, plan and billing").
//
// Stand-in until accounts and payments go live: everything is kept in this browser only
// (localStorage "ollo-account"). No password or card detail is ever stored or sent anywhere.
// When the auth provider and payment checkout are connected, replace the actions below with
// their calls; the screens only use this module.
import { useEffect, useState } from 'react';

export type Plan = 'free' | 'pro';
export type Billing = 'monthly' | 'yearly';
export type Role = 'designer' | 'developer' | 'marketing' | 'founder' | 'student';
export type Use = 'website' | 'figma' | 'code' | 'slides';

export type Account = {
  name: string;
  email: string;
  verified: boolean;
  plan: Plan;
  billing: Billing;
  /** ISO date of the next renewal while on Pro */
  renews?: string;
  role?: Role;
  uses: Use[];
  onboarded: boolean;
  figma?: { connected: string };
  invoices: { date: string; label: string; amount: number }[];
};

export const PRICE: Record<Billing, number> = { monthly: 8, yearly: 72 }; // USD, yearly = 2 months free

const KEY = 'ollo-account';
const listeners = new Set<(a: Account | null) => void>();
let current: Account | null = null;
let loaded = false;

function read(): Account | null {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      current = v && typeof v.email === 'string' ? { uses: [], invoices: [], ...v } : null;
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

const today = () => new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
export const longDate = (s: string) =>
  new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('') || 'You';
export const firstName = (a: Account | null) => a?.name.split(/\s+/)[0] || 'there';

export const account = {
  /** New account, waiting for the 6-digit email code. */
  signUp(name: string, email: string) {
    write({ name, email, verified: false, plan: 'free', billing: 'yearly', uses: [], onboarded: false, invoices: [] });
  },
  verify() {
    patch({ verified: true });
  },
  signIn(email: string) {
    const a = read();
    if (a && a.email.toLowerCase() === email.toLowerCase()) write({ ...a, verified: true });
    else write({ name: email.split('@')[0], email, verified: true, plan: 'free', billing: 'yearly', uses: [], onboarded: true, invoices: [] });
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
  /** Pro after a successful checkout. */
  upgrade(billing: Billing) {
    const a = read();
    if (!a) return;
    const renews = today();
    if (billing === 'yearly') renews.setFullYear(renews.getFullYear() + 1);
    else renews.setMonth(renews.getMonth() + 1);
    write({
      ...a,
      plan: 'pro',
      billing,
      renews: iso(renews),
      onboarded: true,
      invoices: [{ date: iso(today()), label: `ollo Pro · ${billing === 'yearly' ? 'Yearly' : 'Monthly'}`, amount: PRICE[billing] }, ...a.invoices],
    });
  },
  switchBilling(billing: Billing) {
    patch({ billing });
  },
  cancel() {
    patch({ plan: 'free', renews: undefined });
  },
  connectFigma() {
    patch({ figma: { connected: iso(today()) } });
  },
  disconnectFigma() {
    patch({ figma: undefined });
  },
};
