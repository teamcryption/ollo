/**
 * Pommel horse: a padded body on two pedestal legs with two pommel handles on top. The horse turns on the floor to follow the pointer's x, as if walked round; the part nearest the pointer is named and bright. At rest the pommels are bright. The slider is how far it turns.
 *
 * The pattern: one object answering the pointer's x with a spring.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, rrect, spring, stepS, disposer, mk, pointer, register } = HL;

const R0 = -18, SLIDE = 0, HI = "pommel";
const ring = (pts) => pts;
const box = (x0, y0, x1, y1, z0, z1, r = 2) => { const q = rrect(x0, y0, x1, y1, r, 4); return [q.map((p) => [p.u, p.v, z0]), q.map((p) => [p.u, p.v, z1])]; };
const cyl = (a, b, R, n = 28) => { const c = circ(R, n); return [c.map((p) => [a[0] + p.u, a[1] + p.v, a[2]]), c.map((p) => [b[0] + p.u, b[1] + p.v, b[2]])]; };
const cone = (x, y, R0_, z0, R1, z1, n = 40) => [circ(R0_, n).map((p) => [x + p.u, y + p.v, z0]), circ(R1, n).map((p) => [x + p.u, y + p.v, z1])];
const xbar = (x0, x1, y, z, R, n = 20) => { const c = circ(R, n); return [c.map((p) => [x0, y + p.u, z + p.v]), c.map((p) => [x1, y + p.u, z + p.v])]; };
const ydisc = (x, z, R, y0, y1, n = 44) => { const c = circ(R, n); return [c.map((p) => [x + p.u, y0, z + p.v]), c.map((p) => [x + p.u, y1, z + p.v])]; };
function PARTS() {
  const ps = [{ rings: box(-44, -10, 44, 10, 34, 46, 8), layer: 1, name: "body" }];
  for (const x of [-28, 28]) {
    ps.push({ rings: box(x - 12, -15, x + 12, 15, 0, 3, 3), layer: 0, name: "leg" });
    ps.push({ rings: cyl([x, 0, 3], [x, 0, 34], 3.5), layer: 0, name: "leg" });
  }
  for (const x of [-11, 11]) {
    ps.push({ rings: box(x - 2, -8, x + 2, -5, 46, 53, 1.4), layer: 2, name: "pommel" });
    ps.push({ rings: box(x - 2, 5, x + 2, 8, 46, 53, 1.4), layer: 2, name: "pommel" });
    ps.push({ rings: box(x - 2, -8, x + 2, 8, 52, 55, 1.5), layer: 3, name: "pommel" });
  }
  return ps;
}


function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const parts = PARTS();
  const rot = (p, a, s) => { const c = Math.cos(a), si = Math.sin(a); return [p[0] * c - p[1] * si + s, p[0] * si + p[1] * c, p[2]]; };
  const ext = [];
  for (let d = -90; d <= 90; d += 15) for (const pt of parts) for (const r of pt.rings) for (const p of r) ext.push(rot(p, ((R0 + d) * Math.PI) / 180, (d / 90) * SLIDE));
  const C1 = Cam(45, 0.5, 1); fit(C1, ext, 200, 166);
  const P1 = proj(C1), sp = ext.map((p) => P1(...p));
  const w = Math.max(...sp.map((p) => p[0])) - Math.min(...sp.map((p) => p[0])), h = Math.max(...sp.map((p) => p[1])) - Math.min(...sp.map((p) => p[1]));
  const C = Cam(45, 0.5, Math.min(372 / w, 292 / h)); fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const pt of parts) {
    pt.grp = mk("g", {}, g);
    pt.sil = mk("path", { class: "sil" }, pt.grp);
    pt.cr = mk("path", { class: "nf lo" }, pt.grp);
    pt.mk = (pt.marks || []).map(() => mk("path", { class: "nf lo" }, pt.grp));
  }
  const ang = spring(0);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = ((R0 + d) * Math.PI) / 180, s = (d / 90) * SLIDE, pr = (p) => P(...rot(p, a, s));
    for (const pt of parts) {
      const [ra, rb] = pt.rings;
      pt.sil.setAttribute("d", poly(hull(ra.concat(rb).map(pr))));
      const rf = pt.face ? (pr(rb[0])[1] + pr(rb[rb.length >> 1])[1] > pr(ra[0])[1] + pr(ra[ra.length >> 1])[1] ? rb : ra) : rb;
      pt.cr.setAttribute("d", poly(rf.map(pr)));
      (pt.marks || []).forEach((m, i) => { const mm = pt.face && rf === ra ? m.map((p) => [p[0], 2 * pt.mid - p[1], p[2]]) : m; pt.mk[i].setAttribute("d", poly(mm.map(pr))); });
      const c = pt.rings[0].concat(pt.rings[1]).reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]).map((v) => v / (pt.rings[0].length * 2));
      pt.key = pt.layer * 1000 + pr([c[0], c[1], 0])[1];
    }
    [...parts].sort((x, y) => x.key - y.key).forEach((pt) => g.appendChild(pt.grp));
  }
  draw(0);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 100) / 100); return m; });
  bag.add(B.unregister);

  const mids = parts.filter((pt) => pt.name).map((pt) => { const all = pt.rings[0].concat(pt.rings[1]).map((p) => P(...rot(p, (R0 * Math.PI) / 180, 0))); return { pt, m: [all.reduce((s, p) => s + p[0], 0) / all.length, all.reduce((s, p) => s + p[1], 0) / all.length] }; });
  let cur = null;
  function choose(name, sx) {
    ang.t = name ? clamp((sx - 200) / 150, -1, 1) * reach : 0;
    for (const pt of parts) pt.sil.classList.toggle("hi", pt.name === (name || HI));
    if (name !== cur) { cur = name; read.textContent = name || "rest"; }
    B.wake();
  }
  function hit([sx, sy]) {
    let best = null, bd = Infinity;
    for (const { pt, m } of mids) { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = pt.name; } }
    choose(bd < 90 ? best : null, sx);
  }
  choose(null, 200);
  bag.add(pointer(stage, { move: hit, leave: () => choose(null, 200) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "horsevault",
  means: "A pommel horse with two handles on top: it turns to follow the pointer, and the part under it lights.",
  rules: [1, 3, 5, 8],
  range: [0, 60, 90],
  tour: [[280, 120], [130, 180], [250, 210], null],
  mount,
});
