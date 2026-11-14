/**
 * Joysticks: three arcade sticks on a control panel, each a ball on a shaft
 * over a dust washer. Every stick tilts toward the point under the pointer
 * on its own spring; the nearest takes the bright edge. At rest they lean a
 * little each way and one is bright. The slider is how far a stick tilts.
 *
 * The pattern: parts turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, PZ = 8, L = 20, BR = 6, FAV = 1;
const X1 = (N - 1) * STEP;
const REST = [[0.25, -0.1], [-0.15, 0.3], [0.1, 0.2]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value / 100;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-20, -20, 0], [X1 + 20, 20, 0], [X1 + 20, -20, 0], [-20, 20, 0], [0, 0, PZ + L + BR + 2], [X1, 0, PZ + L + BR + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-20, -20, X1 + 20, 20, 7, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const sticks = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 9), disc(x, y, 7), PZ, PZ + 1.2));
    const shaft = mk("path", { class: "nf" }, grp), ball = mk("path", { class: "sil" }, grp);
    sticks.push({ k, x, y, shaft, ball, tx: spring(REST[k][0]), ty: spring(REST[k][1]), lx: NaN, ly: NaN });
  }

  function draw(s) {
    const a = s.tx.x, b = s.ty.x;
    if (Math.abs(a - s.lx) < 1e-4 && Math.abs(b - s.ly) < 1e-4) return;
    s.lx = a; s.ly = b;
    const z0 = PZ + 1.2, bx = s.x + L * a, by = s.y + L * b, bz = z0 + L * Math.sqrt(Math.max(0, 1 - a * a - b * b));
    s.shaft.setAttribute("d", poly(hull(ringAt(P, disc(s.x, s.y, 1.6, 12), z0).concat(ringAt(P, disc(bx, by, 1.6, 12), bz)))));
    const pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(bx, by, BR * Math.cos(t), 24), bz + BR * Math.sin(t))); }
    s.ball.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const s of sticks) { if (stepS(s.tx, dt)) moving = true; if (stepS(s.ty, dt)) moving = true; draw(s); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = sticks.map((s) => P(s.x, s.y, PZ + L / 2));
  function aim(p) {
    let best = -1, bd = Infinity;
    if (p) mids.forEach((m, k) => { const dd = Math.abs(m[0] - p[0]); if (dd < bd) { bd = dd; best = k; } });
    const a = p && bd < 34 && Math.abs(mids[best][1] - p[1]) < 70 ? best : -1;
    const w = p ? unproj(C, p[0], p[1], PZ) : null;
    sticks.forEach((s, k) => {
      if (!w) { s.tx.t = REST[k][0]; s.ty.t = REST[k][1]; } else {
        const dx = w[0] - s.x, dy = w[1] - s.y, d = Math.hypot(dx, dy) || 1, m = tilt * clamp(d / 30, 0.3, 1);
        s.tx.t = (dx / d) * m; s.ty.t = (dy / d) * m;
      }
      s.ball.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "p" + (a + 1) + " " + (w[0] - sticks[a].x > 0 ? "→" : "←");
    B.wake();
  }
  sticks.forEach(draw);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "joysticks",
  means: "Three arcade joysticks on a panel: each stick tilts toward the pointer, and the nearest one takes the bright edge.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 55],
  tour: [[150, 140], [200, 170], [250, 195], null],
  mount,
});
