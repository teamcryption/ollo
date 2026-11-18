'use client';
// Sign in, sign up, onboarding, checkout and account screens, built from the approved Figma frames
// (file NqyRMhIekr7P5eCV0kvX4m, page "Website Screens", sections at x ≥ 7000) and the Design System
// board "03 Account & onboarding": Text Field, Checkbox, Divider/Or, OTP Box, Step Progress,
// Choice Card, Plan Card and Auth Showcase.
//
// Views are URL hashes (like #subscribe) so they also work on the published preview page and inside
// the Figma plugin. Account data comes from lib/account.ts (browser-only until accounts go live).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  account,
  firstName,
  initials,
  lifetimeUpgrade,
  longDate,
  offPercent,
  PLAN_NAME,
  PRICE,
  proBatchesEnd,
  useAccount,
  type PaidPlan,
  type Plan,
  type Role,
  type Use,
} from '@/lib/account';
import { PriceCards, type PlanAction } from './Pricing';
import { fmt, loadIcons, loadIllustrations, loadIndex, type IconStyle } from '@/lib/data';
import { IN_FIGMA } from '@/lib/figma';
import { illustrationSvg } from '@/lib/illustration';
import type { Theme } from '@/lib/hooks';
import { Logo } from './Logo';
import { LibIcon, useLibraryIcons } from '@/lib/libraryIcons';
import { UiIcon, type UiIconName } from './ui-icons';

export const ACCOUNT_VIEWS = [
  'signin',
  'signup',
  'verify',
  'forgot',
  'reset',
  'welcome',
  'setup-role',
  'setup-use',
  'setup-plan',
  'checkout',
  'done',
  'account',
  'connect-figma',
] as const;
export type AccountView = (typeof ACCOUNT_VIEWS)[number];
export const isAccountView = (h: string): h is AccountView => (ACCOUNT_VIEWS as readonly string[]).includes(h);

/** Go to a view (#hash) or back to the library (''). */
export function go(view: AccountView | 'library' | 'home') {
  location.hash = view;
}
const hashParam = (k: string) => new URLSearchParams(location.hash.split('?')[1] ?? '').get(k);

type Props = {
  view: AccountView;
  theme: Theme;
  iconCount: number;
  illustrationCount: number;
  onToast: (t: string) => void;
};

export function AccountScreens(p: Props) {
  const a = useAccount();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [p.view]);
  if (IN_FIGMA && (p.view === 'signin' || p.view === 'signup')) return <PluginSignIn />;
  switch (p.view) {
    case 'signin':
      return <SignIn {...p} />;
    case 'signup':
      return <SignUp {...p} />;
    case 'verify':
      return <Verify {...p} email={a?.email} />;
    case 'forgot':
      return <Forgot {...p} />;
    case 'reset':
      return <Reset {...p} />;
    case 'welcome':
      return <Welcome {...p} />;
    case 'setup-role':
      return <SetupRole />;
    case 'setup-use':
      return <SetupUse />;
    case 'setup-plan':
      return <SetupPlan />;
    case 'checkout':
      return <Checkout {...p} />;
    case 'done':
      return <Done />;
    case 'connect-figma':
      return <ConnectFigma {...p} />;
    case 'account':
      return <AccountBilling {...p} />;
  }
}

/* ------------------------------------------------------------------ DS pieces */

