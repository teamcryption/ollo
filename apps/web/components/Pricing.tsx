'use client';
// Pay-once pricing from Figma (landing v1 › "Section · Pricing", Design System › "Price Card" and
// "Pricing Banner"): Free / Pro / Lifetime cards with a plan token (heart in Light, Bold, Fill),
// "was" + launch pills, and a Batch pass: one tiny ollo icon per weekly batch.
// Used by the landing page, the pricing page (#subscribe) and onboarding step 3.
import type { ReactNode } from 'react';
import { offPercent, PRICE, PRO_BATCHES, type Plan } from '@/lib/account';
import { LibIcon, useLibraryIcons } from '@/lib/libraryIcons';
import { UiIcon } from './ui-icons';
import { Roll } from '@/lib/motion';

const STRIP = ['home', 'bell', 'heart', 'folder', 'chat', 'calendar', 'mail', 'user', 'search', 'lock'];
const STRIP_SLOTS = 16;

type Card = {
  id: Plan;
  audience: string;
  token: [string, 'light' | 'bold' | 'fill'];
  price: string;
  unit: string;
  batches: { label: string; caption: string; lit: number; tone: 'none' | 'soft' | 'strong' };
  cta: string;
  points: [string, boolean][];
};

const CARDS: Card[] = [
  {
    id: 'free',
    audience: 'For trying ollo in a real project.',
    token: ['heart', 'light'],
    price: '$0',
    unit: 'forever',
    batches: { label: 'Not included', caption: 'Weekly batches come with Pro and Lifetime.', lit: 0, tone: 'none' },
    cta: 'Browse library',
    points: [
      ['Every icon in Light and Regular', true],
      ['Some illustrations in Stroke, with animation', true],
      ['Copy SVG and JSX, SVG and PNG', true],
      ['Figma plugin with Free styles', true],
      ['Commercial use with attribution', true],
    ],
  },
  {
    id: 'pro',
    audience: 'For designers, developers and freelancers.',
    token: ['heart', 'bold'],
    price: `$${PRICE.pro.now}`,
    unit: '/once',
    batches: {
      label: `${PRO_BATCHES} batches · 3 months`,
      caption: `The next ${PRO_BATCHES} weekly batches of new icons and illustrations, then the library stays yours.`,
      lit: PRO_BATCHES,
      tone: 'soft',
    },
    cta: 'Get Pro',
    points: [
      ['Everything in Free', true],
      ['Bold, Fill and Duotone styles', true],
      ['Animated icons: Lottie, .lottie and GIF', true],
      ['Every illustration type, animated and live', true],
      ['Figma components with every variant', true],
      ['Unlimited client projects, no attribution', true],
      ['No new batches after month 3', false],
    ],
  },
  {
    id: 'lifetime',
    audience: 'For founders, studios and teams who build for years.',
    token: ['heart', 'fill'],
    price: `$${PRICE.lifetime.now}`,
    unit: '/once',
    batches: { label: '∞  Forever', caption: 'Every weekly batch of new icons and illustrations, every year, at no extra cost.', lit: STRIP_SLOTS, tone: 'strong' },
    cta: 'Get Lifetime',
    points: [
      ['Everything in Pro', true],
      ['Up to 5 people', true],
      ['Every new icon and illustration, forever', true],
      ['Early access to new styles and packs', true],
      ['Priority icon requests', true],
    ],
  },
];

function useStripIcons() {
  return useLibraryIcons([...STRIP.map((n) => [n, 'regular'] as [string, 'regular']), ['heart', 'light'], ['heart', 'bold'], ['heart', 'fill']]);
}

export type PlanAction = { label?: string; onClick: () => void; current?: boolean };

