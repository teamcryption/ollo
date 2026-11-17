/**
 * Fire alarm pull: a manual call point, a square box on a short post with a
 * recess in its front face and a pull handle hinged at the recess's foot.
 * The pointer over the box pulls the handle: it swings out and down from the
 * face on the discrete clock. At rest the handle stands a little proud, bright.
 * The slider is how far the handle swings.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 22, W = 40, Z0 = 26, Z1 = 70, HZ = 34, H = 26, HY0 = 8, HY1 = 32, TH = 3, REST = 16;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-4, -4, 0], [D + 4, W + 4, 0], [D + 4, -4, 0], [-4, W + 4, 0], [0, 0, Z1], [D + H + 4, W, HZ], [D, W, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // foot plate and post
  const [fr, fi] = rings(-4, -4, D + 4, W + 4, 4, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const [pr, pi] = rings(D / 2 - 4, W / 2 - 4, D / 2 + 4, W / 2 + 4, 3.5, 1);
  put(solid(g), prism(P, front, pr, pi, 3, Z0));
  // the box
  const [br, bi] = rings(0, 0, D, W, 4, 1.8);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  // the recess on the front face (x = D)
  const face = (y, z) => P(D + 0.01, y, z);
  mk("path", { d: poly(fillet([face(HY0 - 2, HZ - 2), face(HY1 + 2, HZ - 2), face(HY1 + 2, HZ + H + 2), face(HY0 - 2, HZ + H + 2)], [2, 2, 2, 2])), class: "nf lo" }, g);
  // the handle: a thick plate hinged along its lower edge
  const hd = mk("path", { class: "sil" }, g), hc = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const pt = (y, h, t) => P(D + h * s + t * c, y, HZ + h * c - t * s);
    const outer = [pt(HY0, 0, TH), pt(HY1, 0, TH), pt(HY1, H, TH), pt(HY0, H, TH)];
    const inner = [pt(HY0, 0, 0), pt(HY1, 0, 0), pt(HY1, H, 0), pt(HY0, H, 0)];
    hd.setAttribute("d", poly(fillet(hull(outer.concat(inner)), Array(8).fill(1.5))));
    hc.setAttribute("d", poly(fillet(outer, [1.5, 1.5, 1.5, 1.5])));
    grip.setAttribute("d", poly(fillet([pt(HY0 + 5, H - 7, TH), pt(HY1 - 5, H - 7, TH), pt(HY1 - 5, H - 3, TH), pt(HY0 + 5, H - 3, TH)], [1, 1, 1, 1])));
  }
  hd.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit: the box's rest outline on screen, which never moves
  const box = [];
  for (const [x, y] of [[0, 0], [D, 0], [D, W], [0, W]]) box.push(P(x, y, Z0), P(x, y, Z1));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const bx0 = Math.min(...xs) - 8, bx1 = Math.max(...xs) + 8, by0 = Math.min(...ys) - 8, by1 = Math.max(...ys) + 8;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? REST + (100 - REST) * amt : REST, performance.now(), 0);
    read.textContent = v ? "pulled" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > bx0 && sx < bx1 && sy > by0 && sy < by1), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "firealarm2",
  means: "A manual call point on a post: the pointer over the box pulls its handle, which swings out and down from the face.",
  rules: [1, 4, 5, 9],
  range: [30, 100, 100],
  tour: [[222, 136], [240, 170], [200, 110], null],
  mount,
});