function Field({
  label,
  helper,
  error,
  ...input
}: { label: string; helper?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field${error ? ' is-error' : ''}`}>
      <span className="field-label">{label}</span>
      <input className="field-input" aria-invalid={!!error || undefined} {...input} />
      {(error || helper) && <span className="field-help">{error || helper}</span>}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="checkbox-box" aria-hidden="true">
        <UiIcon name="check" size={14} strokeWidth={2.25} />
      </span>
      {label}
    </label>
  );
}

const OrDivider = ({ label }: { label: string }) => (
  <div className="or-divider" role="separator">
    <span>{label}</span>
  </div>
);

function Steps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="steps" aria-label={`Step ${step} of 3`}>
      <span className="steps-label">STEP {step} OF 3</span>
      <span className="steps-bars" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= step ? 'is-done' : undefined} />
        ))}
      </span>
    </div>
  );
}

function ChoiceCard({
  title,
  desc,
  icon,
  selected,
  multi,
  onClick,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`choice${multi ? ' is-multi' : ''}`}
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onClick}
    >
      <span className="choice-icon">{icon}</span>
      <span className="choice-text">
        <span className="choice-title">{title}</span>
        <span className="choice-desc">{desc}</span>
      </span>
      <span className="choice-mark" aria-hidden="true">
        {multi && selected && <UiIcon name="check" size={14} strokeWidth={2.25} />}
      </span>
    </button>
  );
}

export const GoogleMark = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);
export const FigmaMark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-9.5 0 57 57" aria-hidden="true">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
  </svg>
);
const LockMark = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6.5 10.5h11a2 2 0 0 1 2 2V18a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 18v-5.5a2 2 0 0 1 2-2Z" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
  </svg>
);

const Tile = ({ children, brand }: { children: ReactNode; brand?: boolean }) => (
  <span className={`icon-chip${brand ? ' is-brand' : ''}`}>{children}</span>
);
const Ic = ({ name, size = 20 }: { name: UiIconName; size?: number }) => <UiIcon name={name} size={size} />;

/* ------------------------------------------------------------------ layouts */

function AuthShowcase({ theme, iconCount, illustrationCount }: Pick<Props, 'theme' | 'iconCount' | 'illustrationCount'>) {
  const cells: [string, IconStyle, string?][] = [
    ['home', 'regular'],
    ['bell', 'regular'],
    ['heart', 'fill', 'brand'],
    ['search', 'light'],
    ['user', 'bold'],
    ['mail', 'bold'],
    ['lock', 'regular', 'copied'],
    ['folder', 'fill'],
    ['calendar', 'regular'],
    ['chat', 'bold'],
    ['heart', 'light'],
    ['user', 'fill'],
  ];
  const svgs = useLibraryIcons(cells.map(([n, s]) => [n, s]));
  const [ill, setIll] = useState('');
  useEffect(() => {
    loadIllustrations().then((list) => {
      const item = list.find((i) => i.n === 'server-stack') ?? list[0];
      if (item) setIll(illustrationSvg(item, { type: 'stroke', theme, colour: null, background: 'white' }));
    });
  }, [theme]);
  return (
    <aside className="auth-showcase only-desktop" aria-hidden="true">
      <div className="mosaic">
        <span className="mosaic-ill" dangerouslySetInnerHTML={{ __html: ill }} />
        {cells.map(([n, s, mode], i) => (
          <span key={i} className={`mosaic-tile${mode ? ` is-${mode}` : ''}`}>
            <LibIcon svg={svgs[`${n}:${s}`]} />
          </span>
        ))}
        <span className="toast mosaic-toast">
          <span className="toast-ok">
            <UiIcon name="check" size={16} strokeWidth={2} />
          </span>
          SVG copied to clipboard
        </span>
      </div>
      <div className="showcase-copy">
        <h2>Every icon and illustration, one click from Figma.</h2>
        <p>
          {fmt(iconCount || 80000)}+ icons in five styles and {fmt(illustrationCount || 3240)} isometric illustrations, still
          or animated. Copy SVG, export Lottie, or drop components straight onto your canvas.
        </p>
        <div className="showcase-stats">
          {[
            [`${Math.floor((iconCount || 80000) / 1000)}k+`, 'icons'],
            [fmt(illustrationCount || 3240), 'illustrations'],
            ['5', 'icon styles'],
            ['Weekly', 'new batches'],
          ].map(([a, b]) => (
            <span key={b}>
              <b>{a}</b>
              {b}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AuthLayout({
  children,
  switchText,
  switchLabel,
  onSwitch,
  ...show
}: { children: ReactNode; switchText?: string; switchLabel: string; onSwitch: () => void } & Pick<
  Props,
  'theme' | 'iconCount' | 'illustrationCount'
>) {
  return (
    <div className="auth">
      <div className="auth-col">
        <div className="auth-top">
          <a href="#" className="logo-link" aria-label="ollo home" onClick={(e) => (e.preventDefault(), go('library'))}>
            <Logo />
          </a>
          <div className="auth-switch">
            {switchText && <span className="only-wide">{switchText}</span>}
            <button className="btn btn-outline btn-sm" onClick={onSwitch}>
              {switchLabel}
            </button>
          </div>
        </div>
        <main className="auth-form" id="main">
          {children}
        </main>
        <footer className="auth-foot">
          <span>© {new Date().getFullYear()} ollo</span>
          <span className="auth-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#help">Help</a>
          </span>
        </footer>
      </div>
      <AuthShowcase {...show} />
    </div>
  );
}

function FlowLayout({
  children,
  right,
  wide,
  center,
}: {
  children: ReactNode;
  right?: ReactNode;
  wide?: 'plan' | 'checkout' | 'pricing';
  center?: boolean;
}) {
  return (
    <div className="flow">
      <div className="flow-top">
        <a href="#" className="logo-link" aria-label="ollo home" onClick={(e) => (e.preventDefault(), go('library'))}>
          <Logo />
        </a>
        <div className="flow-actions">{right}</div>
      </div>
      <main className={`flow-body${center ? ' is-center' : ''}`} id="main">
        <div className={`flow-col${wide ? ` is-${wide}` : ''}`}>{children}</div>
      </main>
    </div>
  );
}

const Heading = ({ title, sub, center }: { title: string; sub?: ReactNode; center?: boolean }) => (
  <div className={`flow-heading${center ? ' is-center' : ''}`}>
    <h1>{title}</h1>
    {sub && <p>{sub}</p>}
  </div>
);

const Skip = () => (
  <button className="btn btn-ghost btn-sm" onClick={() => (account.finishOnboarding(), go('library'))}>
    Skip for now
  </button>
);

/* ------------------------------------------------------------------ auth */

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function GoogleButton({ label, onToast }: { label: string; onToast: Props['onToast'] }) {
  return (
    <button
      type="button"
      className="btn btn-outline btn-lg btn-block"
      onClick={() => onToast('Google sign-in switches on when accounts go live')}
    >
      <GoogleMark />
      {label}
    </button>
  );
}

function SignIn(p: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keep, setKeep] = useState(true);
  const [tried, setTried] = useState(false);
  const emailErr = tried && !validEmail(email) ? 'Enter the email you signed up with' : undefined;
  const pwErr = tried && !password ? 'Enter your password' : undefined;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!validEmail(email) || !password) return;
    account.signIn(email.trim());
    go('library');
    p.onToast('Signed in');
  };
  return (
    <AuthLayout {...p} switchText="New to ollo?" switchLabel="Create account" onSwitch={() => go('signup')}>
      <Heading title="Welcome back" sub="Sign in to copy, download and sync your icons and illustrations." />
      <GoogleButton label="Continue with Google" onToast={p.onToast} />
      <OrDivider label="or sign in with email" />
      <form className="form-fields" onSubmit={submit} noValidate>
        <Field label="Email" type="email" autoComplete="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} error={emailErr} />
        <Field label="Password" type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} error={pwErr} />
        <div className="form-row">
          <Checkbox label="Keep me signed in" checked={keep} onChange={setKeep} />
          <a className="text-link" href="#forgot">
            Forgot password?
          </a>
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Sign in
        </button>
      </form>
      <p className="form-note">Protected by email verification. We never share your data.</p>
    </AuthLayout>
  );
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return pw ? Math.max(1, s) : 0;
}
const STRENGTH = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function SignUp(p: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [news, setNews] = useState(true);
  const [tried, setTried] = useState(false);
  const errs = {
    name: tried && !name.trim() ? 'Enter your name' : undefined,
    email: tried && !validEmail(email) ? 'Enter a valid email' : undefined,
    password: tried && password.length < 8 ? 'Use at least 8 characters' : undefined,
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!name.trim() || !validEmail(email) || password.length < 8) return;
    account.signUp(name.trim(), email.trim());
    go('verify');
  };
  return (
    <AuthLayout {...p} switchText="Already have an account?" switchLabel="Sign in" onSwitch={() => go('signin')}>
      <Heading title="Create your free account" sub={`${fmt(p.iconCount || 80000)}+ icons and ${fmt(p.illustrationCount || 3240)} illustrations. No card needed.`} />
      <GoogleButton label="Sign up with Google" onToast={p.onToast} />
      <OrDivider label="or use your email" />
      <form className="form-fields" onSubmit={submit} noValidate>
        <Field label="Full name" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} error={errs.name} />
        <Field label="Work email" type="email" autoComplete="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errs.password}
          helper="At least 8 characters, with a number or symbol."
        />
        <Checkbox label="Email me when new icon batches land (weekly)" checked={news} onChange={setNews} />
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Create account
        </button>
      </form>
      <p className="form-note">
        By creating an account you agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
}

function OtpInput({ onChange }: { onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(''));
  useEffect(() => {
    onChange(digits.join(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);
  const put = (from: number, chars: string) => {
    const ds = chars.replace(/D/g, '').slice(0, 6 - from).split('');
    if (!ds.length) return;
    setDigits((cur) => {
      const n = [...cur];
      ds.forEach((d, k) => (n[from + k] = d));
      return n;
    });
    refs.current[Math.min(from + ds.length, 5)]?.focus();
  };
  return (
    <div className="otp" role="group" aria-label="6-digit code">
      {digits.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="otp-box"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1}`}
          autoFocus={i === 0}
          value={v}
          onChange={(e) => {
            const raw = e.target.value.replace(/D/g, '');
            if (!raw) return setDigits((cur) => cur.map((x, k) => (k === i ? '' : x)));
            // A typed digit replaces this box; pasted or autofilled codes spread across the boxes.
            put(i, raw.length > 1 && raw.startsWith(v) ? raw.slice(v.length) : raw);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !v) {
              e.preventDefault();
              setDigits((cur) => cur.map((x, k) => (k === i - 1 ? '' : x)));
              refs.current[i - 1]?.focus();
            }
            if (e.key === 'ArrowLeft') refs.current[i - 1]?.focus();
            if (e.key === 'ArrowRight') refs.current[i + 1]?.focus();
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}

function useCountdown(from: number) {
  const [left, setLeft] = useState(from);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, () => setLeft(from)] as const;
}

