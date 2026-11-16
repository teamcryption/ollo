/**
 * Coin bag trolley: a flat trolley stacked with three coin bags, handle at the back. The pointer rolls it forward along its floor plate; the big bag is the bright mark.
 */
const { Cam, fit, hull, poly, open, proj, rrect, circ, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [
  R(-10,-8,110,46,4,2).concat([0,1,false,false]),
  D(8,6,4,1.2).concat([1,6,true,false]),
  D(62,6,4,1.2).concat([1,6,true,false]),
  D(8,32,4,1.2).concat([1,6,true,false]),
  D(62,32,4,1.2).concat([1,6,true,false]),
  R(0,0,70,38,3,1.5).concat([6,10,true,false]),
  R(0,2,4,6,2,1).concat([10,50,true,false]),
  R(0,32,4,36,2,1).concat([10,50,true,false]),
  R(0,2,4,36,2,1).concat([46,50,true,false]),
  R(10,3,32,18,7,2).concat([10,32,true,false]),
  R(10,20,32,35,7,2).concat([10,29,true,false]),
  R(38,5,62,33,9,2).concat([10,36,true,true]),
  D(50,19,3,1).concat([36,40,true,false]),
];
// marks: [world points, closed, moves, class]
const MARKS = [];
const XF = (x, y, z, v) => [x + v, y, z];
const REST = 0, OPEN = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[-10,-8,0],[110,46,0],[110,-8,0],[-10,46,0],[0,2,50],[34,36,50],[96,20,40]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const W = (x, y, z, v, m) => P(...(m ? XF(x, y, z, v) : [x, y, z]));
  const lift = (r, z, v, m) => r.map((q) => W(q.u, q.v, z, v, m));
  const items = [];
  PARTS.forEach(([r, i, z0, z1, m, hi], k) => {
    const s = solid(g);
    if (hi) s.sil.classList.add("hi");
    items.push({ k: "p", r, i, z0, z1, m, s });
    for (const mm of MARKS) if (mm[4] === k) items.push({ k: "m", pts: mm[0], c: mm[1], m: mm[2], el: mk("path", { class: mm[3] }, g) });
  });
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    const first = last !== last;
    last = v;
    for (const p of items) {
      if (!p.m && !first) continue;
      if (p.k === "m") { const q = p.pts.map(([x, y, z]) => W(x, y, z, v, p.m)); p.el.setAttribute("d", p.c ? poly(q) : open(q)); continue; }
      p.s.sil.setAttribute("d", poly(hull(lift(p.r, p.z0, v, p.m).concat(lift(p.r, p.z1, v, p.m)))));
      p.s.cr.setAttribute("d", poly(lift(p.i, p.z1, v, p.m)));
    }
  }
  draw(REST);
  const tw = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const box = [[-10,-8,0],[110,46,0],[110,-8,0],[-10,46,0],[0,2,50],[34,36,50],[96,20,40]].map(([x, y, z]) => P(x, y, z));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const [ax, bx, ay, by] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? REST + (OPEN - REST) * reach : REST, performance.now(), 0);
    read.textContent = o ? "roll" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > ax && x < bx && y > ay && y < by), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(tw, REST + (OPEN - REST) * reach, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "vaultcart",
  means: "A trolley of coin bags on its floor plate: the pointer rolls it forward, the big bag bright.",
  rules: [1, 4, 5, 6, 8, 9],
  range: [0.4, 0.9, 1],
  tour: [[200, 142], [143, 160], [257, 182], null],
  mount,
});
