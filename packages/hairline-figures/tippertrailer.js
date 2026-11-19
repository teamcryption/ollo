/**
 * Tipping trailer: a farm trailer on one axle with a drawbar. Its body is
 * hinged at the rear: the pointer over the trailer tips the body up, front
 * first, and the tailgate swings open below it. At rest the body sits a
 * little raised, its rim bright. The slider is how far it tips.
 */
const {
  Cam, fit, hull, poly, proj, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const L = 120, W = 50, H = 26, HZ = 22, PX = L, PZ = HZ;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-40, 0, 0], [L + 8, W, 0], [L + 8, 0, 0], [-40, W, 0], [20, W / 2, HZ + 100], [L + 8, W / 2, 0]], 200, 175);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // a box's top/bottom ring, turned about the hinge line (x = PX, z = PZ)
  const rot = (x, y, z, a) => { const dx = x - PX, dz = z - PZ, c = Math.cos(a), s = Math.sin(a); return P(PX + dx * c + dz * s, y, PZ - dx * s + dz * c); };
  const ring = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r, 4);
  const boxPts = (rg, z0, z1, a) => rg.map((q) => rot(q.u, q.v, z0, a)).concat(rg.map((q) => rot(q.u, q.v, z1, a)));
  const wheel = (y0, y1) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(L - 30 + 14 * Math.cos(t), y0, 14 + 14 * Math.sin(t)), P(L - 30 + 14 * Math.cos(t), y1, 14 + 14 * Math.sin(t))); }
    return poly(hull(pts));
  };
  const box = (x0, y0, x1, y1, z0, z1, r, parent, cls) => {
    const s = solid(parent);
    s.sil.setAttribute("d", poly(hull(ring(x0, y0, x1, y1, r).map((q) => P(q.u, q.v, z0)).concat(ring(x0, y0, x1, y1, r).map((q) => P(q.u, q.v, z1))))));
    s.cr.setAttribute("d", poly(ring(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, r).map((q) => P(q.u, q.v, z1))));
    s.cr.setAttribute("class", "nf lo");
    if (cls) s.sil.setAttribute("class", cls);
    return s;
  };
  // far wheel, drawbar, chassis
  mk("path", { d: wheel(2, 8), class: "sil" }, g);
  box(-38, W / 2 - 3, 4, W / 2 + 3, 12, 16, 2, g);
  box(0, 6, L - 4, W - 6, 14, HZ, 2, g);
  const jack = box(-30, W / 2 - 2, -26, W / 2 + 2, 0, 12, 1, g);
  // the body: walls, open top, and the tailgate hinged at its top
  const bodyG = mk("g", {}, g);
  const body = mk("path", { class: "sil" }, bodyG), rim = mk("path", { class: "nf lo" }, bodyG), floor = mk("path", { class: "nf lo" }, bodyG);
  const gate = mk("path", { class: "sil" }, bodyG);
  mk("path", { d: wheel(W - 8, W - 2), class: "sil" }, g);
  const hub = mk("path", { d: poly(hull(Array.from({ length: 12 }, (_, i) => { const t = i / 12 * Math.PI * 2; return P(L - 30 + 4 * Math.cos(t), W - 2, 14 + 4 * Math.sin(t)); }))), class: "nf lo" }, g);
  const outer = ring(0, 0, L, W, 4), inner = ring(3, 3, L - 3, W - 3, 2);
  const tip = tween(0.12);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    const a = rad(k * maxA);
    body.setAttribute("d", poly(hull(boxPts(outer, HZ, HZ + H, a))));
    rim.setAttribute("d", poly(inner.map((q) => rot(q.u, q.v, HZ + H, a))));
    floor.setAttribute("d", poly(inner.map((q) => rot(q.u, q.v, HZ + 3, a))));
    // tailgate hangs from the body's rear top edge, swinging out as it tips
    const ga = a * 1.6, hx = L, hz = HZ + H, gp = [];
    for (const y of [3, W - 3]) for (const [dx, dz] of [[0, 0], [3, 0], [0, -H + 2], [3, -H + 2]]) {
      const c = Math.cos(ga), s = Math.sin(ga), x = hx + dx * c - dz * s, z = hz + dx * s + dz * c;
      const ddx = x - PX, ddz = z - PZ, cc = Math.cos(a), ss = Math.sin(a);
      gp.push(P(PX + ddx * cc + ddz * ss, y, PZ - ddx * ss + ddz * cc));
    }
    gate.setAttribute("d", poly(hull(gp)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tip, now)); return !tdone(tip, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tip, on ? 1 : 0.12, performance.now(), 0);
    rim.classList.toggle("hi", true);
    body.classList.toggle("hi", false);
    gate.classList.toggle("hi", on);
    rim.classList.toggle("hi", !on);
    read.textContent = on ? "tip " + Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  const rb = boxPts(outer, 0, HZ + H, 0), bx0 = Math.min(...rb.map((p) => p[0])), bx1 = Math.max(...rb.map((p) => p[0])), by0 = Math.min(...rb.map((p) => p[1])), by1 = Math.max(...rb.map((p) => p[1]));
  function hit([sx, sy]) { return sx > bx0 && sx < bx1 && sy > by0 && sy < by1; }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; last = NaN; B.wake(); if (act) read.textContent = "tip " + Math.round(v) + "°"; }, destroy: bag.dispose };
}

hairline({
  name: "tippertrailer",
  means: "A farm trailer on one axle: the pointer tips its body up on the rear hinge, the tailgate swinging open below.",
  rules: [1, 3, 5, 6],
  range: [20, 42, 55],
  tour: [[160, 172], [219, 178], [262, 192], null],
  mount,
});
