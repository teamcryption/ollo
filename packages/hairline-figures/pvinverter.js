/**
 * Inverter: a solar inverter box hung on a wall plate, conduits running out
 * of its base, and a front cover hinged on its left edge. Over the box the
 * cover swings open on its hinge, showing the terminals inside. At rest the
 * cover stands just ajar, bright. The slider is how far it opens.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 30, D = 10, Z0 = 14, Z1 = 54, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[-6, -3, 0], [W + 6, -3, Z1 + 6], [-6, -3, Z1 + 6], [W + 6, D, 0], [0, D + W, Z0], [0, D + W, Z1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function box(s, x0, y0, x1, y1, z0, z1, r, b) { const [a, i] = rings(x0, y0, x1, y1, r || 1.2, b || 0.6); put(s, prism(P, front, a, i, z0, z1)); }

  const wall = solid(g); box(wall, -6, -4, W + 6, -2, 0, Z1 + 6, 1, 0.5);
  const body = solid(g); box(body, 0, -2, W, D, Z0, Z1, 2, 0.8);
  let d = "";
  for (let k = 0; k < 4; k++) d += seg(P(6 + k * 6, D, Z0 + 6), P(6 + k * 6, D, Z0 + 14));
  d += poly([P(6, D, Z1 - 16), P(24, D, Z1 - 16), P(24, D, Z1 - 7), P(6, D, Z1 - 7)]);
  mk("path", { class: "nf lo", d }, body.g);
  [8, 22].forEach((x) => { const s = solid(g); box(s, x - 2, 2, x + 2, 6, 0, Z0, 2, 0.5); });
  const cover = mk("path", { class: "sil" }, g), cline = mk("path", { class: "nf lo" }, g);

  const ang = spring(REST, { k: 80, c: 15 });
  let last = NaN;
  function Q(u, t, z, th) { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return P(u * c - t * s, D + u * s + t * c, z); }
  function draw(th) {
    if (th === last) return; last = th;
    const pts = [];
    [0, W].forEach((u) => [0, 2].forEach((t) => [Z0, Z1].forEach((z) => pts.push(Q(u, t, z, th)))));
    cover.setAttribute("d", poly(hull(pts)));
    cline.setAttribute("d", seg(Q(W - 4, 2, Z0 + 12, th), Q(W - 4, 2, Z1 - 12, th)) + seg(Q(0, 2, Z0 + 4, th), Q(0, 2, Z0 + 10, th)) + seg(Q(0, 2, Z1 - 10, th), Q(0, 2, Z1 - 4, th)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const hb = hull([[-6, -4, 0], [W + 6, -4, 0], [W, D + 2, Z0], [-6, -4, Z1 + 6], [W + 6, -4, Z1 + 6], [W, D + 2, Z1]].map((p) => P(...p)));
  const xs = hb.map((p) => p[0]), ys = hb.map((p) => p[1]);
  const L = Math.min(...xs), R = Math.max(...xs), T = Math.min(...ys), Bt = Math.max(...ys);
  let on = null;
  function set(o) {
    if (o === on) return; on = o;
    ang.t = o ? clamp(REST + 98 * reach, REST, 110) : REST;
    cover.classList.toggle("hi", true);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false); draw(REST);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(sx > L && sx < R && sy > T && sy < Bt), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { ang.t = REST + 98 * v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pvinverter",
  means: "A solar inverter on a wall: over it the front cover swings open on its left hinge, showing the terminals inside.",
  rules: [1, 3, 5, 6],
  range: [0.4, 0.8, 1],
  tour: [[209, 139], [196, 150], [222, 165], null],
  mount,
});
