/**
 * Endorsement stamp: a self-inking stamp held over a cheque, the faint print of its face already on the paper. The pointer presses it down onto the cheque; the handle is the bright mark.
 */
const { Cam, fit, hull, poly, open, proj, rrect, circ, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [
  R(-45,-28,45,28,3,1.5).concat([0,1.5,false,false]),
  R(-20,-13,20,13,3,1.5).concat([1.5,6,true,false]),
  R(-16,-10,16,10,4,1.5).concat([6,26,true,false]),
  R(-10,-7,10,7,6,1.5).concat([26,40,true,true]),
];
// marks: [world points, closed, moves, class]
const MARKS = [[[[-16,-10,1.5],[16,-10,1.5],[16,10,1.5],[-16,10,1.5]],true,false,'nf lo',0],[[[-38,20,1.5],[-8,20,1.5]],false,false,'nf lo',0]];
const XF = (x, y, z, v) => [x, y, z + v];
const REST = 30, OPEN = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-45,-28,0],[45,28,0],[45,-28,0],[-45,28,0],[-20,-13,70],[20,13,70]], 200, 166);
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
  const box = [[-45,-28,0],[45,28,0],[45,-28,0],[-45,28,0],[-20,-13,70],[20,13,70]].map(([x, y, z]) => P(x, y, z));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const [ax, bx, ay, by] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? REST + (OPEN - REST) * reach : REST, performance.now(), 0);
    read.textContent = o ? "press" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > ax && x < bx && y > ay && y < by), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(tw, REST + (OPEN - REST) * reach, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "chequestamp2",
  means: "A self-inking stamp over a cheque: the pointer presses it down onto the paper where its print already shows.",
  rules: [1, 4, 5, 6, 8, 9],
  range: [0.4, 0.9, 1],
  tour: [[200, 80], [140, 143], [260, 157], null],
  mount,
});
