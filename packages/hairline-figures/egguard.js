/**
 * Egg cup: a footed cup holding a boiled egg, its top already cut round. The
 * pointer near the egg lifts the topper off and tips it back, showing the cut
 * and the yolk. At rest the topper sits just raised, bright. The slider is
 * how far it lifts.
 */
const {
  Cam, circ, clamp, fit, hull, poly, proj, rrect, spring, stepS, disposer, mk, pointer, register,
} = HL;

const D = Math.PI / 180;
const ringZ = (cx, cy, r, z, n = 28) => circ(r, n).map((q) => [cx + q.u, cy + q.v, z]);
const ringX = (x, cy, cz, r, n = 24) => circ(r, n).map((q) => [x, cy + q.u, cz + q.v]);
const boxZ = (x0, y0, x1, y1, r, z) => rrect(x0, y0, x1, y1, r, 4).map((q) => [q.u, q.v, z]);
const slabY = (x0, z0, x1, z1, r, y) => rrect(x0, z0, x1, z1, r, 4).map((q) => [q.u, y, q.v]);
const boxX = (y0, z0, y1, z1, r, x) => rrect(y0, z0, y1, z1, r, 4).map((q) => [x, q.u, q.v]);
/** Turns p about the line through (px, ., pz) along y: a > 0 lifts the +x side. */
const rotY = (p, px, pz, a) => {
  const dx = p[0] - px, dz = p[2] - pz, c = Math.cos(a), s = Math.sin(a);
  return [px + dx * c - dz * s, p[1], pz + dx * s + dz * c];
};

const MAXDEG = 34, REST = 0.1, LABEL = "top";
const H0 = 12, H1 = 60, CUT = 40;
const er = (z) => { const t = (z - H0) / (H1 - H0); return 15 * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)) * (1.06 - 0.16 * t); };
const egg = (z0, z1, n) => Array.from({ length: n + 1 }, (_, i) => { const z = z0 + ((z1 - z0) * i) / n; return ringZ(0, 0, Math.max(0.3, er(z)), z); });
const HOT = [0, 0, H1];
const PARTS = [
  { rings: [ringZ(0, 0, 19, 0, 40), ringZ(0, 0, 19, 2.5, 40)] },
  { rings: [ringZ(0, 0, 5, 2.5), ringZ(0, 0, 4, 11)] },
  { rings: [ringZ(0, 0, 8, 10), ringZ(0, 0, 13, 15, 36), ringZ(0, 0, 15.5, 24, 40)] },
  { rings: egg(24, CUT, 6), marks: [ringZ(0, 0, er(CUT) - 0.4, CUT + 0.05, 32), ringZ(1, 0, 6, CUT + 0.1, 20)] },
  { move: 1, hi: 1, rings: egg(CUT, H1, 8) },
];
const T = (p, a) => { const q = rotY(p, -er(CUT), CUT, -a * MAXDEG * D); return [q[0] - a * 4, q[1], q[2] + a * 16]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const all = [];
  for (const a of [0, 1]) for (const pc of PARTS) for (const r of pc.rings) for (const p of r) all.push(pc.move ? T(p, a, pc) : p);
  const C1 = Cam(45, 0.5, 1);
  fit(C1, all, 200, 166);
  const P1 = proj(C1), sp = all.map((p) => P1(...p));
  const xs = sp.map((q) => q[0]), ys = sp.map((q) => q[1]);
  const S = Math.min(320 / (Math.max(...xs) - Math.min(...xs)), 288 / (Math.max(...ys) - Math.min(...ys)));
  const C = Cam(45, 0.5, S);
  fit(C, all, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map((pc) => ({
    pc,
    sil: mk("path", { class: pc.hi ? "sil hi" : "sil" }, g),
    marks: (pc.marks || []).map(() => mk("path", { class: "nf lo" }, g)),
  }));
  const hot = P(...HOT);
  const amt = spring(REST);
  let last = NaN;

  function draw() {
    const a = amt.x * amp;
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    for (const e of els) {
      const f = (p) => P(...(e.pc.move ? T(p, a, e.pc) : p));
      const pts = [];
      for (const r of e.pc.rings) for (const p of r) pts.push(f(p));
      e.sil.setAttribute("d", poly(hull(pts)));
      e.marks.forEach((m, i) => m.setAttribute("d", poly(e.pc.marks[i].map(f))));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(amt, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const d = p ? Math.hypot(p[0] - hot[0], p[1] - hot[1]) : Infinity;
    amt.t = d > 150 ? REST : clamp((150 - d) / 90, REST, 1);
    read.textContent = d > 150 ? "rest" : LABEL + " " + Math.round(amt.t * MAXDEG * amp) + "\u00b0";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "egguard",
  means: "A boiled egg in a footed cup: the pointer near it lifts the cut topper off and tips it back to show the yolk.",
  rules: [1, 3, 5, 8],
  range: [0.5, 0.8, 1],
  tour: [[200, 60], [185, 85], [215, 75], null],
  mount,
});
