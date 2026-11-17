/**
 * Cleaver: a broad square blade bitten into a round-cornered chopping block,
 * its handle level with the spine. The pointer near the blade lifts it about
 * the handle's butt, ready to come down. At rest it sits a little raised,
 * the blade bright. The slider is how high it lifts.
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

const MAXDEG = 42, REST = 0.1, LABEL = "lift";
const HOT = [8, 0, 34];
const PARTS = [
  { rings: [boxZ(-34, -26, 40, 26, 8, -14), boxZ(-34, -26, 40, 26, 8, 0)], marks: [boxZ(-32, -24, 38, 24, 6.5, 0.05)] },
  { move: 1, rings: [boxX(-3.2, 23, 3.2, 30, 3, -58), boxX(-3.2, 23, 3.2, 30, 3, -20)], marks: [boxX(-1.6, 24.5, 1.6, 28.5, 1.5, -58.1)] },
  { move: 1, hi: 1, rings: [slabY(-22, -2, 32, 34, 2.5, -1.6), slabY(-22, -2, 32, 34, 2.5, 1.6)], marks: [slabY(-20, 0, 30, 32, 1.5, 1.65), circ(3, 16).map((q) => [-12 + q.u, 1.7, 27 + q.v])] },
];
const T = (p, a) => rotY(p, -58, 26, a * MAXDEG * D);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const all = [];
  for (const a of [0, 1]) for (const pc of PARTS) for (const r of pc.rings) for (const p of r) all.push(pc.move ? T(p, a, pc) : p);
  const C1 = Cam(45, 0.5, 1);
  fit(C1, all, 200, 166);
  const P1 = proj(C1), sp = all.map((p) => P1(...p));
  const xs = sp.map((q) => q[0]), ys = sp.map((q) => q[1]);
  const S = Math.min(320 / (Math.max(...xs) - Math.min(...xs)), 250 / (Math.max(...ys) - Math.min(...ys)));
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
  name: "cleaver",
  means: "A cleaver bitten into its block: the pointer near the blade lifts it about the handle, ready to come down.",
  rules: [1, 3, 5, 8],
  range: [0.5, 0.8, 1],
  tour: [[213, 156], [190, 170], [235, 150], null],
  mount,
});
