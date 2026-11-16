/**
 * Lacrosse goal: a square pipe frame, base pipes running back to a point, a
 * deep net hung between them and a ball in front. The pointer along the mouth
 * swings the net back into a pocket where it points, falling off with
 * distance. At rest the net hangs slack and the ball is bright. The slider is
 * how deep the pocket goes.
 */
const {
  Cam, circ, fit, facing, open, prism, proj, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 30, H = 34, D = 40, K = 12;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-D - 26, 0, 0], [0, -W, 0], [0, W, 0], [0, -W, H + 2], [0, W, H + 2], [22, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const net = mk("path", { class: "nf lo" }, g);
  const pipes = mk("path", { class: "nf sil" }, g);
  pipes.setAttribute("d", seg(P(0, -W, 0), P(-D, 0, 0)) + seg(P(-D, 0, 0), P(0, W, 0)) + seg(P(0, -W, H), P(0, W, H)) + seg(P(0, -W, H - 1.6), P(0, W, H - 1.6)));
  put(solid(g), prism(P, front, disc(0, -W, 1.6), null, 0, H));
  put(solid(g), prism(P, front, disc(0, W, 1.6), null, 0, H));
  const ball = mk("path", { class: "sil" }, g);

  const sp = spring(0), dp = spring(0.25);
  let aim = 0, last = "";
  function draw() {
    const key = sp.x.toFixed(3) + dp.x.toFixed(3);
    if (key === last) return;
    last = key;
    const pull = (y) => 6 + dp.x * 26 * Math.exp(-((y - sp.x) ** 2) / 260);
    let d = "";
    const rows = [];
    for (let i = 0; i <= K; i++) {
      const y = -W + (2 * W * i) / K, ry = 1 - Math.abs(y) / W, pts = [];
      for (let j = 0; j <= 6; j++) {
        const t = j / 6, s = Math.sin(t * Math.PI);
        pts.push(P(-D * ry * t - pull(y) * s * ry - 2 * s, y * (1 - 0.2 * s), H * (1 - t) * (1 - 0.15 * s)));
      }
      rows.push(pts);
      d += open(pts);
    }
    for (let j = 1; j < 6; j++) d += open(rows.map((r) => r[j]));
    net.setAttribute("d", d);
    const bx = 12 - dp.x * 6, by = sp.x * 0.6, R = 4, pts = [];
    for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2; pts.push(P(bx, by + R * Math.cos(t) * 0.7071, R + R * Math.sin(t)), P(bx + R * Math.cos(t) * 0.7071, by, R + R * Math.sin(t))); }
    const c = P(bx, by, R), rr = Math.max(...pts.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1])));
    ball.setAttribute("d", `M${c[0] - rr},${c[1]}a${rr},${rr} 0 1,0 ${2 * rr},0a${rr},${rr} 0 1,0 ${-2 * rr},0Z`);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt) | stepS(dp, dt); draw(); return !!m; });
  bag.add(B.unregister);

  function set(y) {
    const on = y !== null;
    sp.t = on ? y : 0;
    dp.t = on ? depth : 0.25;
    ball.classList.toggle("hi", !on);
    net.classList.toggle("hi", on);
    net.classList.toggle("lo", !on);
    read.textContent = on ? "pocket " + (Math.round(((y + W) / (2 * W)) * 4) + 1) : "rest";
    aim = y;
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H / 2);
      set(x > -D - 20 && x < 24 && Math.abs(y) < W + 10 ? Math.max(-W, Math.min(W, y)) : null);
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; if (aim !== null) set(aim); }, destroy: bag.dispose };
}

hairline({
  name: "lacrosse",
  means: "A lacrosse goal: the pointer along the mouth swings the net back into a deep pocket there, the ball bright in front at rest.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[245, 169], [300, 140], [185, 198], null],
  mount,
});
