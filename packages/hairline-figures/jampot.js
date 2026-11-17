/**
 * Jam pot: a squat pot with a domed, hinged lid and a jam spoon standing in
 * its notch. The pointer near the lid swings it up and back on its hinge,
 * opening the pot. At rest the lid sits a little ajar, bright. The slider is
 * how far it opens.
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

const MAXDEG = 80, REST = 0.08, LABEL = "lid";
const HOT = [0, 0, 44];
const PARTS = [
  { rings: [ringZ(0, 0, 19, 0, 40), ringZ(0, 0, 21, 3, 40), ringZ(0, 0, 21, 22, 40), ringZ(0, 0, 20, 24, 40)], marks: [ringZ(0, 0, 17, 24.05, 40), ringZ(0, 0, 15, 21, 36)] },
  { move: 1, hi: 1, rings: [ringZ(0, 0, 22, 24, 40), ringZ(0, 0, 22, 27, 40), ringZ(0, 0, 18, 33, 36), ringZ(0, 0, 10, 37, 28), ringZ(0, 0, 3, 38, 16), ringZ(0, 0, 3.5, 44, 16)], marks: [ringZ(0, 0, 20.5, 27.05, 40)] },
  { rings: [ringZ(15, 3, 1.6, 22, 12), ringZ(17, 4, 1.6, 44, 12), ringZ(17, 4, 3.2, 47, 16), ringZ(17, 4, 3.2, 51, 16)] },
];
const T = (p, a) => rotY(p, -22, 25, a * MAXDEG * D);

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
  name: "jampot",
  means: "A domed jam pot with a spoon in its notch: the pointer near the lid swings it open on its hinge.",
  rules: [1, 3, 5, 8],
  range: [0.5, 0.8, 1],
  tour: [[218, 131], [200, 150], [235, 140], null],
  mount,
});
