/**
 * Pet hammock: a cat bed slung on four cables from two suction cups on a
 * window. The pointer over the figure swings the bed out from the glass on
 * its cups. At rest the bed hangs a little out, bright. Slider: unused stagger.
 *
 * The pattern: one part, one gesture.
 */
const { Cam, fit, proj, rrect, circ, hull, poly, open, tween, tset, tval, tdone, mk, solid, pointer, register, disposer } = HL;
const BOX = (x0, y0, z0, x1, y1, z1, r = 2, b = 1.2) => {
  const o = rrect(x0, y0, x1, y1, r, 4), i = rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.3), 4);
  return { a: o.map((q) => [q.u, q.v, z0]), b: o.map((q) => [q.u, q.v, z1]), c: i.map((q) => [q.u, q.v, z1]) };
};
const CYL = (ax, cx, cy, cz, R, l0, l1) => {
  const m = (R2, l) => circ(R2, 28).map((q) => ax === "z" ? [cx + q.u, cy + q.v, l] : ax === "x" ? [l, cy + q.u, cz + q.v] : [cx + q.u, l, cz + q.v]);
  return { a: m(R, l0), b: m(R, l1), c: m(Math.max(R - 1, R * 0.6), l1) };
};
const ROD = (p, q, R) => { const e = (c) => [[R, 0, 0], [-R, 0, 0], [0, R, 0], [0, -R, 0], [0, 0, R], [0, 0, -R]].map((d) => [c[0] + d[0], c[1] + d[1], c[2] + d[2]]); return { a: e(p), b: e(q), c: [] }; };
const rot = (ax, p, t) => {
  const c = Math.cos(t), s = Math.sin(t);
  return ax === "x" ? [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c] : [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const S = 2.0, AX = "x", ANS = 0.5, NB = 0.2, REST = [0.1], FAV = 0, HIT = [0, 20, -30], HW = 150, HH = 150;
const NAME = () => "bed";
const BED = [ROD([-34, 1, 0], [-34, 4, -44], 0.8), ROD([34, 1, 0], [34, 4, -44], 0.8), CYL("y", -34, 0, 0, 5, 0, 3), CYL("y", 34, 0, 0, 5, 0, 3), BOX(-38, 2, -48, 38, 46, -42, 6, 2), ROD([-34, 1, 0], [-34, 44, -44], 0.8), ROD([34, 1, 0], [34, 44, -44], 0.8)];
const ITEMS = [{ o: [0, 0, 92], parts: BED, main: 4 }];
const STATIC_BACK = [BOX(-52, -5, 0, 52, 0, 110, 4, 1.6), BOX(-46, 0, 6, 46, 1, 104, 3, 1), BOX(-1.5, 1, 6, 1.5, 2, 104, 1, 0.4), BOX(-46, 1, 54, 46, 2, 57, 1, 0.4)];
const STATIC_FRONT = [];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  const xf = (it, t) => (p) => { const q = rot(AX, p, t); return [q[0] + it.o[0], q[1] + it.o[1], q[2] + it.o[2]]; };
  const fitPts = [];
  for (const pt of STATIC_BACK.concat(STATIC_FRONT)) fitPts.push(...pt.a, ...pt.b);
  for (const it of ITEMS) for (const t of [ANS, ...REST]) for (const pt of it.parts) if (pt.a) fitPts.push(...pt.a.map(xf(it, t)), ...pt.b.map(xf(it, t)));
  fit(C, fitPts, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const paint = (parent, pt, f) => {
    if (pt.w) return { pt, el: mk("path", { class: "nf" }, parent) };
    const s = solid(parent);
    return { pt, s };
  };
  const show = (o, f) => {
    if (o.el) { o.el.setAttribute("d", open([P(...o.pt.w), P(...f(o.pt.l))])); return; }
    o.s.sil.setAttribute("d", poly(hull(o.pt.a.concat(o.pt.b).map((p) => P(...f(p))))));
    o.s.cr.setAttribute("d", o.pt.c.length ? poly(o.pt.c.map((p) => P(...f(p)))) : "");
  };
  const id = (p) => p;
  for (const pt of STATIC_BACK) show(paint(g, pt), id);
  const items = ITEMS.map((it, k) => {
    const grp = mk("g", {}, g);
    const els = it.parts.map((pt) => paint(grp, pt));
    return { ...it, k, els, t: tween(REST[k]), last: NaN };
  });
  for (const pt of STATIC_FRONT) show(paint(g, pt), id);
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const f = xf(it, t);
    for (const o of it.els) show(o, f);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.o[0] + HIT[0], it.o[1] + HIT[1], it.o[2] + HIT[2]));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < HW && Math.abs(mids[best][1] - sy) < HH ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), t = a < 0 ? REST[k] : d === 0 ? ANS : d === 1 ? NB : REST[k] * 0.4;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const m = it.els[it.main].s;
      m.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : NAME(a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pethammock",
  means: "A cat hammock slung from suction cups on a window: with the pointer on it, the bed swings out from the glass.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 165], [196, 193], [253, 222], null],
  mount,
});