export function PriceCards({ actions, only }: { actions: Record<Plan, PlanAction>; only?: Plan }) {
  const svgs = useStripIcons();
  return (
    <div className={`price-cards${only ? ' is-single' : ''}`}>
      {CARDS.filter((c) => !only || c.id === only).map((c) => {
        const paid = c.id !== 'free';
        const life = c.id === 'lifetime';
        const a = actions[c.id];
        return (
          <article key={c.id} className={`price-card plan-${c.id}${life ? ' force-dark' : ''}`} aria-label={`${c.id} plan`}>
            {life && <PriceField svgs={svgs} />}
            <header className="pc-top">
              <span className={`pc-token tone-${c.batches.tone}`} aria-hidden="true">
                <LibIcon svg={svgs[`${c.token[0]}:${c.token[1]}`]} />
              </span>
              <h3>{c.id === 'free' ? 'Free' : c.id === 'pro' ? 'Pro' : 'Lifetime'}</h3>
              {life && <span className="badge-new pc-popular">MOST POPULAR</span>}
            </header>
            <p className="pc-aud">{c.audience}</p>
            <div className="pc-price">
              <span className="pc-amount">{c.price}</span>
              <span className="pc-unit">{c.unit}</span>
            </div>
            <div className="pc-pills">
              {paid ? (
                <>
                  <span className="pc-was">was ${PRICE[c.id as 'pro' | 'lifetime'].was}</span>
                  <span className="pc-launch">Launch −{offPercent(c.id as 'pro' | 'lifetime')}%</span>
                  <span className="pc-save">Save ${PRICE[c.id as 'pro' | 'lifetime'].was - PRICE[c.id as 'pro' | 'lifetime'].now}</span>
                </>
              ) : (
                <span className="pc-save">No card needed</span>
              )}
            </div>
            <BatchPass card={c} svgs={svgs} />
            <button
              className={`btn btn-lg btn-block ${c.id === 'free' ? 'btn-outline' : 'btn-primary'}`}
              onClick={a.onClick}
              disabled={a.current}
            >
              {!a.current && <UiIcon name="arrow-up-right" size={18} />}
              {a.current ? 'Your plan' : <Roll text={a.label ?? c.cta} />}
            </button>
            <ul className="pc-points">
              {c.points.map(([t, ok]) => (
                <li key={t} className={ok ? undefined : 'is-no'}>
                  <UiIcon name={ok ? 'check' : 'close'} size={18} />
                  {t}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

function BatchPass({ card, svgs }: { card: Card; svgs: Record<string, string> }) {
  const life = card.id === 'lifetime';
  return (
    <div className="batch-pass">
      <div className="bp-head">
        <span>Weekly batches</span>
        <span className={`bp-pill tone-${card.batches.tone}`}>{card.batches.label}</span>
      </div>
      <div className="bp-strip" aria-hidden="true">
        {Array.from({ length: STRIP_SLOTS }, (_, i) =>
          life && i === STRIP_SLOTS - 1 ? (
            <span key={i} className="bp-slot is-inf">
              ∞
            </span>
          ) : i < card.batches.lit ? (
            <span key={i} className="bp-slot is-on">
              <LibIcon svg={svgs[`${STRIP[i % STRIP.length]}:regular`]} />
            </span>
          ) : (
            <span key={i} className="bp-slot">
              {i === 0 && card.batches.lit === 0 && <UiIcon name="close" size={10} />}
            </span>
          ),
        )}
      </div>
      <p className="bp-cap">{card.batches.caption}</p>
    </div>
  );
}

/** Faint field of filled icons in the Lifetime card's corner. */
function PriceField({ svgs }: { svgs: Record<string, string> }) {
  return (
    <span className="pc-field" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <LibIcon key={i} svg={svgs[`${STRIP[i % STRIP.length]}:regular`]} />
      ))}
    </span>
  );
}

export function DropsCard() {
  const svgs = useLibraryIcons([
    ['folder', 'regular'],
    ['bell', 'bold'],
    ['heart', 'fill'],
  ]);
  return (
    <div className="drops-card">
      <span className="drops-stack" aria-hidden="true">
        <span>
          <LibIcon svg={svgs['folder:regular']} />
        </span>
        <span>
          <LibIcon svg={svgs['bell:bold']} />
        </span>
        <span className="is-brand">
          <LibIcon svg={svgs['heart:fill']} />
        </span>
      </span>
      <span className="drops-text">
        <b>New icons and illustrations every week</b>
        Pro includes the next {PRO_BATCHES} batches. Lifetime gets every batch, forever, at no extra cost.
      </span>
    </div>
  );
}

export const TrustRow = () => (
  <ul className="trust-row" role="list">
    {['Commercial licence on every paid plan', 'Secure checkout · card, PayPal or Apple Pay', '14-day refund if you haven’t downloaded any files'].map((t) => (
      <li key={t}>
        <UiIcon name="check" size={16} strokeWidth={2} />
        {t}
      </li>
    ))}
  </ul>
);

const ROWS: [string, ReactNode, ReactNode, ReactNode][] = [
  ['Icons', 'Light and Regular', 'All 5 styles', 'All 5 styles'],
  ['Animated icons (Lottie, .lottie, GIF)', null, true, true],
  ['Illustrations', 'Some, in Stroke', 'Every type', 'Every type'],
  ['Live and scroll illustrations', null, true, true],
  ['Figma plugin', 'Free styles', 'Every variant', 'Every variant'],
  ['Commercial use', 'With attribution', true, true],
  ['Client projects', null, 'Unlimited', 'Unlimited'],
  ['People', '1', '1', 'Up to 5'],
  ['New weekly batches', null, 'Next 3 months', 'Forever'],
  ['Price', '$0', `$${PRICE.pro.now} once`, `$${PRICE.lifetime.now} once`],
];

export function CompareTable() {
  const cell = (v: ReactNode) =>
    v === true ? (
      <span className="yes" aria-label="Included">
        <UiIcon name="check" size={18} strokeWidth={2} />
      </span>
    ) : v === null ? (
      <span className="no" aria-label="Not included">
        –
      </span>
    ) : (
      v
    );
  return (
    <div className="compare-v2">
      <h3>Compare plans</h3>
      <div className="compare-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Free</th>
              <th scope="col">Pro</th>
              <th scope="col" className="is-life">
                Lifetime
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, f, p, l], i) => (
              <tr key={label} className={i === ROWS.length - 1 ? 'is-price' : undefined}>
                <th scope="row">{label}</th>
                <td>{cell(f)}</td>
                <td>{cell(p)}</td>
                <td className="is-life">{cell(l)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The whole pricing block: heading, weekly-batches card, cards, trust row and compare table. */
export function PricingBlock({ actions, as = 'h2', id }: { actions: Record<Plan, PlanAction>; as?: 'h1' | 'h2'; id?: string }) {
  const H = as;
  return (
    <section className="pricing-block" id={id} aria-labelledby="pricing-h">
      <div className="lp-head is-center">
        <span className="eyebrow">PRICING</span>
        <H id="pricing-h">Pay once. Keep it forever.</H>
        <p>
          No subscription. One price for every icon and illustration, plus a new batch every week. Pro includes the next 3 months
          of batches; Lifetime includes every batch, forever.
        </p>
      </div>
      <DropsCard />
      <PriceCards actions={actions} />
      <TrustRow />
      <CompareTable />
    </section>
  );
}
