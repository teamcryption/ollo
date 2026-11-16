/**
 * Time lock: a vault time lock case with three clock dials on its face behind a hinged cover. The pointer swings the cover open; the cover is the bright mark.
 */
const { Cam, fit, hull, poly, open, proj, rrect, circ, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [
  R(0,0,24,80,3,1.5).concat([0,50,false,false]),
  R(24,0,27,80,1,0.6).concat([2,48,true,true]),
];
// marks: [world points, closed, moves, class]
const MARKS = [[[[24.2,27.00,26.00],[24.2,26.69,28.33],[24.2,25.79,30.50],[24.2,24.36,32.36],[24.2,22.50,33.79],[24.2,20.33,34.69],[24.2,18.00,35.00],[24.2,15.67,34.69],[24.2,13.50,33.79],[24.2,11.64,32.36],[24.2,10.21,30.50],[24.2,9.31,28.33],[24.2,9.00,26.00],[24.2,9.31,23.67],[24.2,10.21,21.50],[24.2,11.64,19.64],[24.2,13.50,18.21],[24.2,15.67,17.31],[24.2,18.00,17.00],[24.2,20.33,17.31],[24.2,22.50,18.21],[24.2,24.36,19.64],[24.2,25.79,21.50],[24.2,26.69,23.67]],true,false,'nf',0],[[[24.2,49.00,26.00],[24.2,48.69,28.33],[24.2,47.79,30.50],[24.2,46.36,32.36],[24.2,44.50,33.79],[24.2,42.33,34.69],[24.2,40.00,35.00],[24.2,37.67,34.69],[24.2,35.50,33.79],[24.2,33.64,32.36],[24.2,32.21,30.50],[24.2,31.31,28.33],[24.2,31.00,26.00],[24.2,31.31,23.67],[24.2,32.21,21.50],[24.2,33.64,19.64],[24.2,35.50,18.21],[24.2,37.67,17.31],[24.2,40.00,17.00],[24.2,42.33,17.31],[24.2,44.50,18.21],[24.2,46.36,19.64],[24.2,47.79,21.50],[24.2,48.69,23.67]],true,false,'nf',0],[[[24.2,71.00,26.00],[24.2,70.69,28.33],[24.2,69.79,30.50],[24.2,68.36,32.36],[24.2,66.50,33.79],[24.2,64.33,34.69],[24.2,62.00,35.00],[24.2,59.67,34.69],[24.2,57.50,33.79],[24.2,55.64,32.36],[24.2,54.21,30.50],[24.2,53.31,28.33],[24.2,53.00,26.00],[24.2,53.31,23.67],[24.2,54.21,21.50],[24.2,55.64,19.64],[24.2,57.50,18.21],[24.2,59.67,17.31],[24.2,62.00,17.00],[24.2,64.33,17.31],[24.2,66.50,18.21],[24.2,68.36,19.64],[24.2,69.79,21.50],[24.2,70.69,23.67]],true,false,'nf',0],[[[24.2,18,26],[24.2,22,32]],false,false,'nf',0],[[[24.2,40,26],[24.2,34,29]],false,false,'nf',0],[[[24.2,62,26],[24.2,62,33]],false,false,'nf',0],[[[27.2,70,22],[27.2,70,30]],false,true,'nf',1]];
const XF = (x, y, z, v) => { const a = rad(v), c = Math.cos(a), s = Math.sin(a), dx = x - 24; return [24 + dx * c + y * s, -dx * s + y * c, z]; };
const REST = 28, OPEN = 105;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0,0,0],[24,80,0],[24,0,0],[0,80,0],[0,0,50],[101,-20,50],[101,-20,0],[61,70,50]], 200, 166);
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
  const box = [[0,0,0],[24,80,0],[24,0,0],[0,80,0],[0,0,50],[101,-20,50],[101,-20,0],[61,70,50]].map(([x, y, z]) => P(x, y, z));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const [ax, bx, ay, by] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? REST + (OPEN - REST) * reach : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > ax && x < bx && y > ay && y < by), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(tw, REST + (OPEN - REST) * reach, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "safeclock",
  means: "A vault time lock: the pointer swings its cover open to show the three clock dials that hold the door shut.",
  rules: [1, 4, 5, 6, 8, 9],
  range: [0.4, 0.9, 1],
  tour: [[180, 141], [109, 190], [193, 167], null],
  mount,
});
