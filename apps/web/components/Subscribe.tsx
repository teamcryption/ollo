'use client';
// Subscribe page. No Figma frame exists for pricing yet, so it is built from the Design System
// page: Segment (billing), plan cards with the selected double-layer ring, Badge Type=Pro,
// black primary buttons, brand blue only for the selected plan and checks.
// Prices and plan contents confirmed by Abdur on 2026-11-10: Free (default) and Pro $8/month or $72/year.
import { useEffect, useMemo, useState } from 'react';
import { fmt } from '@/lib/data';
import { UiIcon } from './ui-icons';

export type PlanId = 'free' | 'pro';
type Billing = 'monthly' | 'yearly';

const PRICE = { pro: { monthly: 8, yearly: 72 } }; // USD; yearly = 2 months free

type Row = { label: string; free: string | boolean; pro: string | boolean };
const COMPARE: { group: string; rows: Row[] }[] = [
  {
    group: 'Icons',
    rows: [
      { label: 'Every icon in Light, Regular, Bold, Fill and Duotone', free: true, pro: true },
      { label: 'Copy SVG, copy JSX, React package', free: true, pro: true },
      { label: 'Download SVG and PNG at 16, 20, 24, 32 px', free: true, pro: true },
      { label: 'Recolour', free: '5 brand swatches', pro: 'Any colour' },
      { label: 'Bulk download a collection as .zip', free: false, pro: true },
    ],
  },
  {
    group: 'Animated icons',
    rows: [
      { label: 'Preview and animated SVG', free: true, pro: true },
      { label: 'Lottie, .lottie and GIF export', free: false, pro: true },
      { label: 'Trigger, speed and background controls', free: false, pro: true },
    ],
  },
  {
    group: 'Illustrations',
    rows: [
      { label: 'Stroke style, SVG', free: true, pro: true },
      { label: 'Fill and Duotone styles, PNG and Lottie', free: false, pro: true },
      { label: 'Draw and Float motion', free: false, pro: true },
    ],
  },
  {
    group: 'Licence',
    rows: [
      { label: 'Personal and commercial projects', free: true, pro: true },
      { label: 'Attribution', free: 'Required', pro: 'Not needed' },
      { label: 'Figma plugin', free: true, pro: true },
    ],
  },
];

export function Subscribe({
  initialPlan = 'free',
  iconCount,
  illustrationCount,
  onToast,
}: {
  initialPlan?: PlanId;
  iconCount: number;
  illustrationCount: number;
  onToast: (t: string) => void;
}) {
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [billing, setBilling] = useState<Billing>('yearly');
  useEffect(() => setPlan(initialPlan), [initialPlan]);

  const pro = PRICE.pro[billing];
  const perMonth = billing === 'yearly' ? pro / 12 : pro;
  const cta = plan === 'free' ? 'Continue with Free' : `Subscribe to Pro · $${fmt(pro)}/${billing === 'yearly' ? 'year' : 'month'}`;

  const plans = useMemo(
    () => [
      {
        id: 'free' as PlanId,
        name: 'Free',
        price: '$0',
        unit: 'forever',
        note: 'No card needed',
        lead: 'Everything you need to ship static icons today.',
        points: [
          `All ${fmt(iconCount)} icons in 5 styles`,
          'Copy SVG and JSX, download SVG and PNG',
          'Animated SVG and Stroke illustrations',
          'Commercial use with attribution',
        ],
      },
      {
        id: 'pro' as PlanId,
        name: 'Pro',
        price: `$${perMonth % 1 ? perMonth.toFixed(2) : perMonth}`,
        unit: 'per month',
        note: billing === 'yearly' ? `$${pro} billed yearly` : 'Billed monthly, cancel anytime',
        lead: 'Motion, every illustration style and no attribution.',
        points: [
          'Everything in Free',
          'Lottie, .lottie and GIF for every animated icon',
          `All ${fmt(illustrationCount)} illustrations in Fill and Duotone`,
          'Any colour, bulk .zip downloads, no attribution',
        ],
      },
    ],
    [iconCount, illustrationCount, perMonth, pro, billing],
  );

  const submit = () =>
    onToast(plan === 'free' ? 'You’re on Free. Nothing to pay.' : 'Checkout isn’t connected yet: Pro is a preview of the plan');

  return (
    <main className="subscribe" id="main">
      <div className="sub-head">
        <h1>Pick your plan</h1>
        <p>
          {fmt(iconCount)} icons and {fmt(illustrationCount)} illustrations, drawn from scratch. Start free and upgrade
          when you need motion.
        </p>
        <div className="mode-switch sub-billing" role="radiogroup" aria-label="Billing">
          {(['monthly', 'yearly'] as Billing[]).map((b) => (
            <button
              key={b}
              role="radio"
              aria-checked={billing === b}
              aria-selected={billing === b}
              className="seg seg-md"
              onClick={() => setBilling(b)}
            >
              {b === 'monthly' ? 'Monthly' : 'Yearly'}
              {b === 'yearly' && <span className="badge-new">2 months free</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="plans" role="radiogroup" aria-label="Plan">
        {plans.map((p) => (
          <div
            key={p.id}
            className="plan"
            role="radio"
            tabIndex={0}
            aria-checked={plan === p.id}
            onClick={() => setPlan(p.id)}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), setPlan(p.id))}
          >
            <div className="plan-top">
              <span className="plan-radio" aria-hidden="true" />
              <span className="plan-name">{p.name}</span>
              {p.id === 'pro' && <span className="badge-pro">PRO</span>}
              {p.id === 'free' && <span className="plan-default">Default</span>}
            </div>
            <div className="plan-price">
              <span className="plan-amount">{p.price}</span>
              <span className="plan-unit">{p.unit}</span>
            </div>
            <p className="plan-note">{p.note}</p>
            <p className="plan-lead">{p.lead}</p>
            <ul className="plan-points">
              {p.points.map((x) => (
                <li key={x}>
                  <UiIcon name="check" size={16} strokeWidth={2} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sub-bar">
        <div className="sub-bar-text">
          <span className="sub-bar-plan">{plan === 'free' ? 'Free plan' : 'Pro plan'}</span>
          <span className="sub-bar-note">
            {plan === 'free' ? '$0 · no card needed' : `$${fmt(pro)} per ${billing === 'yearly' ? 'year' : 'month'} · cancel anytime`}
          </span>
        </div>
        <button className="btn btn-primary btn-lg" onClick={submit}>
          {plan === 'pro' && <UiIcon name="sparkle" size={20} />}
          {cta}
        </button>
      </div>

      <section className="compare" aria-labelledby="compare-h">
        <h2 id="compare-h">Compare plans</h2>
        <div className="compare-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" aria-current={plan === 'free' ? 'true' : undefined}>
                  Free
                </th>
                <th scope="col" aria-current={plan === 'pro' ? 'true' : undefined}>
                  Pro
                </th>
              </tr>
            </thead>
            {COMPARE.map((g) => (
              <tbody key={g.group}>
                <tr className="compare-group">
                  <th scope="rowgroup" colSpan={3}>
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {[r.free, r.pro].map((v, i) => (
                      <td key={i} className={i === (plan === 'free' ? 0 : 1) ? 'is-plan' : undefined}>
                        {v === true ? (
                          <span className="yes" aria-label="Included">
                            <UiIcon name="check" size={16} strokeWidth={2} />
                          </span>
                        ) : v === false ? (
                          <span className="no" aria-label="Not included">
                            –
                          </span>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>
    </main>
  );
}
