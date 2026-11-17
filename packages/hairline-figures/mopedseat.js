/**
 * Scooter seat: a step-through moped with its long seat hinged at the front
 * edge. At rest the seat sits a little ajar, bright. Over the moped the seat
 * swings up on its hinge to show the helmet in the storage well under it.
 * The slider is how far the seat opens.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const HX = 38, HZ = 32, L = 36, W = 10, T = 4, REST = 12;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, -17, 0], [86, 17, 0], [0, 0, 32], [HX, -W, HZ + L], [HX, W, HZ + L], [70, 0, 52], [86, 0, 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  function wheel(cx) {
    const ring = circ(10, 28), hub = circ(4.5, 20), s = solid(g);
    const pts = [-2.5, 2.5].flatMap((y) => ring.map((q) => P(cx + q.u, y, 10 + q.v)));
    put(s, { sil: poly(hull(pts)), crease: poly(hub.map((q) => P(cx + q.u, 2.5, 10 + q.v))) });
  }
  wheel(14);
  box(0, -W, 42, W, 7, 1.6, 14, HZ);
  // the storage well and the helmet resting in it
  mk("path", { d: poly(rrect(4, -7, 34, 7, 5, 6).map((q) => P(q.u, q.v, HZ))), class: "nf lo" }, g);
  const dome = [];
  for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); dome.push(...circ(7 * Math.cos(t), 20).map((q) => P(20 + q.u, q.v, HZ + 3.5 * Math.sin(t)))); }
  mk("path", { d: poly(hull(dome)), class: "nf" }, g);
  // the seat
  const seat = solid(g);
  seat.sil.classList.add("hi");
  const sr = rrect(0, -W, L, W, 6, 6), si = rrect(2, -W + 2, L - 2, W - 2, 4.5, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(toR(a)), s = Math.sin(toR(a));
    const Tf = (u, v, w) => P(HX - u * c + w * s, v, HZ + u * s + w * c);
    const pts = sr.map((q) => Tf(q.u, q.v, 0)).concat(sr.map((q) => Tf(q.u, q.v, T)));
    put(seat, { sil: poly(hull(pts)), crease: poly(si.map((q) => Tf(q.u, q.v, T))) });
  }
  box(40, -9, 66, 9, 3, 1.2, 10, 14);
  box(62, -9, 70, 9, 3, 1.2, 10, 48);
  wheel(76);
  box(64, -17, 68, 17, 2, 0.8, 48, 51);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(40, 0, 20);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 160; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "mopedseat",
  means: "A step-through moped: over it, the long seat swings up on its front hinge to show the helmet stowed underneath.",
  rules: [1, 3, 5, 8],
  range: [40, 75, 100],
  tour: [[151, 115], [189, 60], [240, 200], null],
  mount,
});
