/**
 * Air fryer: a tall rounded body with a dial on its top and the basket
 * drawer in its front face, a grip handle on the drawer. The pointer over it
 * pulls the drawer straight out to show the basket; away, the drawer sits
 * just ajar, bright. The slider is how far the drawer comes out.
 *
 * The pattern: one part sliding on a fixed track (drawer).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 50, D = 46, H = 64, DZ0 = 5, DZ1 = 36, OUT = 40, REST = 0.1;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT + 10, 0], [W, D + OUT + 10, 0], [0, 0, H + 2], [W, D, H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, its top dial and the vents along the back of the top
  const [br, bi] = rings(0, 0, W, D, 12, 2);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(W / 2, D * 0.62, 7), H)) + poly(ringAt(P, disc(W / 2, D * 0.62, 2), H)) }, body.g);
  let vents = "";
  for (let k = 0; k < 5; k++) vents += poly(ringAt(P, rrect(13 + k * 5.5, 7, 15.5 + k * 5.5, 17, 1.2, 3), H));
  mk("path", { class: "nf lo", d: vents }, body.g);
  // the seam of the drawer's opening on the front face
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(7, D - 0.2, W - 7, D, 0.1, 1), DZ0 - 1)) }, body.g);

  // the drawer: the part out of the body, from the face to its front, and its grip
  const dg = mk("g", {}, g);
  const drawer = solid(dg), basket = mk("path", { class: "nf lo" }, dg), grip = solid(dg);
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const d = OUT * t;
    const [r, i] = rings(7, D, W - 7, D + 3 + d, 3, 1.4);
    put(drawer, prism(P, front, r, i, DZ0, DZ1));
    basket.setAttribute("d", d > 6 ? poly(ringAt(P, rrect(10, D + 1, W - 10, D + d, 3, 4), DZ1)) : "");
    const [gr, gi] = rings(W / 2 - 9, D + 3 + d, W / 2 + 9, D + 10 + d, 2.5, 1);
    put(grip, prism(P, front, gr, gi, 16, 25));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  // hit: the rest pose's screen box, which never moves
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const z of [0, H]) for (const q of br) {
    const [sx, sy] = P(q.u, q.v + (q.v > D / 2 ? 6 : 0), z);
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const hit = ([sx, sy]) => sx > x0 - 4 && sx < x1 + 4 && sy > y0 - 4 && sy < y1 + 4 ? 0 : -1;

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : amp, performance.now(), 0);
    drawer.sil.classList.add("hi");
    grip.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "out " + Math.round(OUT * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "airfryer",
  means: "An air fryer whose basket drawer slides straight out of its front when the pointer comes over it, grip first.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[204, 171], [250, 125], [180, 215], null],
  mount,
});