function Verify(p: Props & { email?: string }) {
  const [code, setCode] = useState('');
  const [left, restart] = useCountdown(45);
  const full = code.replace(/\s/g, '').length === 6;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!full) return;
    account.verify();
    go('welcome');
  };
  return (
    <AuthLayout {...p} switchLabel="Sign out" onSwitch={() => (account.signOut(), go('library'))}>
      <button className="btn btn-ghost btn-sm back-btn" onClick={() => go('signup')}>
        <UiIcon name="chevron-left" size={18} />
        Back
      </button>
      <Heading title="Check your inbox" sub={<>We sent a 6-digit code to {p.email || 'your email'}. Enter it to verify your email.</>} />
      <form className="form-fields" onSubmit={submit}>
        <OtpInput onChange={setCode} />
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={!full}>
          Verify email
        </button>
      </form>
      <p className="link-row">
        Didn’t get it?{' '}
        {left > 0 ? (
          <span className="text-link is-muted">
            Resend code in 0:{String(left).padStart(2, '0')}
          </span>
        ) : (
          <button className="text-link" onClick={() => (restart(), p.onToast('New code sent'))}>
            Resend code
          </button>
        )}
      </p>
      <div className="tip">
        <UiIcon name="info" size={20} />
        Can’t find it? Check spam or promotions. The code expires in 10 minutes.
      </div>
    </AuthLayout>
  );
}

function Forgot(p: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  return (
    <AuthLayout {...p} switchText="Remembered it?" switchLabel="Sign in" onSwitch={() => go('signin')}>
      <button className="btn btn-ghost btn-sm back-btn" onClick={() => go('signin')}>
        <UiIcon name="chevron-left" size={18} />
        Back to sign in
      </button>
      <Heading
        title={sent ? 'Check your inbox' : 'Reset your password'}
        sub={
          sent
            ? `If ${email.trim()} has an ollo account, a reset link is on its way. It works for 30 minutes.`
            : 'Enter the email on your ollo account and we’ll send you a link to set a new password.'
        }
      />
      {sent ? (
        <>
          <a className="btn btn-primary btn-lg btn-block" href="#reset">
            Open reset link
          </a>
          <p className="link-row">
            Wrong email?{' '}
            <button className="text-link" onClick={() => setSent(false)}>
              Try another
            </button>
          </p>
        </>
      ) : (
        <form
          className="form-fields"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTried(true);
            if (validEmail(email)) setSent(true);
          }}
        >
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={tried && !validEmail(email) ? 'Enter a valid email' : undefined}
          />
          <button className="btn btn-primary btn-lg btn-block" type="submit">
            Send reset link
          </button>
          <p className="link-row">
            Signed up with Google?{' '}
            <button type="button" className="text-link" onClick={() => p.onToast('Google sign-in switches on when accounts go live')}>
              Continue with Google
            </button>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

function Reset(p: Props) {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const s = strength(pw);
  const mismatch = confirm.length > 0 && confirm !== pw;
  const ok = pw.length >= 8 && confirm === pw;
  return (
    <AuthLayout {...p} switchLabel="Sign in" onSwitch={() => go('signin')}>
      <Heading title="Set a new password" sub="Choose a password you don’t use anywhere else. You’ll stay signed in on this device." />
      <form
        className="form-fields"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ok) return;
          go('library');
          p.onToast('Password updated');
        }}
      >
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          helper={pw ? `${STRENGTH[s]}: ${pw.length} characters${/\d/.test(pw) ? ', a number' : ''}${/[^A-Za-z0-9]/.test(pw) ? ', a symbol' : ''}.` : 'At least 8 characters, with a number or symbol.'}
        />
        <Field
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={mismatch ? 'Passwords don’t match yet.' : undefined}
        />
        <div className="meter" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={i <= s ? 'is-on' : undefined} />
          ))}
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={!ok}>
          Update password
        </button>
      </form>
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------ onboarding */

