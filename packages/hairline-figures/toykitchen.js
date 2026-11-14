/**
 * Toy kitchen: a play counter with two burners on top, a backsplash, and an
 * oven door on its front, hinged along its foot. The pointer's distance to
 * the counter drops the oven door open: the nearer the hand, the further it
 * falls. At rest the door is just ajar, bright. The slider is the reach.
 *
 * The pattern: one part answering a continuous value (spring).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X = 64, Y = 32, Z = 54, D0 = 10, D1 = 54, H0 = 8, HH = 28, REST = 0.12;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [X, 0, 0], [X, Y + HH + 2, H0], [0, Y + HH + 2, H0], [0, 0, Z + 18], [X, 0, Z + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [sr, si] = rings(2, 0, X - 2, 4, 1.5, 0.8);
  put(solid(g), prism(P, front, sr, si, Z, Z + 18));
  const [br, bi] = rings(0, 4, X, Y, 3, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z));
  for (const [x, r] of [[18, 7], [44, 9]]) {
    mk("path", { d: poly(ringAt(P, disc(x, 18, r), Z)), class: "nf lo" }, g);
    mk("path", { d: poly(ringAt(P, disc(x, 18, r * 0.45), Z)), class: "nf lo" }, g);
  }
  // knobs above the door, the doorway behind the door plate
  const kn = mk("path", { class: "nf lo" }, g);
  kn.setAttribute("d", [16, 26, 38, 48].map((x) => poly(circ(1.8, 12).map((q) => P(x + q.u, Y, H0 + HH + 8 + q.v)))).join(""));
  mk("path", { d: poly([P(D0, Y, H0), P(D1, Y, H0), P(D1, Y, H0 + HH), P(D0, Y, H0 + HH)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(D0 + 5, Y, H0 + 5), P(D1 - 5, Y, H0 + 5), P(D1 - 5, Y, H0 + 14), P(D0 + 5, Y, H0 + 14)]), class: "nf lo" }, g);
  const door = mk("path", { class: "sil hi" }, g), handle = mk("path", { class: "nf" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = t * Math.PI / 2, top = (x, k) => P(x, Y + HH * k * Math.sin(th), H0 + HH * k * Math.cos(th));
    door.setAttribute("d", poly([P(D0, Y, H0), P(D1, Y, H0), top(D1, 1), top(D0, 1)]));
    handle.setAttribute("d", seg(top(D0 + 10, 0.86), top(D1 - 10, 0.86)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), d = Math.hypot(clamp(x, 0, X) - x, clamp(y, 4, Y) - y + (y > Y ? 0 : 0));
    const t = clamp(1 - d / (30 + reach), 0.05, 0.9);
    ang.t = t;
    read.textContent = "oven " + Math.round(t * 90) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "toykitchen",
  means: "A toy play kitchen with burners and a backsplash: the nearer the pointer comes, the further its oven door drops open.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 80],
  tour: [[182, 272], [198, 201], [240, 250], null],
  mount,
});
