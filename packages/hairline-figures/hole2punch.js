/**
 * Hole punch: a two-hole office punch, a weighted base with a paper guide,
 * the die block across its back and a long lever hinged over it. At rest the
 * lever stands open, raised at its front, bright. The pointer over the punch
 * presses it: the lever swings down onto the block. The slider is how far.
 *
 * The pattern: one part answering (a tilt on a tween); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 64, Y0 = 0, Y1 = 40, HZ = 22, HY = 6, OPEN = 34, SHUT = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X0, Y1, 0], [X1, Y0, 0], [X0, Y1, HZ + 26], [X1, Y1, HZ + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base and the paper guide on it
  const [br, bi] = rings(X0, Y0, X1, Y1, 7, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const [gr, gi] = rings(X0 + 4, Y1 - 6, X0 + 14, Y1 - 2, 1.5, 0.6);
  put(solid(g), prism(P, front, gr, gi, 5, 7));
  // the die block across the back, its two holes on top
  const [kr, ki] = rings(X0 + 4, Y0 + 2, X1 - 4, Y0 + 16, 4, 1.2);
  put(solid(g), prism(P, front, kr, ki, 5, HZ - 2));
  const holes = [18, 46].map((x) => poly(rrect(x - 3, 6, x + 3, 12, 3, 4).map((q) => P(q.u, q.v, HZ - 2)))).join("");
  mk("path", { class: "nf lo", d: holes }, g);

  // the lever: a thick rounded plate, hinged along x at the back
  const lev = solid(g);
  const LR = rrect(X0 - 2, 0, X1 + 2, Y1 + 4 - HY, 8, 10), LI = rrect(X0 + 0.5, 2.5, X1 - 0.5, Y1 + 1.5 - HY, 6, 10);
  const ang = tween(OPEN);
  let last = NaN;
  function at(q, w, a) {
    const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    return P(q.u, HY + q.v * c - w * s, HZ + q.v * s + w * c);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const top = LR.map((q) => at(q, 3.5, a)), bot = LR.map((q) => at(q, 0, a));
    lev.sil.setAttribute("d", poly(hull(top.concat(bot))));
    lev.cr.setAttribute("d", poly(LI.map((q) => at(q, 3.5, a))));
  }
  lev.cr.setAttribute("class", "nf lo");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? lerpA(amt) : OPEN, performance.now(), 0);
    lev.sil.classList.add("hi");
    read.textContent = on ? "punch" : "rest";
    B.wake();
  }
  const lerpA = (v) => OPEN + (SHUT - OPEN) * clamp(v, 0, 1);
  function hit([sx, sy]) {
    return [0, HZ, HZ + 18].some((z) => {
      const [x, y] = unproj(C, sx, sy, z);
      return x > X0 - 4 && x < X1 + 4 && y > Y0 - 4 && y < Y1 + 6;
    });
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "hole2punch",
  means: "A two-hole punch: the pointer over it presses the long lever down onto the die block.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[166, 120], [200, 170], [250, 190], null],
  mount,
});
