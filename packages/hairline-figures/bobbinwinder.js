/**
 * Bobbin winder: a small winder on a block base, a flanged bobbin on its
 * spindle and a stop arm on a post resting against the thread. The pointer
 * over it spins the bobbin, the thread builds up on it and pushes the stop
 * arm out round its post. At rest the bobbin is bright. The slider is how
 * far the arm swings out.
 *
 * The pattern: one part turning about a fixed axis, driven by a tween.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tween, tset, tval, tdone, unproj, disposer, mk, pointer, put, register, solid, rrect } = HL;

const BX = 34, BY = 30, FR = 18, PX = 78, PY = 30, AL = 46, D = Math.PI / 180;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [100, 60, 0], [100, 0, 0], [0, 60, 0], [BX, BY, 46], [PX - 18, PY + 44, 30]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 100, 60, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 10));
  put(solid(g), prism(P, front, disc(BX, BY, 4, 16), disc(BX, BY, 3, 16), 10, 14));
  const low = solid(g), thread = solid(g), top = solid(g), spoke = mk("path", { class: "nf lo" }, g);
  for (const s of [low, thread, top]) s.sil.classList.add("hi");
  put(solid(g), prism(P, front, disc(PX, PY, 4, 16), disc(PX, PY, 3, 16), 10, 30));
  const arm = mk("path", { class: "sil" }, g), armCr = mk("path", { class: "nf lo" }, g);
  const pose = tween(0);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const tr = 7 + 9 * o;
    put(low, prism(P, front, disc(BX, BY, FR), disc(BX, BY, FR - 2), 14, 17));
    put(thread, prism(P, front, disc(BX, BY, tr), disc(BX, BY, tr - 1), 17, 37));
    put(top, prism(P, front, disc(BX, BY, FR), disc(BX, BY, FR - 2), 37, 40));
    const sp = (o * 540 + 30) * D;
    spoke.setAttribute("d", seg(P(BX, BY, 40), P(BX + 13 * Math.cos(sp), BY + 13 * Math.sin(sp), 40)));
    // the stop arm: a bar from the post, its end on the thread
    const a = (180 - swing * o) * D, c = Math.cos(a), s = Math.sin(a);
    const T = (q, z) => P(PX + q.u * c - q.v * s, PY + q.u * s + q.v * c, z);
    const ar = rrect(-5, -4, AL - tr + 2, 4, 4, 4);
    arm.setAttribute("d", poly(hull(ar.map((q) => T(q, 24)).concat(ar.map((q) => T(q, 30))))));
    armCr.setAttribute("d", poly(rrect(-3, -2, AL - tr, 2, 2, 4).map((q) => T(q, 30))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(pose, now)); return !tdone(pose, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(pose, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "wind " + Math.round(swing) : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const [u, v] = unproj(C, sx, sy, 40);
    return (x > -10 && x < 110 && y > -10 && y < 80) || Math.hypot(u - BX, v - BY) < FR + 4;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bobbinwinder",
  means: "A bobbin winder: the pointer spins the bobbin, thread builds up on it and pushes the stop arm out round its post.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 80],
  tour: [[174, 87], [210, 150], [150, 140], null],
  mount,
});
