/**
 * Exercise ball: a clear hamster ball on a long runway. The pointer calls the
 * ball along the runway; it rolls to the point under the pointer, its seams
 * turning as it goes. At rest it waits a third of the way along, bright.
 * The slider is how briskly it rolls.
 *
 * The pattern: one part sliding to the pointer (follow).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 26, X0 = R, X1 = 175, REST = 70, W = R + 10;
const V = [Math.cos(Math.PI / 6) * Math.SQRT1_2, Math.cos(Math.PI / 6) * Math.SQRT1_2, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-6, -W, 0], [X1 + R + 6, W, 0], [X1 + R + 6, -W, 0], [-6, W, 0], [X0, 0, 2 * R + 4], [X1, 0, 2 * R + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -W, X1 + R + 6, W, 10, 2);
  put(solid(g), prism(P, front, pr, pi, -5, 0));
  const [lr, li] = rings(4, -3, X1 + R - 4, 3, 3, 0.8);
  mk("path", { d: prism(P, front, lr, li, 0, 0.01).sil, class: "nf dash" }, g);
  const [sr, si] = rings(X1 + R + 2, -W + 6, X1 + R + 6, W - 6, 1.5, 0.6);
  put(solid(g), prism(P, front, sr, si, 0, 14));

  const ball = mk("g", {}, g);
  const shadow = mk("path", { class: "nf lo" }, ball);
  const sil = mk("path", { class: "sil hi" }, ball);
  const seams = mk("path", { class: "nf lo" }, ball);
  const hatch = mk("path", { class: "nf" }, ball);
  let pos = spring(REST, { k: value }), last = NaN;

  function draw(x) {
    if (x === last) return;
    last = x;
    const c = [x, 0, R], th = -x / R, out = [];
    for (let i = 0; i <= 12; i++) for (let j = 0; j < 48; j++) {
      const a = (i / 12) * Math.PI, b = (j / 48) * 2 * Math.PI;
      out.push(P(c[0] + R * Math.sin(a) * Math.cos(b), c[1] + R * Math.sin(a) * Math.sin(b), c[2] + R * Math.cos(a)));
    }
    sil.setAttribute("d", poly(hull(out)));
    const sh = [];
    for (let j = 0; j < 32; j++) { const b = (j / 32) * 2 * Math.PI; sh.push(P(x + R * 0.7 * Math.cos(b), R * 0.7 * Math.sin(b), 0)); }
    shadow.setAttribute("d", poly(sh));
    let d = "";
    const circle = (u, w, r, off) => {
      let prev = null;
      for (let j = 0; j <= 48; j++) {
        const t = (j / 48) * 2 * Math.PI, q = [0, 1, 2].map((k) => off[k] + r * (Math.cos(t) * u[k] + Math.sin(t) * w[k]));
        const vis = (q[0] - c[0]) * V[0] + (q[1] - c[1]) * V[1] + (q[2] - c[2]) * V[2] > 0;
        const s = P(q[0], q[1], q[2]);
        if (vis && prev) d += seg(prev, s);
        prev = vis ? s : null;
      }
    };
    for (const k of [0, 1, 2]) { const a = th + (k * Math.PI) / 3; circle([Math.cos(a), 0, Math.sin(a)], [0, 1, 0], R, c); }
    circle([1, 0, 0], [0, 0, 1], R * 0.999, c);
    seams.setAttribute("d", d);
    // the hatch: a small disc on the near side, turning with the ball
    const n = [Math.cos(th + 0.9), 0, Math.sin(th + 0.9)], hc = c.map((v, k) => v + n[k] * R * 0.96);
    const hp = [];
    if ((hc[0] - c[0]) * V[0] + (hc[2] - c[2]) * V[2] > 0) for (let j = 0; j < 24; j++) {
      const t = (j / 24) * 2 * Math.PI, u = [-n[2], 0, n[0]];
      hp.push(P(hc[0] + 7 * (Math.cos(t) * u[0]), hc[1] + 7 * Math.sin(t), hc[2] + 7 * Math.cos(t) * u[2]));
    }
    hatch.setAttribute("d", hp.length ? poly(hp) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  let tgt = null;
  function call(p) {
    let x = REST;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); if (Math.abs(wy) < W + 30) x = clamp(wx, X0, X1); }
    x = Math.round(x);
    if (x === tgt) return;
    tgt = x;
    pos.t = x;
    read.textContent = !p ? "rest" : Math.round(((x - X0) / (X1 - X0)) * 100) + "%";
    B.wake();
  }
  call(null);
  bag.add(pointer(stage, { move: call, leave: () => call(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { const x = pos.x, t = pos.t; pos = spring(x, { k: v }); pos.t = t; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hamsterball",
  means: "A hamster ball on a runway: it rolls to the spot under the pointer, its seams turning as it goes.",
  rules: [1, 3, 5],
  range: [30, 90, 220],
  tour: [[271, 219], [123, 145], [210, 189], null],
  mount,
});
