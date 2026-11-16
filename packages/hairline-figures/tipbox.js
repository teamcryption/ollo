/**
 * Tip box: a box with a slot cut in its lid and coins lying inside. The pointer swings the lid open on its back hinge; the lid is the bright mark.
 */
const { Cam, fit, hull, poly, open, proj, rrect, circ, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [
  R(0,0,50,40,4,1.8).concat([0,30,false,false]),
  R(0,0,50,40,4,1.8).concat([30,38,true,true]),
];
// marks: [world points, closed, moves, class]
const MARKS = [[[[22.00,14.00,30],[21.71,15.85,30],[20.85,17.53,30],[19.53,18.85,30],[17.85,19.71,30],[16.00,20.00,30],[14.15,19.71,30],[12.47,18.85,30],[11.15,17.53,30],[10.29,15.85,30],[10.00,14.00,30],[10.29,12.15,30],[11.15,10.47,30],[12.47,9.15,30],[14.15,8.29,30],[16.00,8.00,30],[17.85,8.29,30],[19.53,9.15,30],[20.85,10.47,30],[21.71,12.15,30]],true,false,'nf lo',0],[[[36.00,26.00,30],[35.71,27.85,30],[34.85,29.53,30],[33.53,30.85,30],[31.85,31.71,30],[30.00,32.00,30],[28.15,31.71,30],[26.47,30.85,30],[25.15,29.53,30],[24.29,27.85,30],[24.00,26.00,30],[24.29,24.15,30],[25.15,22.47,30],[26.47,21.15,30],[28.15,20.29,30],[30.00,20.00,30],[31.85,20.29,30],[33.53,21.15,30],[34.85,22.47,30],[35.71,24.15,30]],true,false,'nf lo',0],[[[41.00,12.00,30],[40.76,13.55,30],[40.05,14.94,30],[38.94,16.05,30],[37.55,16.76,30],[36.00,17.00,30],[34.45,16.76,30],[33.06,16.05,30],[31.95,14.94,30],[31.24,13.55,30],[31.00,12.00,30],[31.24,10.45,30],[31.95,9.06,30],[33.06,7.95,30],[34.45,7.24,30],[36.00,7.00,30],[37.55,7.24,30],[38.94,7.95,30],[40.05,9.06,30],[40.76,10.45,30]],true,false,'nf lo',0],[[[22,8,38],[27,8,38],[27,32,38],[22,32,38]],true,true,'nf lo',1]];
const XF = (x, y, z, v) => { const a = rad(v), c = Math.cos(a), s = Math.sin(a), h = z - 30; return [x * c - h * s, y, 30 + x * s + h * c]; };
const REST = 8, OPEN = 78;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3);
  fit(C, [[0,0,0],[50,40,0],[50,0,0],[0,40,0],[-8,0,32],[-8,40,32],[10,0,86],[10,40,86]], 200, 166);
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
  const box = [[0,0,0],[50,40,0],[50,0,0],[0,40,0],[-8,0,32],[-8,40,32],[10,0,86],[10,40,86]].map(([x, y, z]) => P(x, y, z));
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
  name: "tipbox",
  means: "A tip box with a slot in its lid: the pointer swings the lid open on its back hinge to show the coins.",
  rules: [1, 4, 5, 6, 8, 9],
  range: [0.4, 0.9, 1],
  tour: [[219, 169], [166, 218], [262, 224], null],
  mount,
});
