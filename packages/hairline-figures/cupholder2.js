/**
 * Car cup holder: a slice of dashboard trim with a pop-out cup holder in
 * its face, a tray behind a sprung front cap. At rest the cap sits proud,
 * bright. The pointer over the trim slides the tray out and its cup ring
 * opens; the slider is how far it comes out.
 *
 * The pattern: one sliding part (drawer).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 104, D = 40, H = 34, X0 = 30, X1 = 74, Z0 = 12, Z1 = 19, REST = 6, R = 14;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxO = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, 0, H], [W, D, H], [X0 - 3, D + 56, 6], [X1 + 3, D + 56, 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the opening the tray runs in
  mk("path", { d: poly([[X0 - 2, Z0 - 2], [X1 + 2, Z0 - 2], [X1 + 2, Z1 + 2], [X0 - 2, Z1 + 2]].map(([x, z]) => P(x, D, z))), class: "nf lo" }, g);
  const tray = solid(g), hole = mk("path", { class: "nf" }, g), seat = mk("path", { class: "nf lo" }, g), cap = solid(g);
  const out = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const [tr, ti] = rings(X0, D - 1, X1, D + o, 2.5, 1.5);
    put(tray, prism(P, front, tr, ti, Z0, Z1));
    const cy = D + o - R - 6, cx = (X0 + X1) / 2, show = cy - R > D + 1;
    hole.setAttribute("d", show ? poly(ringAt(P, disc(cx, cy, R), Z1)) : "");
    seat.setAttribute("d", show ? poly(ringAt(P, disc(cx, cy, R - 4), Z0 + 1)) : "");
    const [cr, ci] = rings(X0 - 4, D + o - 3, X1 + 4, D + o, 1.4, 1);
    put(cap, prism(P, front, cr, ci, Z0 - 5, Z1 + 4));
  }
  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);
  cap.sil.classList.add("hi");
  const mid = P(W / 2, D, H / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(out, a > 0 ? maxO : REST, performance.now(), 0);
    read.textContent = a > 0 ? "cup" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 100 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxO = v; if (act > 0) { tset(out, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cupholder2",
  means: "A slice of car dashboard trim: the pointer over it slides the pop-out cup holder tray from the face and opens its ring.",
  rules: [1, 4, 5, 8],
  range: [30, 44, 54],
  tour: [[200, 170], [170, 160], [230, 190], null],
  mount,
});
