/**
 * Pocket sundial: a folding diptych, two leaves on a hinge, a compass well
 * in the lower leaf and a string gnomon between them. The pointer over it
 * raises the upper leaf upright, pulling the string taut into a gnomon; at
 * rest the leaf stands half folded, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 34, L = 48, H = 7, LT = 4, REST = 38;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-W, -L, 0], [W, L, 0], [W, -L, 0], [-W, L, 0], [0, -L - 10, H + 2 * L * 0.98]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-W, -L, W, L, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // compass well and hour lines on the lower leaf
  mk("path", { d: poly(ringAt(P, disc(0, 22, 12), H)), class: "nf lo" }, g);
  mk("path", { d: seg(P(-5, 22, H), P(5, 22, H)), class: "nf" }, g);
  let hl = "";
  for (let k = -4; k <= 4; k++) { const t = rad(k * 17); hl += seg(P(26 * Math.sin(t), -L + 6 + 26 * Math.cos(t) * 0.0 + 4, H), P(36 * Math.sin(t) * 0.8, -L + 6 + 30 * Math.cos(t), H)); }
  mk("path", { d: hl, class: "nf lo" }, g);
  const str = mk("path", { class: "nf" }, g);
  const leaf = mk("path", { class: "sil" }, g), leafIn = mk("path", { class: "nf lo" }, g);

  const Y0 = -L;
  const lp = (u, v, z, a) => { const dv = v - Y0; return P(u, Y0 + dv * Math.cos(a) - z * Math.sin(a), H + dv * Math.sin(a) + z * Math.cos(a)); };
  const top = rrect(-W, -L, W, L, 6, 4), topIn = rrect(-W + 5, -L + 5, W - 5, L - 5, 3, 4);
  const ang = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return; last = d;
    const a = rad(d), pts = [];
    for (const q of top) pts.push(lp(q.u, q.v, 0, a), lp(q.u, q.v, LT, a));
    leaf.setAttribute("d", poly(hull(pts)));
    leafIn.setAttribute("d", poly(topIn.map((q) => lp(q.u, q.v, LT, a))));
    str.setAttribute("d", seg(P(0, 4, H), lp(0, L - 8, 0, a)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return; act = a;
    tset(ang, a ? open : REST, performance.now(), 0);
    read.textContent = a ? "noon" : "rest";
    B.wake();
  }
  leaf.classList.add("hi");
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(Math.abs(x) < W + 12 && Math.abs(y) < L + 12); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sundial2",
  means: "A folding pocket sundial: the pointer over it raises the upper leaf upright and pulls the string gnomon taut.",
  rules: [1, 3, 5, 8],
  range: [70, 90, 95],
  tour: [[171, 251], [249, 261], [151, 212], null],
  mount,
});
