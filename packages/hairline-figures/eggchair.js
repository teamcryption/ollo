/**
 * Eggchair: a hanging egg chair. A round foot, an arched stand and a short
 * chain hold a woven egg pod with its mouth and seat cushion turned to the
 * viewer. The pointer's side of the stand is where the pod swings; the slider
 * sets how far. At rest it hangs a little aside, its shell bright.
 *
 * The pattern: a continuous aim (one spring on the swing angle); the hit is the
 * pointer's screen x against the fixed pivot, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, spring, stepS, clamp, rad, hull,
  disposer, mk, pointer, put, register, solid, poly, seg,
} = HL;

const ZP = 135, LC = 12, H = 100, R = 40, F0 = Math.PI / 4, REST = rad(9), A = rad(32);
const K = [Math.SQRT1_2, Math.SQRT1_2, 0];
const rad_ = (t) => R * Math.pow(Math.sin(Math.PI * t), 0.6) * (0.86 + 0.14 * t);
const surf = (t, th, f) => [rad_(t) * f * Math.cos(th), rad_(t) * f * Math.sin(th), -LC - H * t];
function swing(v, a) {
  const c = Math.cos(a), s = Math.sin(a), d = K[0] * v[0] + K[1] * v[1];
  const cx = [K[1] * v[2], -K[0] * v[2], K[0] * v[1] - K[1] * v[0]];
  return [v[0] * c + cx[0] * s + K[0] * d * (1 - c), v[1] * c + cx[1] * s + K[1] * d * (1 - c), ZP + v[2] * c + cx[2] * s];
}
const POD = [];
for (let i = 0; i <= 14; i++) for (let j = 0; j < 24; j++) POD.push(surf(i / 14, (j / 24) * Math.PI * 2, 1));
const loop = (tc, ts, span, f) => {
  const o = [];
  for (let i = 0; i < 36; i++) { const s = (i / 36) * Math.PI * 2; o.push(surf(tc + ts * Math.sin(s), F0 + span * Math.cos(s), f)); }
  return o;
};
const MOUTH = loop(0.5, 0.3, 1.2, 1), SEAT = loop(0.74, 0.1, 0.85, 0.8);
const POLE = [];
for (let i = 0; i <= 20; i++) {
  const t = i / 20, u = 1 - t, b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  const p = [[-34, -10, 4], [-140, -30, 90], [-85, -14, 192], [0, 0, ZP + 8]];
  POLE.push([0, 1, 2].map((k) => b[0] * p[0][k] + b[1] * p[1][k] + b[2] * p[2][k] + b[3] * p[3][k]));
}

function band(pts, w) {
  const L = [], Rr = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[Math.max(0, i - 1)], q = pts[Math.min(pts.length - 1, i + 1)];
    const dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy) || 1;
    L.push([pts[i][0] - (dy / m) * w, pts[i][1] + (dx / m) * w]);
    Rr.push([pts[i][0] + (dy / m) * w, pts[i][1] - (dx / m) * w]);
  }
  return poly(L.concat(Rr.reverse()));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.5);
  const ext = POLE.slice();
  for (const a of [-A * 1.3, A * 1.3]) for (let i = 0; i < POD.length; i += 7) ext.push(swing(POD[i], a));
  for (let k = 0; k < 8; k++) ext.push([40 * Math.cos(k), 40 * Math.sin(k), 0]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let amp = value;

  put(solid(g), prism(P, front, circ(40, 32), circ(37.5, 32), 0, 4));
  mk("path", { class: "sil", d: band(POLE.map((q) => P(...q)), 3) }, g);
  const chain = mk("path", { class: "lo nf" }, g);
  const pod = mk("path", { class: "sil" }, g);
  const mouth = mk("path", {}, g);
  const seat = mk("path", { class: "lo" }, g);
  const pv = P(0, 0, ZP);

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const S = (v) => P(...swing(v, a));
    chain.setAttribute("d", seg(pv, S([0, 0, -LC])));
    pod.setAttribute("d", poly(hull(POD.map(S))));
    mouth.setAttribute("d", poly(MOUTH.map(S)));
    seat.setAttribute("d", poly(SEAT.map(S)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function mark(label) { pod.classList.add("hi"); read.textContent = label; B.wake(); }
  const rest = () => { sp.t = REST; mark("rest"); };

  bag.add(pointer(stage, {
    move: (p) => {
      const dx = p[0] - pv[0];
      if (Math.abs(dx) > 190) { rest(); return; }
      const a = clamp(dx / 110, -1, 1) * A * amp;
      sp.t = -a;
      mark((a < 0 ? "-" : "+") + String(Math.round(Math.abs(a) * 180 / Math.PI)).padStart(2, "0") + "°");
    },
    leave: rest,
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  rest();
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "eggchair",
  means: "A hanging egg chair: the pod swings on its chain toward the side of the stand the pointer is on.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[327, 159], [73, 159], [300, 200], null],
  mount,
});
