/**
 * Log skidder: a four-wheeled forestry tractor with a hood, a cab and a rear
 * arch, its grapple arm reaching back to hold three logs by their ends, the
 * far ends dragging on the ground. Over the machine the arm swings up on its
 * pivot on the 700ms ease and hoists the bundle; leaving lowers it again,
 * the grapple bright. The slider is how far the arm rises.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -24, PV = [-36, 0, 38], BL = 40, LL = 64, LOGS = [[-6, 0], [6, 0], [0, 9]];
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = Math.abs(d[2]) > 0.99 ? [1, 0, 0] : norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}
const tipOf = (a) => [PV[0] - BL * Math.cos(rad(a)), 0, PV[2] + BL * Math.sin(rad(a))];
const dropOf = (t) => Math.asin(clamp((t[2] - 16) / LL, 0, 0.95));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 1.75);
  const pts = [[-44, -26, 0], [40, 26, 0], [-44, 26, 0], [40, -26, 0], [-10, 0, 54]];
  for (const a of [REST, 50]) {
    const t = tipOf(a), b = dropOf(t), e = [t[0] - LL * Math.cos(b), 0, t[2] - 12 - LL * Math.sin(b)];
    pts.push([t[0], -14, t[2] + 4], [t[0], 14, t[2] + 4], [e[0], -14, e[2]], [e[0], 14, e[2]], [e[0], 14, 0]);
  }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (s, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => put(solid(g), beam(P, [x, y, 12], [0, y < 0 ? -1 : 1, 0], 9, 24, 24, 11.8, 2));
  wheel(-26, -17); wheel(22, -17);
  const logs = LOGS.map(() => solid(g));
  const tong = solid(g);
  tong.sil.classList.add("hi");
  slab(solid(g), -42, -12, 36, 12, 4, 1.5, 12, 22);
  slab(solid(g), -40, -6, -32, 6, 2, 1, 22, PV[2]);
  const arm = solid(g);
  slab(solid(g), -24, -14, 0, 14, 4, 1.5, 22, 54);
  slab(solid(g), 4, -11, 34, 11, 5, 1.5, 22, 34);
  slab(solid(g), 36, -20, 42, 20, 2, 1, 4, 20);
  wheel(-26, 17); wheel(22, 17);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = tipOf(a), b = dropOf(t), d = [-Math.cos(b), 0, -Math.sin(b)];
    LOGS.forEach(([y, z], i) => put(logs[i], beam(P, [t[0] + 3, y, t[2] - 14 + z], d, LL, 11, 11, 5.4, 1.4)));
    put(arm, beam(P, PV, [-Math.cos(rad(a)), 0, Math.sin(rad(a))], BL + 2, 7, 7, 3, 1));
    slab(tong, t[0] - 4, -16, t[0] + 4, 16, 2, 1, t[2] - 10, t[2] + 2);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])), X1 = Math.max(...sp.map((p) => p[0]));
  const Y0 = Math.min(...sp.map((p) => p[1])), Y1 = Math.max(...sp.map((p) => p[1]));
  const say = () => { read.textContent = "arm " + Math.round(top) + "°"; };
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(ang, top, performance.now(), 0);
    say();
    B.wake();
  }
  function leave() { on = false; tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 10, 50); if (on) { tset(ang, top, performance.now(), 0); say(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "logskidder",
  means: "A log skidder: over it the grapple arm swings up on its pivot and hoists the logs it drags; the slider sets how far.",
  rules: [3, 5, 8],
  range: [10, 32, 50],
  tour: [[222, 127], [280, 200], [153, 129], null],
  mount,
});