function Welcome(p: Props) {
  const a = useAccount();
  const svgs = useLibraryIcons([
    ['home', 'light'],
    ['bell', 'regular'],
    ['heart', 'fill'],
    ['folder', 'bold'],
    ['chat', 'regular'],
  ]);
  return (
    <FlowLayout
      center
      right={
        <button className="btn btn-ghost btn-sm" onClick={() => (account.signOut(), go('library'))}>
          Sign out
        </button>
      }
    >
      <div className="welcome">
        <div className="welcome-icons" aria-hidden="true">
          {(['home:light', 'bell:regular', 'heart:fill', 'folder:bold', 'chat:regular'] as const).map((k) => (
            <span key={k} className={`mosaic-tile${k === 'heart:fill' ? ' is-brand' : ''}`}>
              <LibIcon svg={svgs[k]} />
            </span>
          ))}
        </div>
        <div className="welcome-head">
          <span className="eyebrow">WELCOME TO OLLO</span>
          <h1>Hi {firstName(a)}, your library is ready</h1>
          <p>
            {fmt(p.iconCount || 80000)}+ icons and {fmt(p.illustrationCount || 3240)} illustrations are unlocked on your Free
            plan. Answer two quick questions and we’ll put what you need first.
          </p>
        </div>
        <ul className="feature-list" role="list">
          {[
            [<Ic key="c" name="copy" />, 'Copy or download in one click', 'SVG, PNG and React code for every icon in Light and Regular.'],
            [<Ic key="p" name="play" />, 'Animated icons and illustrations', 'Export Lottie, .lottie and GIF with Pro.'],
            [<FigmaMark key="f" />, 'Use it inside Figma', 'Insert components with every variant from the ollo plugin.'],
          ].map(([icon, t, d]) => (
            <li key={t as string}>
              <Tile>{icon}</Tile>
              <span>
                <b>{t}</b>
                {d}
              </span>
            </li>
          ))}
        </ul>
        <div className="welcome-actions">
          <button className="btn btn-primary btn-lg" onClick={() => go('setup-role')}>
            Set up my library
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => (account.finishOnboarding(), go('library'))}>
            Skip to the library
          </button>
        </div>
        <p className="form-note">Takes about 20 seconds. You can change answers later in Account.</p>
      </div>
    </FlowLayout>
  );
}

const ROLES: { id: Role; title: string; desc: string; icon: UiIconName }[] = [
  { id: 'designer', title: 'Product designer', desc: 'UI, UX and design systems in Figma', icon: 'palette' },
  { id: 'developer', title: 'Developer', desc: 'React, SVG sprites and CDN in code', icon: 'code' },
  { id: 'marketing', title: 'Brand and marketing', desc: 'Decks, social posts and landing pages', icon: 'sparkle' },
  { id: 'founder', title: 'Founder or product manager', desc: 'Prototypes, docs and pitch decks', icon: 'zap' },
  { id: 'student', title: 'Student or hobbyist', desc: 'Learning, side projects and portfolios', icon: 'star' },
];
const USES: { id: Use; title: string; desc: string; icon: ReactNode }[] = [
  { id: 'website', title: 'ollo website', desc: 'Browse, recolour, copy and download', icon: <Ic name="grid" /> },
  { id: 'figma', title: 'Figma plugin', desc: 'Insert components with every variant', icon: <FigmaMark /> },
  { id: 'code', title: 'React and code', desc: 'npm package, raw SVG and CDN', icon: <Ic name="code" /> },
  { id: 'slides', title: 'Slides, docs and social', desc: 'PNG, GIF and Lottie exports', icon: <Ic name="image" /> },
];

const FlowActions = ({ back, next, disabled }: { back: () => void; next: () => void; disabled?: boolean }) => (
  <div className="flow-footer">
    <button className="btn btn-ghost btn-lg" onClick={back}>
      <UiIcon name="chevron-left" size={20} />
      Back
    </button>
    <button className="btn btn-primary btn-lg" onClick={next} disabled={disabled}>
      Continue
    </button>
  </div>
);

function SetupRole() {
  const a = useAccount();
  const [role, setRole] = useState<Role | undefined>();
  useEffect(() => {
    setRole((r) => r ?? a?.role ?? 'designer');
  }, [a?.role]);
  return (
    <FlowLayout right={<Skip />}>
      <Steps step={1} />
      <Heading title="What best describes you?" sub="We’ll put the right styles and categories first. You can change this any time in Account." />
      <div className="choices" role="radiogroup" aria-label="What best describes you">
        {ROLES.map((r) => (
          <ChoiceCard key={r.id} title={r.title} desc={r.desc} icon={<Ic name={r.icon} />} selected={role === r.id} onClick={() => setRole(r.id)} />
        ))}
      </div>
      <FlowActions back={() => go('welcome')} next={() => (account.answers({ role }), go('setup-use'))} disabled={!role} />
    </FlowLayout>
  );
}

