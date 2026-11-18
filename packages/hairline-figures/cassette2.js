/**
 * Personal cassette player: a flat player with a cassette in its well, two
 * reels, a row of keys, and a hinged window lid. The pointer over the player
 * swings the lid open on its back hinge. At rest the lid is ajar, bright.
 * The slider is how far the lid opens.
 */
const { Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, unproj, spring, stepS, rad, disposer, mk, pointer, put, register, solid } = HL;

const W = 72, D = 54, H = 16, L = 42, T = 2.4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, H + L], [0, D, H], [0, 0, H + L]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [wr, wi] = rings(5, 4, W - 5, L - 2, 4, 1.2);
  mk("path", { d: poly(ringAt(P, wr, H)), class: "lo" }, g);
  for (const x of [22, 50]) {
    mk("path", { d: poly(ringAt(P, disc(x, 21, 8), H)), class: "lo" }, g);
    mk("path", { d: poly(ringAt(P, disc(x, 21, 3), H)), class: "dot off" }, g);
  }
  for (let k = 0; k < 4; k++) {
    const x0 = 8 + k * 15, [kr, ki] = rings(x0, L + 2, x0 + 11, D - 4, 2, 0.8);
    put(solid(g), prism(P, front, kr, ki, H, H + 2.5));
  }
  const lid = mk("path", { class: "sil hi" }, g);
  const win = mk("path", { class: "lo" }, g);

  const REST = 22, ang = spring(REST);
  let last = null;
  const at = (x, d, h, a) => { const t = rad(a); return P(x, d * Math.cos(t) - h * Math.sin(t), H + d * Math.sin(t) + h * Math.cos(t)); };
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const x of [1, W - 1]) for (const d of [0, L]) for (const h of [0.3, T]) pts.push(at(x, d, h, a));
    lid.setAttribute("d", poly(hull(pts)));
    const top = a > 90 ? 0.3 : T, q = [at(8, 6, top, a), at(W - 8, 6, top, a), at(W - 8, L - 6, top, a), at(8, L - 6, top, a)];
    win.setAttribute("d", poly(q));
  }
  draw(REST);
  const B = register(stage, (dt) => { const mv = stepS(ang, dt); draw(ang.x); return mv; });
  bag.add(B.unregister);

  let on = null;
  const tgt = () => 30 + 75 * reach;
  function setOn(v) {
    if (v === on) return;
    on = v;
    ang.t = v ? tgt() : REST;
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, H, H + 20]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < W + 4 && y > -4 && y < D + 4) return true; }
    return false;
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { ang.t = tgt(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cassette2",
  means: "A personal cassette player: the pointer swings its window lid open on the back hinge; the slider sets how far it opens.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.75, 1],
  tour: [[195, 197], [170, 215], [240, 230], null],
  mount,
});
