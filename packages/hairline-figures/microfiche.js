/**
 * Microfiche reader: a boxy base, a tall hooded screen and a glass carrier in front. The pointer slides the carrier out and tips the screen back. The slider is the reach.
 *
 * The pattern: one part answering the pointer (turn / slide).
 */
const S = 2.2;
const PARTS_ = () => [
  { f: box(0, 0, 60, 52), z0: 0, z1: 10 },
  { f: box(0, 0, 60, 18), z0: 10, z1: 66, mv: 2 },
  { f: box(6, 18, 54, 19.5), z0: 18, z1: 60, mv: 2 },
  { f: box(4, 22, 56, 56), z0: 10, z1: 14, mv: 1, hi: 1 },
  { f: box(10, 26, 50, 50), z0: 14, z1: 15, mv: 1, flat: 1 },
  { f: box(26, 54, 34, 60), z0: 10, z1: 13, mv: 1 },
];
const MOVE = (p, t, m) => (m === 2 ? rot(p, "x", [0, 0, 10], rad(-14 * t)) : [p[0], p[1] + 26 * t, p[2]]);
const LABEL = (t) => "+" + Math.round(26 * t);

const { Cam, fit, proj, hull, poly, seg, rrect, circ, tween, tset, tval, tdone, mk, register, pointer, disposer, rad, clamp } = HL;
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const disk = (cx, cy, r) => circ(r, 28).map((q) => [cx + q.u, cy + q.v]);
const loop = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r, 4).map((q) => [q.u, q.v]);
function rot(p, ax, o, a) {
  const c = Math.cos(a), s = Math.sin(a), [x, y, z] = p, [ox, oy, oz] = o;
  if (ax === "y") return [ox + (x - ox) * c - (z - oz) * s, y, oz + (x - ox) * s + (z - oz) * c];
  if (ax === "x") return [x, oy + (y - oy) * c - (z - oz) * s, oz + (y - oy) * s + (z - oz) * c];
  return [ox + (x - ox) * c - (y - oy) * s, oy + (x - ox) * s + (y - oy) * c, z];
}
function mount({ stage, svg, read }, value) {
  const bag = disposer(), PARTS = PARTS_();
  let reach = value / 100;
  const C = Cam(45, 0.5, S);
  const world = (pt, k, t) => (PARTS[k].mv ? MOVE(pt, t, PARTS[k].mv) : pt);
  const ext = [];
  PARTS.forEach((pa, k) => { for (const t of [0, 1]) for (const [x, y] of pa.f) for (const z of [pa.z0, pa.z1]) ext.push(world([x, y, z], k, t)); });
  fit(C, ext, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PARTS.map((pa) => {
    const grp = mk("g", {}, g);
    return { sil: mk("path", { class: "sil" }, grp), top: mk("path", { class: pa.flat ? "nf lo" : "nf" }, grp), edge: mk("path", { class: "nf" }, grp) };
  });
  function draw(t) {
    PARTS.forEach((pa, k) => {
      const lo = pa.f.map(([x, y]) => P(...world([x, y, pa.z0], k, t))), hi = pa.f.map(([x, y]) => P(...world([x, y, pa.z1], k, t)));
      const e = els[k];
      e.sil.setAttribute("d", poly(hull(lo.concat(hi))));
      e.top.setAttribute("d", poly(hi));
      if (pa.f.length <= 4) { let j = 0; lo.forEach((q, i) => { if (q[1] > lo[j][1]) j = i; }); e.edge.setAttribute("d", seg(lo[j], hi[j])); }
    });
  }
  const tw = tween(0);
  let last = NaN;
  const B = register(stage, (_dt, now) => { const t = tval(tw, now); if (t !== last) { last = t; draw(t); } return !tdone(tw, now); });
  bag.add(B.unregister);
  els.forEach((e, k) => e.sil.classList.toggle("hi", !!PARTS[k].hi));
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const t = v ? reach : 0;
    tset(tw, t, performance.now(), 0);
    read.textContent = v ? LABEL(t) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "microfiche",
  means: "A microfiche reader: the pointer slides the glass fiche carrier out and tips the hooded screen back.",
  rules: [1, 3, 4, 5],
  range: [40, 85, 100],
  tour: [[200, 150], [220, 170], [180, 140], null],
  mount,
});
