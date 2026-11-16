/**
 * Kidsmailbox: a toy cash register, a chunky body with a key pad, a display
 * flag on its back and a coin drawer below. The pointer over the till slides
 * the drawer out toward the reader, showing its coin trays. At rest the drawer
 * stands open a little, bright. The slider is how far it slides.
 *
 * The pattern: one part sliding on a track.
 */
const { Cam, fit, facing, poly, prism, proj, rings, ringAt, circ, tdone, tset, tval, tween, clamp, unproj, seg, disposer, mk, pointer, put, register, solid } = HL;

const W = 70, D = 56, DZ = 18, BZ = 44, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, D + 40, 0], [W, 0, 0], [0, D + 40, 0], [0, 0, BZ + 26], [W, 0, BZ + 26]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // display flag on the back, then the body and its key pad
  const [fr, fi] = rings(16, 4, 54, 12, 2, 1);
  put(solid(g), prism(P, front, fr, fi, BZ, BZ + 24));
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, DZ, BZ));
  let keys = "";
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    const [kr] = rings(10 + i * 14, 22 + j * 11, 18 + i * 14, 29 + j * 11, 2, 0.6);
    keys += poly(ringAt(P, kr, BZ));
  }
  mk("path", { d: keys, class: "nf lo" }, g);
  const [hr, hi2] = rings(-2, -2, W + 2, D + 2, 6, 1);
  const base = solid(g);
  const drawer = mk("g", {}, g), ds = solid(drawer), trays = mk("path", { class: "nf lo" }, drawer), knob = mk("path", { class: "nf" }, drawer);
  const tw = tween(REST);
  let last = NaN;
  function draw(y) {
    if (y === last) return;
    last = y;
    const [dr, di] = rings(3, 2 + y, W - 3, D + y, 4, 1.4);
    put(ds, prism(P, front, dr, di, 2, DZ - 1));
    let d = "";
    for (let i = 0; i < 4; i++) { const [tr] = rings(7 + i * 15.5, D + y - 26, 19 + i * 15.5, D + y - 5, 3, 1); d += poly(ringAt(P, tr, DZ - 1)); }
    trays.setAttribute("d", y > 8 ? d : "");
    knob.setAttribute("d", poly(ringAt(P, circ(3, 16).map((q) => ({ ...q, u: q.u + W / 2, v: q.v + D + y })), 9)) + seg(P(W / 2 - 8, D + y, 13), P(W / 2 + 8, D + y, 13)));
  }
  put(base, prism(P, front, hr, hi2, 0, 2));
  g.prepend(drawer);
  g.prepend(base.g);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  ds.sil.classList.add("hi");
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? out : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, DZ); return x > -10 && x < W + 10 && y > -10 && y < D + 40; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { out = clamp(v, 16, 40); if (act) { tset(tw, out, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "kidsmailbox",
  means: "A toy cash register: the pointer over the till slides its coin drawer out toward the reader to show the trays.",
  rules: [1, 3, 5, 6],
  range: [16, 34, 40],
  tour: [[228, 129], [133, 206], [242, 260], null],
  mount,
});
