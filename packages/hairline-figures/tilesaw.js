/**
 * Tile nipper: a pair of nippers lying flat, two long handles crossing at a
 * riveted pivot, with broad blunt jaws for biting the edge off a tile. The
 * pointer over the nipper swings the top arm about the rivet: its handle opens
 * away and its jaw gapes. At rest the jaws sit a little apart and the top jaw
 * is bright. The slider is how wide it opens.
 *
 * The pattern: one part turning about a fixed axis, tweened on hover.
 */
const { Cam, circ, rrect, fit, proj, hull, poly, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const REST = 12, LOW = -12, G = -24;
const V = [0.61, 0.61, 0.5];
function bx(a0, b0, a1, b1, c0, c1, r) {
  const q = rrect(a0, b0, a1, b1, r, 4), qi = rrect(a0 + 1.3, b0 + 1.3, a1 - 1.3, b1 - 1.3, Math.max(r - 1.3, 0.4), 4);
  return { pts: [c0, c1].flatMap((c) => q.map((s) => [s.u, s.v, c])), cr: qi.map((s) => [s.u, s.v, c1]), n: [0, 0, 1] };
}
function cy(ca, cb, R, c0, c1) {
  const q = circ(R, 28), qi = circ(Math.max(R - 1.3, 0.5), 28);
  return { pts: [c0, c1].flatMap((c) => q.map((s) => [s.u + ca, s.v + cb, c])), cr: qi.map((s) => [s.u + ca, s.v + cb, c1]), n: [0, 0, 1] };
}
// turn about the rivet (z axis through the origin)
const turn = (p, a0) => { const a = a0 + rad(G), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
const at = (sh, a) => ({ pts: sh.pts.map((p) => turn(p, rad(a))), cr: sh.cr.map((p) => turn(p, rad(a))), n: sh.n });

const arm = (z0, z1, sgn) => [
  bx(-34, -9, -10, 9, z0, z1, 6),
  bx(-12, -4.5, 16, 4.5, z0, z1, 3),
  bx(14, -4, 78, 4, z0, z1, 3.5),
  bx(40, -5.5, 80, 5.5, z1, z1 + 3, 4.5),
];
const LOWER = arm(0, 5).map((s) => ({ s: at(s, LOW) }));
const UPPER = arm(5, 10).map((s, i) => ({ s, m: 1, hi: i === 0 }));
const PARTS = [...LOWER, ...UPPER, { s: cy(0, 0, 5, 10, 12) }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.95);
  const ext = [];
  for (const a of [REST, REST + 22, REST + 45]) for (const pt of PARTS) for (const p of pt.s.pts) ext.push(pt.m ? turn(p, rad(a)) : p);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map((pt) => ({ pt, sil: mk("path", { class: "sil" + (pt.hi ? " hi" : "") }, g), cr: mk("path", { class: "nf lo" }, g) }));
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    const a = rad(REST + v * amp);
    if (a === last) return;
    last = a;
    for (const e of els) {
      const f = e.pt.m ? (p) => turn(p, a) : (p) => p;
      e.sil.setAttribute("d", poly(hull(e.pt.s.pts.map((p) => P(...f(p))))));
      e.cr.setAttribute("d", poly(e.pt.s.cr.map((p) => P(...f(p)))));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const sc = ext.slice(0, ext.length / 3).map((p) => P(...p));
  const bb = [Math.min(...sc.map((p) => p[0])), Math.min(...sc.map((p) => p[1])), Math.max(...sc.map((p) => p[0])), Math.max(...sc.map((p) => p[1]))];
  let act = null;
  const label = () => "open " + Math.round(REST - LOW + amp) + "°";
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? label() : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([x, y]) => x > bb[0] - 6 && x < bb[2] + 6 && y > bb[1] - 6 && y < bb[3] + 6;
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = label(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tilesaw",
  means: "A tile nipper lying flat: hover and the top arm swings about the rivet, its handle opening and its broad jaw gaping.",
  rules: [1, 3, 5, 8],
  range: [15, 30, 45],
  tour: [[88, 105], [180, 150], [290, 190], null],
  mount,
});