function SetupUse() {
  const a = useAccount();
  const [uses, setUses] = useState<Use[] | null>(null);
  useEffect(() => {
    setUses((u) => u ?? (a?.uses.length ? a.uses : ['website', 'figma']));
  }, [a?.uses]);
  const list = uses ?? [];
  const toggle = (id: Use) => setUses(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  return (
    <FlowLayout right={<Skip />}>
      <Steps step={2} />
      <Heading title="Where will you use ollo?" sub="Pick all that apply. We’ll show the right export options first." />
      <div className="choices" role="group" aria-label="Where will you use ollo">
        {USES.map((u) => (
          <ChoiceCard key={u.id} multi title={u.title} desc={u.desc} icon={u.icon} selected={list.includes(u.id)} onClick={() => toggle(u.id)} />
        ))}
      </div>
      <FlowActions back={() => go('setup-role')} next={() => (account.answers({ uses: list }), go('setup-plan'))} disabled={!list.length} />
    </FlowLayout>
  );
}

const money = (n: number) => `$${n.toFixed(2)}`;
const planParam = (): PaidPlan => (hashParam('plan') === 'lifetime' ? 'lifetime' : 'pro');

/** Plan step: the three pay-once cards; on phones, tabs show one card at a time. */
function SetupPlan() {
  const [tab, setTab] = useState<Plan>('pro');
  const free = () => (account.finishOnboarding(), go('library'));
  const buy = (plan: PaidPlan) => (location.hash = `checkout?plan=${plan}`);
  const actions: Record<Plan, PlanAction> = {
    free: { label: 'Continue with Free', onClick: free },
    pro: { label: 'Continue with Pro', onClick: () => buy('pro') },
    lifetime: { label: 'Continue with Lifetime', onClick: () => buy('lifetime') },
  };
  return (
    <FlowLayout wide="pricing" right={<Skip />}>
      <Steps step={3} />
      <Heading title="Choose your plan" sub="Pay once and keep it forever. No subscription, no renewals. You can upgrade to Lifetime any time." />
      <div className="mode-switch is-full only-phone" role="tablist" aria-label="Plan">
        {(['free', 'pro', 'lifetime'] as Plan[]).map((p) => (
          <button key={p} role="tab" aria-selected={tab === p} className="seg seg-md" onClick={() => setTab(p)}>
            {PLAN_NAME[p]}
          </button>
        ))}
      </div>
      <div className="only-phone">
        <PriceCards actions={actions} only={tab} />
      </div>
      <div className="not-phone">
        <PriceCards actions={actions} />
      </div>
      <ul className="trust-row" role="list">
        {['14-day refund if you haven’t downloaded any files', 'Secure checkout · card, PayPal or Apple Pay'].map((t) => (
          <li key={t}>
            <UiIcon name="check" size={16} strokeWidth={2} />
            {t}
          </li>
        ))}
      </ul>
    </FlowLayout>
  );
}

/* ------------------------------------------------------------------ checkout */

function Checkout(p: Props) {
  const a = useAccount();
  const [plan, setPlan] = useState<PaidPlan>(planParam);
  const [method, setMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [receipt, setReceipt] = useState(true);
  const [promo, setPromo] = useState('');
  const [paying, setPaying] = useState(false);
  const upgrade = a?.plan === 'pro' && plan === 'lifetime';
  const list = upgrade ? PRICE.lifetime.now : PRICE[plan].was;
  const discount = upgrade ? PRICE.pro.now : PRICE[plan].was - PRICE[plan].now;
  const due = list - discount;
  const owned = a?.plan === plan || a?.plan === 'lifetime';
  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!a) return go('signin');
    if (owned) return;
    // Real payments open the payment provider's secure checkout here; this preview only
    // records the plan in this browser. Card fields below are never read or stored.
    setPaying(true);
    setTimeout(() => {
      account.buy(plan);
      go('done');
    }, 900);
  };
  return (
    <FlowLayout
      wide="checkout"
      right={
        <>
          <span className="secure only-wide">
            <LockMark />
            Secure checkout
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => go('setup-plan')}>
            <UiIcon name="chevron-left" size={18} />
            Back to plans
          </button>
        </>
      }
    >
      <form className="checkout" onSubmit={pay}>
        <div className="checkout-main">
          <Heading title="Checkout" sub="Upgrade your ollo account. Pay once, keep it forever. No subscription." />
          <section className="card">
            <h2 className="card-title">Account</h2>
            {a ? (
              <Field label="Email" value={a.email} disabled readOnly helper={`${PLAN_NAME[plan]} is added to this account. Receipts go here too.`} />
            ) : (
              <p className="card-text">
                <a className="text-link" href="#signin">
                  Sign in
                </a>{' '}
                or{' '}
                <a className="text-link" href="#signup">
                  create a free account
                </a>{' '}
                to upgrade.
              </p>
            )}
          </section>
          <section className="card">
            <h2 className="card-title">Payment method</h2>
            <div className="mode-switch is-full" role="radiogroup" aria-label="Payment method">
              {(
                [
                  ['card', 'Card'],
                  ['paypal', 'PayPal'],
                  ['apple', 'Apple Pay'],
                ] as const
              ).map(([id, l]) => (
                <button type="button" key={id} role="radio" aria-checked={method === id} aria-selected={method === id} className="seg seg-md" onClick={() => setMethod(id)}>
                  {l}
                </button>
              ))}
            </div>
            {method === 'card' ? (
              <div className="form-fields">
                <Field label="Card number" inputMode="numeric" autoComplete="off" placeholder="1234 1234 1234 1234" />
                <div className="field-pair">
                  <Field label="Expiry" inputMode="numeric" autoComplete="off" placeholder="MM / YY" />
                  <Field label="CVC" inputMode="numeric" autoComplete="off" placeholder="123" />
                </div>
                <Field label="Name on card" autoComplete="off" defaultValue={a?.name ?? ''} />
                <label className="field">
                  <span className="field-label">Country or region</span>
                  <span className="select">
                    <select defaultValue="BD" aria-label="Country or region">
                      {[
                        ['BD', 'Bangladesh'],
                        ['IN', 'India'],
                        ['GB', 'United Kingdom'],
                        ['US', 'United States'],
                        ['DE', 'Germany'],
                        ['AE', 'United Arab Emirates'],
                        ['XX', 'Other'],
                      ].map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <UiIcon name="chevron-down" size={16} />
                  </span>
                </label>
                <Checkbox label="Email me the receipt" checked={receipt} onChange={setReceipt} />
              </div>
            ) : (
              <p className="card-text">
                You’ll confirm with {method === 'paypal' ? 'PayPal' : 'Apple Pay'} in the next step. You can switch back to a card
                at any time.
              </p>
            )}
          </section>
          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={paying || !a || owned}>
            {owned ? `You already have ${PLAN_NAME[a!.plan]}` : paying ? 'Processing…' : `Pay ${money(due)} once`}
          </button>
          <p className="form-note">
            Payments are processed securely by our payment partner, who also handles tax and receipts. Card details never touch
            ollo’s servers.
          </p>
        </div>
        <aside className="checkout-side">
          <section className="card">
            <h2 className="card-title">Order summary</h2>
            <div className="product">
              <Tile brand>
                <Ic name="sparkle" />
              </Tile>
              <span className="product-text">
                <span className="product-name">
                  ollo {PLAN_NAME[plan]} <span className="badge-pro">{plan === 'lifetime' ? 'LIFETIME' : 'PRO'}</span>
                </span>
                <span>{plan === 'lifetime' ? 'One-time payment · every weekly batch, forever' : 'One-time payment · 3 months of new batches'}</span>
              </span>
            </div>
            <div className="mode-switch is-full" role="radiogroup" aria-label="Plan">
              {(['pro', 'lifetime'] as PaidPlan[]).map((id) => (
                <button type="button" key={id} role="radio" aria-checked={plan === id} aria-selected={plan === id} className="seg seg-md" onClick={() => setPlan(id)}>
                  {PLAN_NAME[id]} · ${PRICE[id].now}
                </button>
              ))}
            </div>
            <hr />
            <dl className="lines">
              <div>
                <dt>{upgrade ? 'Lifetime' : `${PLAN_NAME[plan]}, one-time`}</dt>
                <dd>{money(list)}</dd>
              </div>
              <div>
                <dt>{upgrade ? 'Pro you already own' : `Launch offer, ${offPercent(plan)}% off`}</dt>
                <dd className="is-brand">−{money(discount)}</dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>{money(0)}</dd>
              </div>
            </dl>
            <hr />
            <div className="total">
              <span>Due today</span>
              <b>{money(due)}</b>
            </div>
            <p className="form-note">
              {plan === 'lifetime'
                ? 'No subscription. Every weekly batch is included, forever.'
                : `No subscription. New weekly batches included until ${longDate(proBatchesEnd().toISOString().slice(0, 10))}. Upgrade to Lifetime any time for the difference.`}
            </p>
            <div className="promo-row">
              <Field label="Promo code" placeholder="Enter code" value={promo} onChange={(e) => setPromo(e.target.value)} />
              <button type="button" className="btn btn-outline btn-md" disabled={!promo.trim()} onClick={() => p.onToast('That code isn’t valid')}>
                Apply
              </button>
            </div>
          </section>
          <div className="included">
            <span className="eyebrow is-muted">INCLUDED IN {plan === 'lifetime' ? 'LIFETIME' : 'PRO'}</span>
            <ul className="plan-points">
              {(plan === 'lifetime'
                ? ['Everything in Pro', 'Up to 5 people', 'Every new icon and illustration, forever', 'Early access to new styles and packs']
                : ['Bold, Fill and Duotone icon styles', 'Animated icons: Lottie, .lottie and GIF', 'Every illustration type, still or animated', 'Figma components with every variant', 'Commercial licence']
              ).map((x) => (
                <li key={x}>
                  <UiIcon name="check" size={16} strokeWidth={2} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </form>
    </FlowLayout>
  );
}

function Done() {
  const a = useAccount();
  const plan: PaidPlan = a?.plan === 'lifetime' ? 'lifetime' : 'pro';
  const paid = a?.invoices[0]?.amount ?? PRICE[plan].now;
  return (
    <FlowLayout
      center
      wide="plan"
      right={
        <a className="btn btn-ghost btn-sm" href="#account">
          Account
        </a>
      }
    >
      <div className="done">
        <span className="success-mark">
          <UiIcon name="check" size={32} strokeWidth={1.75} />
        </span>
        <div className="welcome-head">
          <span className="eyebrow">PAYMENT CONFIRMED</span>
          <h1>You’re all set, {firstName(a)}</h1>
          <p>
            {plan === 'lifetime'
              ? 'Lifetime is yours: every style, animation and Figma variant, plus every weekly batch, forever. Your receipt is on its way.'
              : `Pro is yours for good: every style, animation and Figma variant. New batches arrive weekly until ${a?.batchesUntil ? longDate(a.batchesUntil) : 'the end of month 3'}, and your receipt is on its way.`}
          </p>
        </div>
        <dl className="done-summary">
          <div>
            <dt>Plan</dt>
            <dd>{PLAN_NAME[plan]} · one-time</dd>
          </div>
          <div>
            <dt>Paid today</dt>
            <dd>{money(paid)}</dd>
          </div>
          <div>
            <dt>New batches until</dt>
            <dd>{plan === 'lifetime' ? 'Forever' : a?.batchesUntil ? longDate(a.batchesUntil) : '3 months'}</dd>
          </div>
        </dl>
        <div className="next-steps">
          {[
            [<Ic key="g" name="grid" />, 'Browse Pro styles', 'Bold, Fill and Duotone are now live across the library.', 'Open library', 'library'],
            [<FigmaMark key="f" />, 'Connect the Figma plugin', 'Sign in from the plugin to insert every variant.', 'Get the plugin', 'figma'],
            [<Ic key="c" name="code" />, 'Use ollo in code', 'Install the React package and import any icon.', 'Read the docs', 'docs'],
          ].map(([icon, t, d, cta, href]) => (
            <div key={t as string} className="card next-card">
              <Tile>{icon}</Tile>
              <b>{t}</b>
              <p>{d}</p>
              <a className="btn btn-outline btn-sm" href={`#${href}`}>
                {cta}
              </a>
            </div>
          ))}
        </div>
        <a className="btn btn-primary btn-lg" href="#library">
          Go to the library
        </a>
      </div>
    </FlowLayout>
  );
}

/* ------------------------------------------------------------------ account */

function AccountBilling(p: Props) {
  const a = useAccount();
  if (!a) {
    return (
      <main className="account-page" id="main">
        <div className="account-empty card">
          <h1 className="card-title">Sign in to see your account</h1>
          <p className="card-text">Your plan, invoices and Figma connection live here.</p>
          <div className="row-gap">
            <a className="btn btn-primary btn-md" href="#signin">
              Sign in
            </a>
            <a className="btn btn-outline btn-md" href="#signup">
              Create account
            </a>
          </div>
        </div>
      </main>
    );
  }
  const paid = a.plan !== 'free';
  return (
    <div className="account-shell">
      <nav className="sidebar only-desktop account-nav" aria-label="Account">
        <p className="side-label">ACCOUNT</p>
        {(
          [
            ['user', 'Profile', ''],
            ['sparkle', 'Plan and billing', PLAN_NAME[a.plan]],
            ['figma', 'Figma plugin', ''],
            ['sliders', 'Preferences', ''],
            ['heart', 'Favourites', ''],
          ] as const
        ).map(([icon, label, count], i) => (
          <button key={label} className="coll" aria-current={i === 1 ? 'true' : undefined} onClick={() => i !== 1 && p.onToast(`${label} is coming next`)}>
            {icon === 'figma' ? <FigmaMark size={18} /> : <UiIcon name={icon} size={18} />}
            <span className="coll-label">{label}</span>
            {count && <span className="coll-count">{count}</span>}
          </button>
        ))}
        <span className="side-fill" />
        <button className="btn btn-ghost btn-md account-signout" onClick={() => (account.signOut(), go('library'), p.onToast('Signed out'))}>
          Sign out
        </button>
      </nav>
      <main className="account-page" id="main">
        <div className="account-col">
          <div className="flow-heading">
            <h1>Plan and billing</h1>
            <p>Your plan, new batches and invoices. No subscription to manage.</p>
          </div>
          <section className="card">
            <div className="plan-row">
              <Tile brand>
                <Ic name="sparkle" size={22} />
              </Tile>
              <div className="plan-row-text">
                <span className="plan-row-name">
                  {paid ? `${PLAN_NAME[a.plan]} · one-time` : 'Free'}
                  <span className={paid ? 'badge-pro' : 'badge-neutral'}>{PLAN_NAME[a.plan].toUpperCase()}</span>
                </span>
                <span>
                  {a.plan === 'lifetime'
                    ? `Paid once${a.purchased ? ` on ${longDate(a.purchased)}` : ''}. Every style, animation and Figma variant, plus every weekly batch, forever.`
                    : a.plan === 'pro'
                      ? `Paid once${a.purchased ? ` on ${longDate(a.purchased)}` : ''}. Every style, animation and Figma variant is yours to keep. New weekly batches included until ${a.batchesUntil ? longDate(a.batchesUntil) : 'month 3'}.`
                      : 'Light and Regular icons, some Stroke illustrations and the Figma plugin with Free styles.'}
                </span>
              </div>
              <div className="plan-row-price">
                <b>{paid ? `$${PRICE[a.plan as PaidPlan].now}` : '$0'}</b>
                <span>{paid ? 'paid once' : 'forever'}</span>
              </div>
            </div>
            <div className="card-actions">
              {a.plan === 'lifetime' ? (
                <span className="card-text">You own everything, including every future batch.</span>
              ) : a.plan === 'pro' ? (
                <>
                  <a className="btn btn-outline btn-md" href="#checkout?plan=lifetime">
                    Upgrade to Lifetime · ${lifetimeUpgrade()}
                  </a>
                  <a className="btn btn-ghost btn-md" href="#subscribe">
                    Compare plans
                  </a>
                  <span className="grow" />
                  <span className="card-sub">No renewals, nothing to cancel</span>
                </>
              ) : (
                <>
                  <a className="btn btn-primary btn-md" href="#setup-plan">
                    <UiIcon name="sparkle" size={20} />
                    Get Pro or Lifetime
                  </a>
                  <a className="btn btn-ghost btn-md" href="#subscribe">
                    Compare plans
                  </a>
                </>
              )}
            </div>
          </section>
          <div className="card-pair">
            <section className="card">
              <h2 className="card-title">Payment method</h2>
              {paid ? (
                <div className="product">
                  <span className="card-brand">CARD</span>
                  <span className="product-text">
                    <b>Saved with our payment partner</b>
                    <span>Used only if you upgrade again.</span>
                  </span>
                </div>
              ) : (
                <p className="card-text">No card on file. You only add one when you upgrade.</p>
              )}
              <button className="btn btn-outline btn-sm" disabled={!paid} onClick={() => p.onToast('Opens the secure billing page when payments go live')}>
                Update card
              </button>
            </section>
            <section className="card">
              <h2 className="card-title">Figma plugin</h2>
              <div className="product">
                <Tile>
                  <FigmaMark />
                </Tile>
                <span className="product-text">
                  <b>{a.figma ? 'Connected' : 'Not connected'}</b>
                  <span>{a.figma ? `Since ${longDate(a.figma.connected)}` : 'Sign in from the plugin to use your plan in Figma.'}</span>
                </span>
              </div>
              {a.figma ? (
                <button className="btn btn-outline btn-sm" onClick={() => (account.disconnectFigma(), p.onToast('Figma plugin disconnected'))}>
                  Disconnect
                </button>
              ) : (
                <a className="btn btn-outline btn-sm" href="#figma">
                  Get the plugin
                </a>
              )}
            </section>
          </div>
          <section className="card">
            <div className="card-head">
              <span>
                <h2 className="card-title">Invoices</h2>
                <span className="card-sub">Receipts are also emailed to {a.email}.</span>
              </span>
            </div>
            {a.invoices.length ? (
              <table className="invoices">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DESCRIPTION</th>
                    <th className="num">AMOUNT</th>
                    <th className="num">STATUS</th>
                    <th aria-label="Download" />
                  </tr>
                </thead>
                <tbody>
                  {a.invoices.map((inv, i) => (
                    <tr key={i}>
                      <td>{longDate(inv.date)}</td>
                      <td className="muted">{inv.label}</td>
                      <td className="num">{money(inv.amount)}</td>
                      <td className="num">
                        <span className="badge-neutral">Paid</span>
                      </td>
                      <td className="num">
                        <button className="icon-btn icon-btn-sm" aria-label="Download receipt" onClick={() => p.onToast('Receipts download once payments go live')}>
                          <UiIcon name="download" size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="card-text">No invoices yet.</p>
            )}
          </section>
          <section className="danger">
            <span>
              <b>Delete account</b>
              Removes your favourites, collections and plugin connection. Your downloads stay yours.
            </span>
            <button
              className="btn btn-outline btn-sm is-danger"
              onClick={() => {
                if (confirm('Delete your ollo account? This can’t be undone.')) {
                  account.signOut();
                  go('library');
                  p.onToast('Account deleted');
                }
              }}
            >
              Delete account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ Figma plugin connection */

const newCode = () => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => abc[Math.floor(Math.random() * abc.length)]).join('');
};
const CodeRow = ({ code }: { code: string }) => (
  <div className="code-row" aria-label={`Code ${code.slice(0, 3)} ${code.slice(3)}`}>
    {code.split('').map((c, i) => (
      <span key={i} className="code-row-item">
        {i === 3 && <span className="code-dash" aria-hidden="true" />}
        <span className="otp-box is-static">{c}</span>
      </span>
    ))}
  </div>
);
const PairMark = () => (
  <div className="pair-mark" aria-hidden="true">
    <span className="pair-tile">
      <FigmaMark size={32} />
    </span>
    <span className="pair-dots">
      <i />
      <i />
      <i />
    </span>
    <span className="pair-tile is-logo">
      <Logo />
    </span>
  </div>
);

/** Inside the Figma plugin: sign in with the browser, then the plugin uses the account's plan. */
function PluginSignIn() {
  const a = useAccount();
  const [state, setState] = useState<'start' | 'waiting' | 'connected'>(a?.figma ? 'connected' : 'start');
  const code = useMemo(newCode, []);
  const site = (typeof window !== 'undefined' && (window as unknown as { __OLLO__?: { site?: string } }).__OLLO__?.site) || '';
  const open = () => {
    if (site) window.open(`${site}#connect-figma?code=${code}`, '_blank');
    setState('waiting');
  };
  return (
    <div className="plugin-auth">
      <div className="plugin-auth-top">
        <a href="#" className="logo-link" aria-label="Back to the library" onClick={(e) => (e.preventDefault(), go('library'))}>
          <Logo />
        </a>
        <button className="btn btn-ghost btn-sm" onClick={() => go('library')}>
          {state === 'connected' ? 'Close' : 'Back'}
        </button>
      </div>
      <main className="plugin-auth-body" id="main">
        {state === 'start' && (
          <>
            <PairMark />
            <Heading center title="Sign in to ollo" sub="Connect your account to insert Pro styles, animated icons and every Figma variant. Light and Regular work without signing in." />
            <div className="stack">
              <button className="btn btn-primary btn-lg btn-block" onClick={open}>
                <UiIcon name="arrow-up-right" size={20} />
                Sign in with browser
              </button>
              <button className="btn btn-outline btn-lg btn-block" onClick={open}>
                Create a free account
              </button>
            </div>
            <button className="btn btn-ghost btn-md" onClick={() => go('library')}>
              Continue with Free styles
            </button>
          </>
        )}
        {state === 'waiting' && (
          <>
            <PairMark />
            <Heading center title="Finish signing in in your browser" sub="We opened ollo in your browser. Check that it shows this code, then select Allow." />
            <CodeRow code={code} />
            <span className="waiting">
              <span className="spinner" aria-hidden="true" />
              Waiting for approval…
            </span>
            <div className="row-gap">
              <button className="btn btn-outline btn-md" onClick={open}>
                Open browser again
              </button>
              <button className="btn btn-ghost btn-md" onClick={() => setState('start')}>
                Cancel
              </button>
            </div>
            {!site && (
              <button className="text-link is-muted" onClick={() => (account.connectFigma(), setState('connected'))}>
                Preview: mark as approved
              </button>
            )}
          </>
        )}
        {state === 'connected' && (
          <>
            <span className="success-mark">
              <UiIcon name="check" size={28} strokeWidth={1.75} />
            </span>
            <Heading
              center
              title="You’re connected"
              sub={`Signed in as ${a?.name ?? 'you'}. ${a && a.plan !== 'free' ? `You own ${PLAN_NAME[a.plan]}, so every style, animation and variant inserts straight into this file.` : 'You’re on Free: Light and Regular insert into this file.'}`}
            />
            <div className="who">
              <span className="avatar">{initials(a?.name ?? '')}</span>
              <span className="product-text">
                <b>{a?.name ?? 'You'}</b>
                <span>{a ? (a.plan === 'free' ? 'Free' : `${PLAN_NAME[a.plan]} · one-time`) : 'Free'}</span>
              </span>
              {a && a.plan !== 'free' && <span className="badge-pro">{PLAN_NAME[a.plan].toUpperCase()}</span>}
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => go('library')}>
              Start browsing
            </button>
          </>
        )}
      </main>
    </div>
  );
}

/** In the browser: approve the plugin's request. Opened by the plugin with #connect-figma?code=XXXXXX. */
function ConnectFigma(p: Props) {
  const a = useAccount();
  const code = (hashParam('code') ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'K7Q4MD';
  const [done, setDone] = useState(false);
  return (
    <FlowLayout center right={<a className="btn btn-ghost btn-sm" href="#help">Help</a>}>
      <div className="connect card">
        {done ? (
          <>
            <span className="success-mark">
              <UiIcon name="check" size={28} strokeWidth={1.75} />
            </span>
            <Heading center title="Figma is connected" sub="Go back to Figma. The plugin is signed in and uses your plan." />
            <button className="btn btn-outline btn-lg btn-block" onClick={() => go('library')}>
              Back to the library
            </button>
          </>
        ) : (
          <>
            <PairMark />
            <Heading center title="Connect ollo for Figma" sub="The ollo plugin in Figma wants to use your account." />
            {a ? (
              <>
                <div className="who">
                  <span className="avatar">{initials(a.name)}</span>
                  <span className="product-text">
                    <b>{a.name}</b>
                    <span>{a.email}</span>
                  </span>
                  <button className="text-link" onClick={() => (account.signOut(), go('signin'))}>
                    Not you?
                  </button>
                </div>
                <div className="code-check">
                  <span>Check this code matches the one in Figma</span>
                  <CodeRow code={code} />
                </div>
                <div className="perms">
                  <span className="eyebrow is-muted">THE PLUGIN WILL BE ABLE TO</span>
                  <ul className="plan-points">
                    {['See your plan (Free or Pro)', 'Insert the icons and illustrations your plan includes', 'Stay signed in on this Figma account until you disconnect'].map((x) => (
                      <li key={x}>
                        <UiIcon name="check" size={16} strokeWidth={2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="row-gap is-fill">
                  <button className="btn btn-outline btn-lg" onClick={() => go('library')}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={() => (account.connectFigma(), setDone(true), p.onToast('Figma connected'))}>
                    Allow and connect
                  </button>
                </div>
                <p className="form-note is-center">You can disconnect any time in Account → Figma plugin.</p>
              </>
            ) : (
              <div className="row-gap is-fill">
                <a className="btn btn-outline btn-lg" href="#signup">
                  Create account
                </a>
                <a className="btn btn-primary btn-lg" href="#signin">
                  Sign in to continue
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </FlowLayout>
  );
}
