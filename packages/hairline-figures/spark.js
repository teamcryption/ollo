/**
 * Fireside tongs: a long pair of hearth tongs hanging from a ring handle over
 * a hearth tile, the two arms pinned at a rivet below the ring, each ending
 * in a claw. The pointer opens the jaws wide. At rest they stand barely open,
 * the near arm bright. The slider is how wide the jaws open.
 */
const { Cam, fit, hull, poly, proj, rad, prism, rings, facing, put, solid, spring, stepS, disposer, mk, pointer, register } = HL;

const TOP = 122, LEN = 104, REST = 5;
function box(P, o, d, n, a, b, c) {
  // centre o, unit axes d (along), n (across, in plane), y; half sizes a, b, c
  const pts = [];
  for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1])
    pts.push(P(o[0] + i * a * d[0] + j * b * n[0], o[1] + k * c, o[2] + i * a * d[2] + j * b * n[2]));
  return poly(hull(pts));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.05);
  const ex = LEN * Math.sin(rad(40)), ez = TOP - LEN * Math.cos(rad(40));
  fit(C, [[-ex - 6, 0, ez], [ex + 6, 0, ez], [0, 0, TOP + 22], [-34, -22, 0], [34, 22, 0], [34, -22, 0], [-34, 22, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(-34, -22, 34, 22, 4, 2);
  put(solid(g), prism(P, front, r0, r1, 0, 5));
  const coal = [];
  for (const [x, y, r] of [[-4, 2, 7], [6, -3, 6]]) for (let i = 0; i < 14; i++) { const t = (i / 14) * Math.PI * 2; coal.push(P(x + r * Math.cos(t), y + r * Math.sin(t), 5), P(x + r * 0.6 * Math.cos(t), y + r * 0.6 * Math.sin(t), 11)); }
  mk("path", { d: poly(hull(coal)), class: "nf lo" }, g);
  const ring = [];
  for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; ring.push(P(9 * Math.cos(t), 0, TOP + 11 + 9 * Math.sin(t))); }
  const ringIn = ring.map((_, i) => { const t = (i / 28) * Math.PI * 2; return P(6 * Math.cos(t), 0, TOP + 11 + 6 * Math.sin(t)); });
  mk("path", { d: poly(ring) + poly(ringIn), class: "sil", "fill-rule": "evenodd" }, g);
  const arms = [-1, 1].map((s) => {
    const grp = mk("g", {}, g);
    return { s, arm: mk("path", { class: "sil" }, grp), claw: mk("path", { class: "sil" }, grp) };
  });
  const rivet = mk("ellipse", { class: "dot m" }, g);
  const pv = P(0, 0, TOP);
  rivet.setAttribute("cx", pv[0]); rivet.setAttribute("cy", pv[1]); rivet.setAttribute("rx", 2.4); rivet.setAttribute("ry", 2.4);

  const A = spring(REST, { k: 110, c: 18 });
  let last = NaN;
  function draw() {
    if (A.x === last) return;
    last = A.x;
    for (const it of arms) {
      const a = rad(A.x), d = [it.s * Math.sin(a), 0, -Math.cos(a)], n = [Math.cos(a), 0, it.s * Math.sin(a)];
      const mid = [d[0] * LEN / 2, 0, TOP + d[2] * LEN / 2];
      it.arm.setAttribute("d", box(P, mid, d, n, LEN / 2 + 4, 1.6, 1.6));
      const end = [d[0] * (LEN - 3) - it.s * 3 * n[0], 0, TOP + d[2] * (LEN - 3) - it.s * 3 * n[2]];
      it.claw.setAttribute("d", box(P, end, d, n, 6, 1.2, 8));
    }
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);

  const lo = P(-ex, 0, ez), hi = P(ex, 0, ez);
  function hit([sx, sy]) { return sx > Math.min(lo[0], P(-34, 22, 0)[0]) - 10 && sx < Math.max(hi[0], P(34, -22, 0)[0]) + 10 && sy > P(0, 0, TOP + 22)[1] - 10 && sy < P(34, 22, 0)[1] + 10; }
  let on = null;
  function setOn(v) {
    if (v !== on) {
      on = v;
      arms[1].arm.classList.toggle("hi", true); arms[1].claw.classList.toggle("hi", true);
      read.textContent = v ? "grip" : "rest";
    }
    A.t = v ? open : REST;
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "spark",
  means: "Hearth tongs hanging over a tile of coals: the pointer swings the two arms apart on their rivet to open the claws.",
  rules: [1, 3, 5, 8],
  range: [18, 30, 40],
  tour: [[200, 143], [200, 250], [200, 54], null],
  mount,
});
