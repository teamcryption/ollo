/**
 * PC case: a desktop tower, its front with drive bays and a power light, and
 * a side panel hinged at the back edge. The pointer over the case swings the
 * panel wide to show the board, fan and graphics card inside; at rest the
 * panel stands ajar, bright. The slider is how far the panel swings.
 */
const {
  Cam, circ, fit, flatDot, hull, place, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 26, D = 56, H = 58, T = 2, REST = 16;

function inside(pt, poly) {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const c = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]);
    if (c !== 0) { if (s && Math.sign(c) !== s) return false; s = Math.sign(c); }
  }
  return true;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, H], [W + D, 0, 0], [W + D, 0, H], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, W, D, 4, 1.4);
  const body = solid(g);
  put(body, prism(P, front, r0, i0, 0, H));
  // front: two drive bays, a vent stack and the power light
  let fr = seg(P(5, D, H - 8), P(W - 5, D, H - 8)) + seg(P(5, D, H - 14), P(W - 5, D, H - 14));
  for (let k = 0; k < 6; k++) fr += seg(P(7, D, 8 + k * 4), P(W - 7, D, 8 + k * 4));
  mk("path", { class: "nf lo", d: fr }, body.g);
  place(flatDot(body.g, C, 1.6, "dot m"), P(W / 2, D, H - 4));
  // inside, on the open side: board, rear fan, graphics card, power supply
  const X = W - 0.5;
  const yz = (pts) => pts.map(([y, z]) => P(X, y, z));
  const fan = circ(7, 20).map((q) => [11 + q.u, 44 + q.v]);
  const hub = circ(2, 10).map((q) => [11 + q.u, 44 + q.v]);
  let ins = poly(yz([[4, 16], [40, 16], [40, 54], [4, 54]])) + poly(yz(fan)) + poly(yz(hub));
  ins += poly(yz([[6, 24], [46, 24], [46, 29], [6, 29]])) + poly(yz([[4, 4], [30, 4], [30, 12], [4, 12]]));
  ins += poly(yz([[24, 40], [34, 40], [34, 50], [24, 50]]));
  mk("path", { class: "nf lo", d: ins }, g);

  const pan = solid(g);
  const pr = rrect(0, 0, D, H, 4, 4), pi = rrect(2.2, 2.2, D - 2.2, H - 2.2, 2.4, 4);
  pan.cr.setAttribute("class", "nf lo");
  pan.sil.classList.add("hi");
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const xf = (v, w, t) => P(W + t * c + v * s, v * c - t * s, w);
    const pts = [];
    for (const q of pr) pts.push(xf(q.u, q.v, 0), xf(q.u, q.v, T));
    const t = c > s ? T : 0;
    let d = poly(pi.map((q) => xf(q.u, q.v, t)));
    for (let k = 0; k < 5; k++) d += seg(xf(8, 18 + k * 5, t), xf(18, 18 + k * 5, t));
    pan.sil.setAttribute("d", poly(hull(pts)));
    pan.cr.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const rest = [];
  for (const [x, y] of [[0, 0], [W, 0], [W, D], [0, D], [W + D * 0.28, D * 0.96]]) rest.push(P(x, y, 0), P(x, y, H));
  const area = hull(rest);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : maxA, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p, area) ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "pcside",
  means: "A PC tower: the pointer over the case swings its side panel open on the rear hinge to show the board and fan.",
  rules: [1, 5, 6, 8],
  range: [40, 80, 100],
  tour: [[167, 154], [150, 210], [185, 110], null],
  mount,
});
