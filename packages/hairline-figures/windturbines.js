/**
 * Wind turbines: five turbines along the ridge of a terraced hill, each a
 * tapering tower, a nacelle and three tapered blades on a hub. The rotors
 * always turn slowly while the figure is in view; the ones near the pointer
 * spin up, the nearest fastest, each on a spring on its speed, and the
 * nearest is bright. At rest the summit turbine is bright. The slider is the
 * reach.
 *
 * The pattern: a field (terrain) put on a rate (slow); the hit is read
 * against the hubs, which never move.
 */
const {
  Cam, facing, fillet, fit, hull, poly, prism, proj, rad, reducedMotion, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const T = [-84, -42, 0, 42, 84], S_OFF = [5, -4, 0, -4, 5], TIER = [8, 16, 24], TOWER = 46, R = 21, YAW = 32;
const W0 = 0.55, WMAX = 7.5, TERR = [[104, 36], [64, 24], [24, 14]];
const M = [Math.SQRT1_2, -Math.SQRT1_2], NV = [Math.SQRT1_2, Math.SQRT1_2];
const at = (t, s) => [t * M[0] + s * NV[0], t * M[1] + s * NV[1]];
const fall = (u) => (u <= 0.35 ? 1 : u <= 1 ? 1 - ((u - 0.35) / 0.65) * 0.9 : 0.1);
// one blade in its own plane: r along the blade, w across it, a wide root tapering to the tip
const BLADE = fillet([[2, -0.9], [6, -1.1], [R, -0.35], [R + 0.6, 0.1], [R - 1, 0.5], [6.5, 2.8], [2, 1.2]], [0.4, 0.8, 0.3, 0.3, 0.4, 1, 0.4], 3);

/** A ring of an ellipse laid along the hill's ridge, as the samples prism() takes. */
function ell(a, b, n = 48) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), nl = Math.hypot(c / a, s / b);
    const nu = c / a / nl, nv = s / b / nl;
    return { u: a * c * M[0] + b * s * NV[0], v: a * c * M[1] + b * s * NV[1], nu: nu * M[0] + nv * NV[0], nv: nu * M[1] + nv * NV[1] };
  });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.48);
  const ext = [[...at(-106, 0), 0], [...at(106, 0), 0], [...at(0, 38), 0], [...at(0, -38), 0], [...at(0, 0), TIER[2] + TOWER + R + 3], [...at(-84, 5), TIER[0] + TOWER + R + 2]];
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  TERR.forEach(([a, b], k) => put(solid(g), prism(P, front, ell(a, b), ell(a - 1.6, b - 1.6), k * 8, k * 8 + 8)));

  const fa = rad(45 + YAW), F = [Math.cos(fa), Math.sin(fa)], U = [-F[1], F[0]];
  const ring = (c, r, z) => Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; return P(c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z); });
  /** A circle of radius r in the rotor's plane, centred d along the rotor's axis from point h. */
  const disc = (h, d, r) => Array.from({ length: 20 }, (_, i) => {
    const t = (i / 20) * Math.PI * 2, c = Math.cos(t) * r;
    return P(h[0] + F[0] * d + U[0] * c, h[1] + F[1] * d + U[1] * c, h[2] + Math.sin(t) * r);
  });

  const order = T.map((_, k) => k).sort((a, b) => S_OFF[a] - S_OFF[b]);
  const units = [];
  for (const k of order) {
    const b = at(T[k], S_OFF[k]), z0 = TIER[Math.min(2, 2 - Math.round(Math.abs(T[k]) / 42))], zt = z0 + TOWER;
    mk("path", { d: poly(hull(ring(b, 2.4, z0).concat(ring(b, 1.2, zt)))), class: "sil" }, g);
    const hub = [b[0] + F[0] * 2.5, b[1] + F[1] * 2.5, zt + 1.6];
    mk("path", { d: poly(hull(disc(hub, -9, 2.1).concat(disc(hub, -1, 2.4)))), class: "sil" }, g);
    const grp = mk("g", {}, g);
    const blades = [0, 1, 2].map(() => mk("path", { class: "sil" }, grp));
    const nose = mk("path", { class: "sil" }, grp);
    nose.setAttribute("d", poly(hull(disc(hub, 0, 2.2).concat(disc(hub, 2.6, 0.6)))));
    units.push({ k, hub, scr: P(...hub), blades, nose, th: rad(k * 41 + 10), w: spring(W0, { eps: 0.01 }), drawn: NaN });
  }
  units.sort((a, b) => a.k - b.k);

  function draw(u) {
    if (u.th === u.drawn) return;
    u.drawn = u.th;
    u.blades.forEach((el, i) => {
      const a = u.th + (i * Math.PI * 2) / 3, e = [Math.cos(a), Math.sin(a)], n = [-e[1], e[0]];
      el.setAttribute("d", poly(BLADE.map(([r, w]) => {
        const cu = r * e[0] + w * n[0], cz = r * e[1] + w * n[1];
        return P(u.hub[0] + F[0] * 1.2 + U[0] * cu, u.hub[1] + F[1] * 1.2 + U[1] * cu, u.hub[2] + cz);
      })));
    });
  }

  const still = reducedMotion();
  const B = register(stage, (dt) => {
    let m = false;
    for (const u of units) {
      if (stepS(u.w, dt)) m = true;
      if (!still) { u.th = (u.th + u.w.x * dt) % (Math.PI * 2); m = true; }
      draw(u);
    }
    return m;
  });
  bag.add(B.unregister);

  const dist = (u) => Math.hypot(u.scr[0] - over[0], (u.scr[1] - over[1]) * 0.6);
  function retarget() {
    let mark = units[2];
    for (const u of units) u.w.t = over ? W0 + (WMAX - W0) * fall(dist(u) / reach) : W0;
    if (over) { mark = units.reduce((a, b) => (dist(b) < dist(a) ? b : a)); read.textContent = "turbine " + (mark.k + 1); } else read.textContent = "rest";
    for (const u of units) { const on = u === mark; u.blades.forEach((el) => el.classList.toggle("hi", on)); u.nose.classList.toggle("hi", on); }
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "windturbines",
  means: "Five wind turbines on a hill: the rotors near the pointer spin up, the nearest fastest.",
  rules: [1, 3, 5, 8],
  range: [45, 75, 115],
  tour: [[80, 150], [262, 140], [200, 126], null],
  mount,
});
