/**
 * Room service cart: a two-shelf trolley on casters with a push handle at
 * one end and a domed cloche on its top. The cart rolls along its length to
 * follow the pointer, and while the pointer is near, the cloche lifts off
 * its plate. At rest the cart stands a little off centre with the dome
 * ajar, bright. The slider is how far the cart may roll.
 *
 * The pattern: a whole object following the pointer on a spring.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, clamp, spring, stepS, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, seg, solid,
} = HL;

const L = 80, W = 36, TZ = 40, SZ = 12, R0 = -6, DR = 13, LIFT = 16;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = 4 + value * 0.2;
  const C = Cam(45, 0.5, 2.2);
  const MX = 22;
  fit(C, [[-12 - MX, -2, 0], [L + MX, W + 2, 0], [L + MX, -2, 0], [-12 - MX, W + 2, 0], [-12 - MX, W / 2, TZ + 14], [L + MX - 30, W / 2, TZ + 2 + DR + LIFT + 6]], 200, 172);
  const P = proj(C), front = facing(C);
  const o = P(0, 0, 0), ox = P(1, 0, 0);
  const g = mk("g", {}, svg);
  // casters, then the lower legs, then the shelf, then the upper legs
  const legs = [[4, 4], [L - 4, 4], [4, W - 4], [L - 4, W - 4]];
  for (const [x, y] of legs) put(solid(g), prism(P, front, disc(x, y, 3, 20), disc(x, y, 1.6, 20), 0, 4));
  for (const [x, y] of legs) put(solid(g), prism(P, front, disc(x, y, 1.2, 12), disc(x, y, 0.6, 12), 4, SZ));
  const [sr, si] = rings(0, 0, L, W, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, SZ, SZ + 2));
  for (const [x, y] of legs) put(solid(g), prism(P, front, disc(x, y, 1.2, 12), disc(x, y, 0.6, 12), SZ + 2, TZ));
  // the push handle at the far end
  const hd = [[0, 6, TZ], [-9, 6, TZ + 12], [-9, W - 6, TZ + 12], [0, W - 6, TZ]].map((p) => P(...p));
  mk("path", { d: seg(hd[0], hd[1]) + seg(hd[1], hd[2]) + seg(hd[2], hd[3]), class: "nf lo" }, g);
  const [tr, ti] = rings(0, 0, L, W, 5, 2);
  put(solid(g), prism(P, front, tr, ti, TZ, TZ + 2.5));
  // a plate and its cloche
  const cx = L - 26, cy = W / 2, PZ = TZ + 2.5;
  put(solid(g), prism(P, front, disc(cx, cy, DR + 3), disc(cx, cy, DR), PZ, PZ + 1.4));
  const mound = [];
  for (const [r, z] of [[8, 0], [6, 2.5], [3, 4.5]]) mound.push(...ringAt(P, disc(cx, cy, r, 20), PZ + 1.4 + z));
  mk("path", { d: poly(hull(mound)), class: "nf" }, g);
  const dome = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);

  const REST = 8, AJAR = 0.3;
  const sx = spring(REST), lid = tween(AJAR);
  let lastX = NaN, lastL = NaN;
  function draw(x, l) {
    if (x !== lastX) { lastX = x; g.setAttribute("transform", `translate(${(ox[0] - o[0]) * x} ${(ox[1] - o[1]) * x})`); }
    if (l === lastL) return;
    lastL = l;
    const base = PZ + 1.6 + l * LIFT, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(cx, cy, DR * Math.cos(t), 28), base + DR * 0.85 * Math.sin(t))); }
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAt(P, disc(cx, cy, DR, 40), base + 1.2)));
    const top = base + DR * 0.85;
    knob.setAttribute("d", poly(hull(ringAt(P, disc(cx, cy, 2.2, 16), top).concat(ringAt(P, disc(cx, cy, 2.2, 16), top + 3)))));
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(sx, dt);
    draw(sx.x, tval(lid, now));
    return m || !tdone(lid, now);
  });
  bag.add(B.unregister);

  function show(x, on) {
    read.textContent = on ? "roll " + (x >= 0 ? "+" : "") + Math.round(x) : "rest";
  }
  function move([px, py]) {
    const [wx] = unproj(C, px, py, TZ / 2);
    const x = clamp(wx - L / 2, -reach, reach);
    sx.t = x;
    tset(lid, 1, performance.now(), 0);
    show(x, true);
    B.wake();
  }
  function leave() {
    sx.t = REST;
    tset(lid, AJAR, performance.now(), 0);
    show(0, false);
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = 4 + v * 0.2; }, destroy: bag.dispose };
}

hairline({
  name: "roomservice",
  means: "A room service cart rolls along its length to follow the pointer, and the cloche on its top lifts while the pointer is near.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[170, 165], [256, 167], [296, 215], null],
  mount,
});
