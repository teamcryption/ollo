/**
 * Car glovebox: the passenger side of a dashboard with the glovebox set in
 * its face, a latch slot on the door and the bin behind it. At rest the door
 * hangs ajar, bright. The pointer over the dash drops the door on its
 * bottom hinge to show the bin; the slider is how far it drops.
 *
 * The pattern: one hinged part (swing).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 112, D = 46, H = 64, X0 = 22, X1 = 90, Z0 = 12, DH = 36, T = 4, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, 0, H + 8], [W, D, H + 8], [X0, D + DH + 2, Z0], [X1, D + DH + 2, Z0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the dash: a block with a lip over its face
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [lr, li] = rings(-2, -4, W + 2, D + 6, 6, 2);
  put(solid(g), prism(P, front, lr, li, H, H + 6));
  // the bin opening on the face, behind the door
  const onFace = (q, t) => P(q.u, D + t, q.v);
  mk("path", { d: poly(rrect(X0 + 2, Z0 + 2, X1 - 2, Z0 + DH - 2, 4, 6).map((q) => onFace(q, 0))), class: "nf lo" }, g);
  const doorG = mk("g", {}, g);
  const door = mk("path", { class: "sil" }, doorG), crease = mk("path", { class: "nf lo" }, doorG), latch = mk("path", { class: "nf lo" }, doorG);
  const outer = rrect(X0, 0, X1, DH, 5, 6), inner = rrect(X0 + 2, 2, X1 - 2, DH - 2, 3, 6), slot = rrect(X0 + 24, DH - 8, X1 - 24, DH - 4, 1.5, 4);
  const at = (q, t, a) => {
    const c = Math.cos(a), s = Math.sin(a), w = q.v;
    return P(q.u, D + w * s + t * c, Z0 + w * c - t * s);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const q of outer) pts.push(at(q, 0, a), at(q, T, a));
    door.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", poly(inner.map((q) => at(q, T, a))));
    latch.setAttribute("d", poly(slot.map((q) => at(q, T, a))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D, H / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    door.classList.add("hi");
    read.textContent = a > 0 ? "door" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 100 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gloveboxcar",
  means: "The passenger side of a car dashboard: the pointer over it drops the glovebox door on its bottom hinge to show the bin.",
  rules: [1, 4, 5, 8],
  range: [45, 80, 95],
  tour: [[200, 170], [170, 160], [230, 190], null],
  mount,
});
