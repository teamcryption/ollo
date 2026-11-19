/**
 * Shuffleboard: a long court with its scoring triangle at the far end, a disc
 * resting at the near end and the cue's fork behind it. The pointer pushes the
 * cue forward and the disc slides up the court, further the further right the
 * pointer is; the part nearest it is named and bright. At rest the disc is
 * bright. The slider is how far the disc slides.
 *
 * The pattern: one part sliding along a track, driven by a spring.
 */
const { Cam, circ, clamp, fit, hull, open, poly, proj, rrect, spring, stepS, disposer, mk, pointer, register } = HL;

const HI = "disc", D0 = 6;
const box = (x0, y0, x1, y1, z0, z1, r = 2) => { const q = rrect(x0, y0, x1, y1, r, 4); return [q.map((p) => [p.u, p.v, z0]), q.map((p) => [p.u, p.v, z1])]; };
const zcyl = (x, y, z0, z1, R, n = 32) => { const c = circ(R, n); return [c.map((p) => [x + p.u, y + p.v, z0]), c.map((p) => [x + p.u, y + p.v, z1])]; };
const stick = (a, b, R, n = 16) => { const c = circ(R, n); return [c.map((p) => [a[0], a[1] + p.u, a[2] + p.v]), c.map((p) => [b[0], b[1] + p.u, b[2] + p.v])]; };
function PARTS() {
  return [
    { rings: box(-92, -16, 92, 16, 0, 2.5, 6), name: "court", marks: [[[44, 0], [86, -12], [86, 12], [44, 0]], [[58, -4], [58, 4]], [[72, -8], [72, 8]], [[-70, -16], [-70, 16]]] },
    { rings: stick([-58, 0, 6], [-104, 0, 36], 1.5), name: "cue", k: 0.45 },
    { rings: box(-60, -7, -55, 7, 2.5, 7, 1.6), name: "cue", k: 0.45 },
    { rings: zcyl(-47, 0, 2.5, 5.5, 7.5), name: "disc", k: 1, cr: 1 },
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const parts = PARTS();
  const mv = (p, pt, s) => [p[0] + (pt.k || 0) * s, p[1], p[2]];
  const ext = [];
  for (let s = 0; s <= 120; s += 10) for (const pt of parts) for (const r of pt.rings) for (const p of r) ext.push(mv(p, pt, s));
  const C1 = Cam(45, 0.5, 1); fit(C1, ext, 200, 166);
  const P1 = proj(C1), sp = ext.map((p) => P1(...p));
  const w = Math.max(...sp.map((p) => p[0])) - Math.min(...sp.map((p) => p[0])), h = Math.max(...sp.map((p) => p[1])) - Math.min(...sp.map((p) => p[1]));
  const C = Cam(45, 0.5, Math.min(372 / w, 292 / h)); fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const pt of parts) {
    pt.grp = mk("g", {}, g);
    pt.sil = mk("path", { class: "sil" }, pt.grp);
    pt.crp = mk("path", { class: "nf lo" }, pt.grp);
    for (const m of pt.marks || []) mk("path", { class: "nf lo", d: open(m.map((q) => P(q[0], q[1], 2.5))) }, pt.grp);
  }
  const sl = spring(D0);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    for (const pt of parts) {
      const pr = (p) => P(...mv(p, pt, s));
      pt.sil.setAttribute("d", poly(hull([].concat(...pt.rings).map(pr))));
      pt.crp.setAttribute("d", poly(pt.rings[1].map(pr)));
    }
  }
  draw(D0);
  const B = register(stage, (dt) => { const m = stepS(sl, dt); draw(Math.round(sl.x * 100) / 100); return m; });
  bag.add(B.unregister);

  const mids = parts.map((pt) => { const all = [].concat(...pt.rings).map((p) => P(...mv(p, pt, D0))); return { pt, m: [all.reduce((s, p) => s + p[0], 0) / all.length, all.reduce((s, p) => s + p[1], 0) / all.length] }; });
  let cur = null;
  function choose(name, sx) {
    sl.t = name ? D0 + 1.3 * reach * clamp(0.75 + (sx - 200) / 260, 0.6, 1) : D0;
    for (const pt of parts) pt.sil.classList.toggle("hi", pt.name === (name || HI));
    if (name !== cur) { cur = name; read.textContent = name || "rest"; }
    B.wake();
  }
  function hit([sx, sy]) {
    let best = null, bd = Infinity;
    for (const { pt, m } of mids) { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = pt.name; } }
    choose(bd < 110 ? best : null, sx);
  }
  choose(null, 200);
  bag.add(pointer(stage, { move: hit, leave: () => choose(null, 200) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "shuffleboard",
  means: "A shuffleboard court with a disc and its cue: the cue pushes and the disc slides up the court, and the part under the pointer lights.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 90],
  tour: [[100, 145], [118, 154], [230, 215], null],
  mount,
});
