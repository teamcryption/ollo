/**
 * Nutcracker: a lever nutcracker lying on the counter, two long handles
 * joined at a hinge block, a walnut beside it. The pointer over the
 * nutcracker swings the upper handle open about its hinge; leaving lets it
 * fall back to a slight gap. At rest the walnut is bright. The slider is how
 * far the handle opens.
 */
const { Cam, fit, proj, rrect, circ, hull, poly, unproj, clamp, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid } = HL;

const L = 96, W = 5, T = 5, HZ = 8, REST = 8;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-10, -8, 0], [L, 8, 0], [40, 30, 0], [-10, 8, 0], [L * Math.cos(rad(70)), 0, HZ + L * Math.sin(rad(70)) + 6]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const slab = (ring, z0, z1, f) => {
    const pts = [];
    for (const z of [z0, z1]) for (const q of ring) pts.push(P(...f(q.u, q.v, z)));
    return poly(hull(pts));
  };
  const id = (x, y, z) => [x, y, z];
  const arm = rrect(0, -W, L, W, 4, 4), armIn = rrect(1.5, -W + 1.5, L - 1.5, W - 1.5, 3, 4);
  // hinge block
  const hb = solid(g);
  hb.sil.setAttribute("d", slab(rrect(-10, -7, 6, 7, 4, 4), 0, HZ + T + 3, id));
  hb.cr.setAttribute("d", poly(rrect(-8.5, -5.5, 4.5, 5.5, 3, 4).map((q) => P(q.u, q.v, HZ + T + 3))));
  mk("circle", { class: "dot off", r: 1.6, cx: P(-2, 7, 9)[0], cy: P(-2, 7, 9)[1] }, g);
  // lower handle
  const lo = solid(g);
  lo.sil.setAttribute("d", slab(arm, 0, T, id));
  lo.cr.setAttribute("d", poly(armIn.map((q) => P(q.u, q.v, T))));
  // jaw teeth on the lower handle
  for (const x of [8, 13, 18]) mk("path", { class: "lo nf", d: poly([P(x, -W + 1, T), P(x + 2, -W + 1, T), P(x + 2, W - 1, T), P(x, W - 1, T)]) }, g);
  // upper handle
  const up = solid(g);
  const nut = solid(g);
  const nutPts = [];
  for (let i = -3; i <= 3; i++) { const z = 7 + 7 * Math.sin((i / 3) * Math.PI / 2); nutPts.push(...disc(36, 24, 7 * Math.cos((i / 3) * Math.PI / 2) + 0.01).map((q) => P(q.u, q.v, z))); }
  nut.sil.setAttribute("d", poly(hull(nutPts)));
  nut.cr.setAttribute("d", poly(Array.from({ length: 13 }, (_, i) => { const a = (i / 12) * Math.PI; return P(36 + 7 * Math.cos(a) * 0.7, 24 - 7 * Math.cos(a) * 0.7, 7 + 7 * Math.sin(a)); })));
  nut.cr.classList.add("nf");

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const f = (x, y, z) => [x * c - z * s, y, HZ + x * s + z * c];
    up.sil.setAttribute("d", slab(arm, 0, T, f));
    up.cr.setAttribute("d", poly(armIn.map((q) => P(...f(q.u, q.v, T)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? amp : REST, performance.now(), 0);
    up.sil.classList.toggle("hi", v);
    nut.sil.classList.toggle("hi", !v);
    read.textContent = v ? "open " + Math.round(amp) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    for (const z of [0, 12]) { const [x, y] = unproj(C, sx, sy, z); if (x > -14 && x < L + 4 && y > -14 && y < 32) return true; }
    return false;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "nutcracker",
  means: "A lever nutcracker beside a walnut: the pointer swings the upper handle open about its hinge.",
  rules: [1, 3, 5, 9],
  range: [30, 55, 70],
  tour: [[248, 248], [205, 232], [290, 280], null],
  mount,
});
