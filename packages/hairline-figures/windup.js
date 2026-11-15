/**
 * Water wheel: a paddle wheel on its axle between two posts, over a wooden
 * flume. The pointer is the current: moving along the flume turns the wheel
 * on a spring, and the top paddle is bright. At rest the
 * wheel sits a little turned, its top paddle bright.
 */
const { Cam, fit, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, clamp, poly } = HL;

const R = 34, IN = 22, ZC = 48, YW = 8, N = 10, REST = 0.18;
const ang = (k, a) => a + (k / N) * Math.PI * 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-60, -16, 0], [60, 16, 0], [-R - 5, 0, ZC], [R + 5, 0, ZC], [0, -YW, ZC + R + 5], [0, YW, ZC - R - 5]], 200, 160);
  const P = proj(C), fr = HL.facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, fr, ...rings(-58, -14, 58, 14, 3, 1.2), 0, 7));
  const post = (y0, y1) => put(solid(g), prism(P, fr, ...rings(-2.5, y0, 2.5, y1, 1, 0.5), 7, ZC + 1));
  post(-15, -11);
  const rim = (y, r) => { const pts = []; for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; pts.push(P(r * Math.cos(t), y, ZC + r * Math.sin(t))); } return poly(pts); };
  mk("path", { class: "nf sil", d: rim(-YW, R) + rim(-YW, IN) }, g);
  const wheel = mk("g", {}, g);
  const paddles = [];
  for (let k = 0; k < N; k++) paddles.push({ k, el: mk("polygon", { class: "sil" }, wheel) });
  const spokes = mk("path", { class: "nf lo" }, g);
  mk("path", { class: "nf sil", d: rim(YW, R) + rim(YW, IN) }, g);
  mk("path", { class: "sil", d: rim(YW + 1, 5) }, g);
  post(11, 15);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, active = false, hiK = -1;

  function quad(t) {
    const c = Math.cos(t), s = Math.sin(t), a = IN - 2, b = R + 6;
    return [P(a * c, -YW, ZC + a * s), P(b * c, -YW, ZC + b * s), P(b * c, YW, ZC + b * s), P(a * c, YW, ZC + a * s)];
  }
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    let d = "";
    for (const p of paddles) {
      const t = ang(p.k, a);
      p.el.setAttribute("points", quad(t).map((q) => q.join(",")).join(" "));
      p.depth = 0.61 * Math.cos(t) + 0.5 * Math.sin(t);
      d += "M" + P(0, YW, ZC).join(",") + "L" + P(IN * Math.cos(t), YW, ZC + IN * Math.sin(t)).join(",");
    }
    spokes.setAttribute("d", d);
    [...paddles].sort((p, q) => p.depth - q.depth).forEach((p) => wheel.appendChild(p.el));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function paint() {
    // bright: the paddle that will stand nearest the top once the wheel lands
    let best = 0, bv = -Infinity;
    for (const p of paddles) { const v = Math.sin(ang(p.k, sp.t)); if (v > bv) { bv = v; best = p.k; } }
    const k = best;
    if (k !== hiK) { hiK = k; for (const p of paddles) p.el.classList.toggle("hi", p.k === k); }
    read.textContent = active ? "turn " + Math.round(((sp.t - REST) * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) > 80 || Math.abs(y) > 70) { active = false; sp.t = REST; }
      else { active = true; sp.t = REST + clamp(x, -60, 60) * 0.045; }
      paint();
    },
    leave: () => { active = false; sp.t = REST; paint(); },
  }));
  bag.add(() => svg.replaceChildren());
  paint();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "windup",
  means: "A water wheel over its flume: running the pointer along the flume turns the wheel, and its top paddle is bright.",
  rules: [3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[287, 266], [131, 257], [105, 175], null],
  mount,
});
