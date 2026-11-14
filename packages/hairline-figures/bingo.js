/**
 * Bingo: a wire cage on two legs over a base, balls tumbling inside, a crank
 * on the near end. The pointer's x turns the cage: the bars and the bright
 * crank swing round the axle and the balls roll with it. At rest the crank
 * stands part way round. The slider is how many turns the stage width gives.
 */
const {
  Cam, fit, proj, rings, prism, facing, put, solid, hull, poly, open, seg, clamp, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const L = 60, H = 42, R = 22, NB = 8, REST = 0.7, CK = 20;
const BALLS = [[14, 0.9, 14], [24, 0.6, 15], [34, 1.2, 12], [44, 0.8, 15], [20, 1.6, 9], [40, 1.9, 8]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turns = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -32, 0], [L + 22, 32, 0], [L + 22, -32, 0], [-14, 32, 0], [0, 0, H + R + 2], [L + 24, 0, H + CK + 6], [L + 24, 0, H - CK - 4], [L, 0, H - R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -32, L + 22, 32, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const ring = (x, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(x, R * Math.cos(t), H + R * Math.sin(t))); } return o; };
  const leg = (x) => mk("path", { d: seg(P(x, -18, 4), P(x, 0, H)) + seg(P(x, 18, 4), P(x, 0, H)), class: "nf" }, g);
  leg(-6);
  mk("path", { d: poly(ring(0)), class: "nf lo" }, g);
  const back = mk("path", { class: "nf lo" }, g);
  const balls = BALLS.map(([x, a, rho]) => ({ x, a, rho, el: mk("ellipse", { rx: 4 * 2.05, ry: 4 * 2.05 }, g) }));
  const fore = mk("path", { class: "nf" }, g);
  mk("path", { d: poly(ring(L)), class: "nf" }, g);
  mk("path", { d: poly(hull(ring(0).concat(ring(L)))), class: "sil nf" }, g);
  mk("path", { d: seg(P(L, 0, H), P(L + 12, 0, H)), class: "nf" }, g);
  leg(L + 6);
  const crank = mk("path", { class: "sil hi nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    let db = "", df = "";
    for (let i = 0; i < NB; i++) {
      const t = a + (i / NB) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
      const d = seg(P(0, R * c, H + R * s), P(L, R * c, H + R * s));
      if (0.612 * c + 0.5 * s > 0) df += d; else db += d;
    }
    back.setAttribute("d", db); fore.setAttribute("d", df);
    for (const b of balls) {
      const t = -Math.PI / 2 + 0.55 * Math.sin(a * 0.8 + b.a * 3) + (b.a - 1.2) * 0.6;
      const p = P(b.x, b.rho * Math.cos(t), H + b.rho * Math.sin(t));
      b.el.setAttribute("cx", p[0].toFixed(2)); b.el.setAttribute("cy", p[1].toFixed(2));
    }
    const hy = CK * Math.cos(a), hz = H + CK * Math.sin(a);
    crank.setAttribute("d", open([P(L + 12, 0, H), P(L + 12, hy, hz), P(L + 24, hy, hz)]));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(sx) {
    sp.t = sx == null ? REST : REST + clamp((sx - 200) / 200, -1, 1) * Math.PI * turns;
    const deg = Math.round((((sp.t * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = sx == null ? "rest" : deg + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turns = v; }, destroy: bag.dispose };
}

hairline({
  name: "bingo",
  means: "A wire bingo cage on its stand: the pointer turns the crank, the cage swings round its axle and the balls tumble inside.",
  rules: [3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[151, 109], [238, 152], [300, 170], null],
  mount,
});
