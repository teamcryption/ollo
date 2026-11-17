/**
 * Van de Graaff generator: a plinth, a belt column and a big round dome, with
 * a small grounding ball on its own stand. The pointer over it raises the
 * telescoping column, lifting the dome high above the plinth on a spring. At
 * rest the dome is bright. The slider is how high the dome rises.
 *
 * The pattern: a single object on a spring (terrain's spring, on a lift).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const CX = 28, CY = 28, R = 22, Z0 = 12, H = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [56, 0, 0], [56, 56, 0], [0, 56, 0], [CX - R, CY, Z0 + H + 26 + 2 * R], [CX + R, CY, Z0 + H + 26 + 2 * R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 56, 56, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  // the grounding ball, on a thin stand at the right
  put(solid(g), prism(P, front, disc(50, 8, 1.4, 12), disc(50, 8, 0.8, 12), Z0, Z0 + 26));
  const ball = [];
  for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); ball.push(...ringAt(P, disc(50, 8, 5 * Math.cos(t), 16), Z0 + 30 + 5 * Math.sin(t))); }
  mk("path", { d: poly(hull(ball)) }, g);
  const sleeve = solid(g);
  put(sleeve, prism(P, front, disc(CX, CY, 10), disc(CX, CY, 8.6), Z0, Z0 + H));
  const col = solid(g), belt = mk("path", { class: "nf lo" }, g);
  const dome = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g);

  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const top = Z0 + H + l;
    put(col, prism(P, front, disc(CX, CY, 7), disc(CX, CY, 5.8), Z0 + H, top + 4));
    belt.setAttribute("d", open([P(CX + 2, CY + 6.7, Z0 + H + 1), P(CX + 2, CY + 6.7, top + 2)]) + open([P(CX + 6.7, CY + 2, Z0 + H + 1), P(CX + 6.7, CY + 2, top + 2)]));
    const zc = top + R - 4, pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(CX, CY, R * Math.cos(t), 36), zc + R * Math.sin(t))); }
    dome.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", open(ringAt(P, run(disc(CX, CY, R * 0.96, 48), front), zc - R * 0.28)));
  }

  const sp = spring(4);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(4);

  const c0 = P(CX, CY, 0), cTop = P(CX, CY, Z0 + H + 4 + 2 * R + 4), cNear = P(56, 56, 0);
  let on = false;
  function setOn(a) {
    on = a;
    sp.t = a ? reach : 4;
    read.textContent = a ? "lift" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => Math.abs(sx - c0[0]) < 70 && sy > cTop[1] - 10 && sy < cNear[1] + 6;
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "vandegraaff",
  means: "A Van de Graaff generator: the pointer over it raises the belt column, lifting the big round dome high above the plinth.",
  rules: [1, 3, 5, 8],
  range: [12, 20, 26],
  tour: [[200, 110], [200, 237], [238, 262], null],
  mount,
});
