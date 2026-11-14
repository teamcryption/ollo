/**
 * Dome cameras: three ball cameras on a ceiling rail, each a round turret
 * on a collar with a lens barrel. Every camera turns to face the pointer's
 * spot on the floor, on a spring; the one nearest the pointer is bright.
 * At rest they look three ways and the middle one is bright. The slider
 * is how far the lenses tilt down.
 *
 * The pattern: parts turning to face the pointer.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 62, SR = 17, CZ = 6, BZ = CZ + 5 + SR, BL = 30, BR = 7, FAV = 1;
const REST = [rad(115), rad(40), rad(-20)];
function rad(d) { return (d * Math.PI) / 180; }
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = (N - 1) * STEP;
  fit(C, [[-36, -36, 0], [X1 + 36, 36, 0], [X1 + 36, -36, 0], [-36, 36, 0], [0, 0, BZ + SR + 4], [X1, 0, BZ + SR + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-28, -24, X1 + 28, 24, 8, 2);
  put(solid(g), prism(P, front, rr, ri, 0, CZ));

  const cams = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, 11), disc(x, 0, 9), CZ, CZ + 6));
    const pts = [];
    for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; pts.push(...ringAt(P, disc(x, 0, SR * Math.sin(t) + 0.01), BZ - SR * Math.cos(t))); }
    const ball = mk("path", { d: poly(hull(pts)), class: "sil" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, 0, SR - 0.6), BZ)), class: "nf lo" }, grp);
    const barrel = mk("path", { class: "sil" }, grp), lens = mk("path", { class: "nf lo" }, grp);
    cams.push({ k, x, grp, ball, barrel, lens, a: spring(REST[k]), last: NaN, side: 0 });
  }

  function ringAround(o, d, r, n = 16) {
    const u = [-d[1], d[0], 0], ul = Math.hypot(u[0], u[1]) || 1;
    u[0] /= ul; u[1] /= ul;
    const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, c = Math.cos(t) * r, s = Math.sin(t) * r;
      out.push(P(o[0] + u[0] * c + w[0] * s, o[1] + u[1] * c + w[1] * s, o[2] + u[2] * c + w[2] * s));
    }
    return out;
  }

  function draw(cm, force) {
    const a = cm.a.x;
    if (!force && a === cm.last) return;
    cm.last = a;
    const tz = -0.15 - tilt * 0.6, dl = Math.hypot(1, tz);
    const d = [Math.cos(a) / dl, Math.sin(a) / dl, tz / dl];
    const o = [cm.x, 0, BZ], e = [cm.x + d[0] * BL, d[1] * BL, BZ + d[2] * BL];
    cm.barrel.setAttribute("d", poly(hull(ringAround(o, d, BR).concat(ringAround(e, d, BR)))));
    cm.lens.setAttribute("d", poly(ringAround([e[0] - d[0] * 0.5, e[1] - d[1] * 0.5, e[2] - d[2] * 0.5], d, BR - 2.5)));
    const side = Math.cos(a) + Math.sin(a) > 0 ? 1 : -1;
    if (side !== cm.side) {
      cm.side = side;
      if (side > 0) { cm.ball.after(cm.barrel); cm.barrel.after(cm.lens); }
      else { cm.ball.before(cm.lens); cm.lens.before(cm.barrel); }
    }
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const cm of cams) { if (stepS(cm.a, dt)) moving = true; draw(cm, false); }
    return moving;
  });
  bag.add(B.unregister);
  cams.forEach((cm) => draw(cm, true));

  let act = -2;
  function aim(target, a) {
    cams.forEach((cm, k) => {
      let t = target ? Math.atan2(target[1], target[0] - cm.x) : REST[k];
      t = cm.a.x + Math.atan2(Math.sin(t - cm.a.x), Math.cos(t - cm.a.x));
      cm.a.t = t;
      cm.barrel.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    if (a !== act) { act = a; read.textContent = a < 0 ? "rest" : "cam " + (a + 1); }
    B.wake();
  }
  aim(null, -1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const q = unproj(C, sx, sy, 0);
      let best = 0, bd = Infinity;
      cams.forEach((cm, k) => { const dd = Math.hypot(q[0] - cm.x, q[1]); if (dd < bd) { bd = dd; best = k; } });
      if (bd < SR + 4) { aim([cams[best].x + Math.cos(cams[best].a.t) * 40, Math.sin(cams[best].a.t) * 40], best); return; }
      aim(q, best);
    },
    leave: () => aim(null, -1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; cams.forEach((cm) => draw(cm, true)); }, destroy: bag.dispose };
}

hairline({
  name: "cameradome",
  means: "Three ball cameras on a ceiling rail: every lens turns to face the pointer, and the nearest camera lights up.",
  rules: [1, 3, 5, 8],
  range: [0, 0.3, 1],
  tour: [[24, 142], [126, 218], [259, 272], null],
  mount,
});
