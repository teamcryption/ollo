/**
 * Dumbwaiter: a service hatch in a wall at counter height, the car's floor
 * and a covered dish waiting in the shaft behind a guillotine door. Over the
 * wall the door slides up to serve; leaving, it drops back to a crack. At
 * rest the door stands lifted a little, bright. The slider is the door's lift.
 *
 * The pattern: one part sliding on a track.
 */
const {
  Cam, fit, fillet, hull, open, poly, prism, proj, rings, ringAt, circ, seg, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 26, W = 58, Z0 = 42, H = 44, D = 16, REST = 8;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, -D, 0], [110, -D, 0], [110, 0, 0], [0, 0, 130], [0, -D, 130], [X0, 3, Z0 + H + 50]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, -D, 110, 0, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, 130));
  const X1 = X0 + W, Z1 = Z0 + H;
  mk("path", { d: poly([P(X0, 0, Z0), P(X1, 0, Z0), P(X1, 0, Z1), P(X0, 0, Z1)]), class: "lo" }, g);
  mk("path", { d: open([P(X0, 0, Z1), P(X0, -D + 2, Z1), P(X0, -D + 2, Z0)]) + seg(P(X0, -D + 2, Z1), P(X1, -D + 2, Z1)), class: "nf lo" }, g);
  // the dish on the car floor, under its cloche
  const pts = [];
  for (const [r, z] of [[11, 0], [10, 4], [7, 8], [3, 10]]) pts.push(...ringAt(P, disc(X0 + W / 2, -D / 2, r), Z0 + 1 + z));
  mk("path", { d: poly(hull(pts)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, disc(X0 + W / 2, -D / 2, 14), Z0 + 1)), class: "nf lo" }, g);
  // the counter ledge under the hatch
  const [lr, li] = rings(X0 - 6, 0, X1 + 6, 9, 1.5, 0.8);
  put(solid(g), prism(P, front, lr, li, Z0 - 4, Z0));
  const btn = [P(X1 + 9, 0, Z0 + 18), P(X1 + 13, 0, Z0 + 18), P(X1 + 13, 0, Z0 + 24), P(X1 + 9, 0, Z0 + 24)];
  mk("path", { d: poly(fillet(btn, [1, 1, 1, 1])), class: "nf lo" }, g);
  const door = mk("path", { class: "sil hi" }, g);
  const marks = mk("path", { class: "nf lo" }, g);

  const zt = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const b = Z0 + z, t = b + H;
    door.setAttribute("d", poly(fillet([P(X0 - 2, 1, b), P(X1 + 2, 1, b), P(X1 + 2, 1, t), P(X0 - 2, 1, t)], [1.5, 1.5, 1.5, 1.5])));
    marks.setAttribute("d", seg(P(X0 + W / 2 - 9, 1, b + 6), P(X0 + W / 2 + 9, 1, b + 6)) + seg(P(X0 + 3, 1, b + 14), P(X0 + 3, 1, t - 4)) + seg(P(X1 - 3, 1, b + 14), P(X1 - 3, 1, t - 4)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(zt, now)); return !tdone(zt, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, 130), P(110, -D, 0), P(0, 0, 0), P(110, -D, 130)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(zt, v ? lift : REST, performance.now(), 0);
    read.textContent = v ? "up " + Math.round(lift) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "dumbwaiter",
  means: "A dumbwaiter hatch in a wall: over it, the guillotine door slides up to show the dish on the car; leaving, it drops back.",
  rules: [1, 4, 5, 6],
  range: [24, 40, 48],
  tour: [[189, 172], [160, 120], [220, 220], null],
  mount,
});
