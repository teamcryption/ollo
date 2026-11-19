/**
 * Pop-up camper: a low trailer box on one axle with an A-frame drawbar, its
 * hard roof resting on the box. The pointer's nearness to the trailer lifts
 * the roof straight up on a spring, pulling a canvas wall with windows out
 * of the box beneath it. At rest the roof is cracked open, bright. The
 * slider is how high the roof may rise.
 *
 * The pattern: one continuous value from the pointer (spring).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, rrect, clamp, lerp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 56, W = 30, Z0 = 12, Z1 = 28, RT = 4, REST = 5, MAXL = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[0, -W, 0], [L + 18, -W / 2, 0], [L, 0, 0], [0, 0, 0], [0, -W, Z1 + MAXL + RT], [L, 0, Z1 + MAXL + RT], [0, 0, Z1 + MAXL + RT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the drawbar, its hitch and the jockey wheel post, behind the box's nose
  mk("path", { d: open([P(L, -4, Z0 + 2), P(L + 16, -W / 2, Z0 - 1), P(L, -W + 4, Z0 + 2)]), class: "nf" }, g);
  const ball = (z) => circ(2, 14).map((q) => P(L + 17 + q.u, -W / 2 + q.v, z));
  mk("path", { d: poly(hull(ball(Z0 - 1).concat(ball(Z0 - 4)))), class: "sil" }, g);
  const [br, bi] = rings(0, -W, L, 0, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const side = (ring, y) => ring.map((q) => P(q.u, y, q.v));
  mk("path", { d: poly(side(rrect(4, Z0 + 3, L - 4, Z1 - 3, 1.5, 3), 0)), class: "nf lo" }, g);
  const wheel = (y) => circ(8, 32).map((q) => P(26 + q.u, y, 8 + q.v));
  mk("path", { d: poly(hull(wheel(3).concat(wheel(-1)))), class: "sil" }, g);
  mk("path", { d: poly(circ(3.5, 20).map((q) => P(26 + q.u, 3.1, 8 + q.v))), class: "nf lo" }, g);

  const canvas = solid(g), wins = mk("path", { class: "nf lo" }, g), roof = solid(g);
  const [cr, ci] = rings(2, -W + 2, L - 2, -2, 2, 1);
  const [rr, ri] = rings(-1.5, -W - 1.5, L + 1.5, 1.5, 4, 1.5);
  const d = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const z = Z1 + v;
    put(canvas, prism(P, front, cr, ci, Z1, z));
    const h = Math.max(0, v - 6);
    wins.setAttribute("d", h > 1 ? [8, 22, 36].map((x) => poly(side(rrect(x, Z1 + 3, x + 11, Z1 + 3 + h, 1.5, 3), -2))).join("") : "");
    put(roof, prism(P, front, rr, ri, z, z + RT));
  }
  const B = register(stage, (dt) => { const m = stepS(d, dt); draw(d.x); return m; });
  bag.add(B.unregister);

  function setTarget(t, on) {
    d.t = t;
    roof.sil.classList.add("hi");
    read.textContent = on ? Math.round(t * 4) + " cm" : "rest";
    B.wake();
  }
  setTarget(REST, false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, 0);
      const f = clamp(1 - Math.hypot(wx - L / 2, wy + W / 2) / 70, 0, 1);
      setTarget(lerp(3, lerp(12, MAXL, reach), f), true);
    },
    leave: () => setTarget(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "popupcamper",
  means: "A pop-up camper trailer: the nearer the pointer, the higher its roof lifts, pulling a canvas wall up out of the box.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[82, 240], [150, 262], [197, 243], null],
  mount,
});
