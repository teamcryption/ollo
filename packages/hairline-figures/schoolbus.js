/**
 * School bus: a bus parked at the kerb, rear wheel and front wheel on the
 * side we see, a row of windows and a short hood. On its side is the stop
 * arm, an octagon on a hinge. At rest it is half out, bright; the pointer
 * over the bus swings it all the way out. The slider is how far it swings.
 *
 * The pattern: one part on a hinge (swing).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, ringAt, rrect, clamp, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 112, W = 34, Z0 = 4, ZT = 44, HX = L - 16, HZ = 28, ARM = 13, R = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-14, -10, 0], [L + 30, -10, 0], [L + 30, W + 34, 0], [-14, W + 34, 0], [0, 0, ZT + 2], [HX, W + ARM + R + 2, HZ + R]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(-14, -10, L + 30, W + 34, 6, 2, 0, Z0);
  const body = box(0, 0, L, W, 7, 2, Z0 + 3, ZT);
  // a flat shape on the side face (y = W) or the front face (x = L)
  const side = (x0, x1, z0, z1, r = 2) => fillet([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], [r, r, r, r]).map(([u, z]) => P(u, W, z));
  const face = (y0, y1, z0, z1, r = 2) => fillet([[y1, z0], [y0, z0], [y0, z1], [y1, z1]], [r, r, r, r]).map(([v, z]) => P(L, v, z));
  for (let i = 0; i < 6; i++) mk("path", { d: poly(side(8 + i * 14, 19 + i * 14, 27, 37)), class: "nf lo" }, g);
  mk("path", { d: open([P(3, W, 23), P(L - 3, W, 23)]) + open([P(3, W, 20), P(L - 3, W, 20)]), class: "nf lo" }, g);
  mk("path", { d: poly(face(5, W - 5, 29, 39)), class: "nf lo" }, g);
  box(L - 4, 4, L + 16, W - 4, 5, 1.5, Z0 + 3, 27);
  const wheel = (x) => {
    const ring = (r) => Array.from({ length: 28 }, (_, k) => P(x + r * Math.cos((k / 28) * 2 * Math.PI), W + 0.5, Z0 + 8 + r * Math.sin((k / 28) * 2 * Math.PI)));
    mk("path", { d: poly(ring(8.5)) }, g);
    mk("path", { d: poly(ring(3.5)), class: "nf lo" }, g);
  };
  wheel(24); wheel(L + 4);

  // the stop arm: a stem and an octagon in the plane of its swing
  const arm = solid(g), inner = mk("path", { class: "nf lo" }, arm.g);
  const oct = (r) => fillet(Array.from({ length: 8 }, (_, k) => { const t = rad(22.5 + 45 * k); return [ARM + r * Math.cos(t), HZ + r * Math.sin(t)]; }), Array(8).fill(1), 2);
  const O = oct(R), I = oct(R * 0.72);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const dx = -Math.cos(rad(a)), dy = Math.sin(rad(a)), nx = dy * 0.8, ny = -dx * 0.8;
    const at = (pts, o) => pts.map(([u, z]) => P(HX + dx * u + o * nx, W + 1 + dy * u + o * ny, z));
    arm.sil.setAttribute("d", poly(hull(at(O, 0).concat(at(O, 1), [P(HX, W + 1, HZ - 1.5), P(HX, W + 1, HZ + 1.5)]))));
    arm.cr.setAttribute("d", poly(at(I, 0)));
  }
  const ang = tween(30);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit: the bus's rest silhouette on screen
  const shape = hull([0, L + 16].flatMap((x) => [0, W].flatMap((y) => [P(x, y, Z0), P(x, y, ZT)])));
  const inside = ([sx, sy]) => shape.every((a, i) => { const b = shape[(i + 1) % shape.length]; return (b[0] - a[0]) * (sy - a[1]) - (b[1] - a[1]) * (sx - a[0]) >= 0; }) || shape.every((a, i) => { const b = shape[(i + 1) % shape.length]; return (b[0] - a[0]) * (sy - a[1]) - (b[1] - a[1]) * (sx - a[0]) <= 0; });
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? clamp(reach, 30, 100) : 30, performance.now(), 0);
    arm.sil.classList.add("hi");
    read.textContent = v ? "stop" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(ang, clamp(v, 30, 100), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "schoolbus",
  means: "A school bus at the kerb: the pointer over it swings the stop arm out from its side.",
  rules: [1, 4, 5, 8],
  range: [40, 90, 100],
  tour: [[209, 142], [150, 165], [262, 178], null],
  mount,
});
