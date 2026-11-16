/**
 * Paper clip dish: a round magnetic dish on a low puck, paper clips lying in it. The pointer tips the dish towards the reader. The slider is the tip.
 *
 * The pattern: one part answering the pointer (turn / slide).
 */
const S = 3.6;
const PARTS_ = () => [
  { f: disk(0, 0, 22), z0: 0, z1: 5 },
  { f: disk(0, 0, 36), z0: 6, z1: 13, mv: 1 },
  { f: disk(0, 0, 32), z0: 11, z1: 11.5, mv: 1, flat: 1 },
  { f: loop(-22, -12, 6, -4, 4), z0: 11.5, z1: 12.5, mv: 1, hi: 1 },
  { f: loop(-4, 4, 22, 12, 4), z0: 11.5, z1: 12.5, mv: 1 },
  { f: loop(-14, -24, -6, 0, 4), z0: 12.5, z1: 13.5, mv: 1 },
  { f: loop(8, -20, 16, 4, 4), z0: 12.5, z1: 13.5, mv: 1 },
  { f: loop(-18, 10, -10, 26, 4), z0: 11.5, z1: 12.5, mv: 1 },
];
const MOVE = (p, t) => rot(p, "x", [0, 0, 6], rad(-30 * t));
const LABEL = (t) => Math.round(30 * t) + "°";

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
  name: "paperclip2",
  means: "A round magnetic dish of paper clips on a puck: the pointer tips the dish up towards you to show the clips.",
  rules: [1, 3, 4, 5],
  range: [40, 85, 100],
  tour: [[200, 150], [220, 170], [180, 140], null],
  mount,
});
