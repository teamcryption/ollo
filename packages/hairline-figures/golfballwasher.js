/**
 * Golf ball washer: a tub on a post at the tee, a paddle plunger standing in
 * a slot through its lid with a ball held in the paddle, and a T handle on
 * top. The pointer's height pulls the handle: the plunger rides up out of the
 * tub on a spring and lifts the paddle and ball clear. At rest the plunger is
 * pushed down and the handle is bright.
 *
 * The pattern: one part following a continuous input (pull).
 */
const { Cam, circ, fit, facing, poly, prism, proj, rings, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.12, BZ = 30, TZ = 62, TRAVEL = 38;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(10, 0.5, 2.5);
  fit(C, [[-18, -18, 0], [18, 18, 0], [18, -18, 0], [-18, 18, 0], [-30, 0, TZ + 70], [30, 0, TZ + 70]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };
  put(solid(g), prism(P, front, disc(0, 0, 20, 28), disc(0, 0, 18.4, 28), 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, 3, 14), disc(0, 0, 2.2, 14), 3, BZ));
  box(solid(g), -22, -13, 22, 13, BZ, TZ, 6, 1.8);
  const slot = mk("path", { class: "lo nf" }, g);
  slot.setAttribute("d", poly([P(-17, -2, TZ), P(17, -2, TZ), P(17, 2, TZ), P(-17, 2, TZ)]));
  const paddle = solid(g), hole = mk("path", { class: "nf" }, g), ball = mk("path", { class: "nf sil" }, g);
  const rod = solid(g), bar = solid(g), capL = solid(g), capR = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const L = v * reach / 100 * TRAVEL, top = TZ + 4 + L;
    box(paddle, -16, -1.5, 16, 1.5, TZ, Math.max(TZ + 0.5, TZ - 6 + L), 1, 0.5);
    const bz = TZ - 12 + L;
    const o = P(0, 1.6, bz), rr = Math.hypot(...[0, 1].map((j) => P(6.5 / Math.SQRT2, 1.6 - 6.5 / Math.SQRT2, bz)[j] - o[j]));
    const show = bz + 6.5 > TZ;
    hole.setAttribute("d", show ? poly(Array.from({ length: 24 }, (_, i) => { const t = i / 24 * Math.PI * 2; return P(Math.cos(t) * 7.5, 1.6, Math.max(TZ, bz + Math.sin(t) * 7.5)); })) : "");
    ball.setAttribute("d", show ? poly(Array.from({ length: 28 }, (_, i) => { const t = i / 28 * Math.PI * 2; return [o[0] + Math.cos(t) * rr, Math.min(P(0, 1.6, TZ)[1], o[1] + Math.sin(t) * rr)]; })) : "");
    put(rod, prism(P, front, disc(0, 0, 2, 12), disc(0, 0, 1.4, 12), Math.max(TZ, TZ - 6 + L), top + 14));
    box(bar, -26, -3.5, 26, 3.5, top + 14, top + 21, 3.4, 1.2);
    box(capL, -30, -4.5, -24, 4.5, top + 12.5, top + 22.5, 3, 1);
    box(capR, 24, -4.5, 30, 4.5, top + 12.5, top + 22.5, 3, 1);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(0, 0, TZ + 50)[1], yB = P(0, 0, BZ)[1], xs = [P(-20, 20, 0)[0] - 30, P(20, -20, 0)[0] + 30];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 60) { t = clamp((yB - p[1]) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? "lift " + Math.round(t * reach / 100 * TRAVEL) : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  bar.sil.classList.add("hi");
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "golfballwasher",
  means: "A golf ball washer on its post: the pointer's height pulls the T handle and the paddle plunger lifts the ball out of the tub.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[200, 180], [200, 109], [200, 60], null],
  mount,
});
