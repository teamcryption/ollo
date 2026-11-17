/**
 * Litter cart: a street sweeper's bin on two wheels, a push handle at its
 * back and a lid hinged along the back edge. The pointer on the cart lifts
 * the lid on its hinge; leaving lets it drop back. At rest the lid sits a
 * little open, bright. The slider is how far the lid lifts.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, circ, fillet, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 70, D = 46, ZB = 10, H = 72, REST = 10, WR = 13, WY = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -16, 0], [W + 6, D + 4, 0], [0, -16, H + 30], [W, D, H + 4], [0, 0, H + D + 4], [W, 0, H + D + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, cls) => {
    const pts = circ(WR, 32).map((q) => P(x, WY + q.u, ZB + 2 + q.v));
    const pts2 = circ(WR, 32).map((q) => P(x + (x < 0 ? -4 : 4), WY + q.u, ZB + 2 + q.v));
    mk("path", { d: poly(hull(pts.concat(pts2))), class: cls }, g);
    mk("path", { d: poly(x < 0 ? pts : pts2), class: "nf lo" }, g);
    mk("path", { d: poly(circ(3, 12).map((q) => P(x + (x < 0 ? -4 : 4), WY + q.u, ZB + 2 + q.v))), class: "nf lo" }, g);
  };
  // the push handle, behind the bin
  mk("path", { d: open([P(12, 0, H - 6), P(12, -14, H + 26), P(W - 12, -14, H + 26), P(W - 12, 0, H - 6)]), class: "nf" }, g);
  mk("path", { d: open([P(16, -14, H + 26), P(W - 16, -14, H + 26)]), class: "nf lo" }, g);
  wheel(-2, "");
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, ZB, H));
  mk("path", { d: poly(fillet([P(W, 10, ZB + 12), P(W, D - 10, ZB + 12), P(W, D - 10, H - 12), P(W, 10, H - 12)], [3, 3, 3, 3])), class: "nf lo" }, g);
  wheel(W + 2, "sil");
  const [ir, ii] = rings(4, 4, W - 4, D - 4, 4, 1);
  mk("path", { d: poly(ringAt(P, ir, H)), class: "nf lo" }, g);

  const lid = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g), grab = mk("path", { class: "nf" }, g);
  const at = (x, s, a, dz = 0) => P(x, s * Math.cos(rad(a)) - dz * Math.sin(rad(a)), H + 1 + s * Math.sin(rad(a)) + dz * Math.cos(rad(a)));
  const sw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s1 = D + 2;
    lid.setAttribute("d", poly(hull([at(-2, 0, a), at(W + 2, 0, a), at(W + 2, s1, a), at(-2, s1, a), at(-2, 0, a, 3), at(W + 2, 0, a, 3), at(W + 2, s1, a, 3), at(-2, s1, a, 3)])));
    lip.setAttribute("d", open([at(-2, s1, a, 3), at(W + 2, s1, a, 3)]) + open([at(W + 2, 0, a, 3), at(W + 2, s1, a, 3)]));
    grab.setAttribute("d", poly(fillet([at(W / 2 - 10, s1 - 4, a, 3), at(W / 2 + 10, s1 - 4, a, 3), at(W / 2 + 10, s1 - 10, a, 3), at(W / 2 - 10, s1 - 10, a, 3)], [2, 2, 2, 2])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const box = hull(ringAt(P, br, ZB - WR).concat(ringAt(P, br, H + 8)));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 10 && sx < Math.max(...xs) + 10 && sy > Math.min(...ys) - 20 && sy < Math.max(...ys) + 10;
  let act = null;
  const label = () => (act ? "lid " + Math.round(ang) + "°" : "rest");
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(sw, on ? ang : REST, performance.now(), 0);
    read.textContent = label();
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { ang = v; if (act) { tset(sw, ang, performance.now(), 0); read.textContent = label(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "streetsweep",
  means: "A street sweeper's litter cart on two wheels: the pointer lifts its lid on the back hinge to open the bin.",
  rules: [1, 4, 5, 6],
  range: [40, 75, 100],
  tour: [[160, 137], [193, 231], [230, 190], null],
  mount,
});
