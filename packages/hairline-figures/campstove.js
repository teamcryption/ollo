/**
 * Camp stove: a two-burner box stove with its lid hinged at the back. The
 * pointer's place across the stove sets how far the lid swings open, from
 * shut on the left to standing up on the right, showing the burners. At rest
 * the lid stands half open, bright. The slider is how far it can open.
 *
 * The pattern: one hinged part following the pointer.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 90, D = 54, H = 24, T = 3, REST = 40;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.2);
  const lidAt = (a, x, y, z) => { const r = (a * Math.PI) / 180, dy = y - D, dz = z - H; return [x, D + dy * Math.cos(r) + dz * Math.sin(r), H + dz * Math.cos(r) - dy * Math.sin(r)]; };
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, D, H + D + 4], [W, D, H + D + 4], [0, 0, H + T], [W, 0, H + T]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  for (const x of [W * 0.3, W * 0.7]) {
    mk("path", { d: poly(ringAt(P, disc(x, D * 0.45, 13), H)), class: "nf lo" }, g);
    mk("path", { d: poly(ringAt(P, disc(x, D * 0.45, 8), H)), class: "nf" }, g);
    mk("path", { d: poly(ringAt(P, disc(x, D * 0.45, 3), H)), class: "nf" }, g);
  }
  mk("path", { d: poly(ringAt(P, disc(W * 0.3, -3, 3), H * 0.5)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, disc(W * 0.7, -3, 3), H * 0.5)), class: "nf" }, g);
  const lid = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return; last = a;
    const pts = [];
    for (const x of [0, W]) for (const y of [0, D]) for (const z of [H, H + T]) pts.push(P(...lidAt(a, x, y, z)));
    lid.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([[6, 6], [W - 6, 6], [W - 6, D - 6], [6, D - 6]].map(([x, y]) => P(...lidAt(a, x, y, H + T)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const xa = P(0, 0, 0)[0], xb = P(W, 0, 0)[0];
  let act = null;
  function set(t) {
    if (t === act) return; act = t;
    const now = performance.now();
    tset(ang, t === null ? REST : 4 + t * (max - 4), now, 0);
    lid.classList.add("hi");
    read.textContent = t === null ? "rest" : Math.round(4 + t * (max - 4)) + "\u00b0";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: ([sx]) => set(Math.round(clamp((sx - xa) / (xb - xa), 0, 1) * 20) / 20), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "campstove",
  means: "A two-burner camp stove: the pointer's place across it swings the hinged lid from shut to standing open over the burners.",
  rules: [1, 3, 5, 6],
  range: [60, 100, 110],
  tour: [[172, 115], [242, 150], [312, 185], null],
  mount,
});
