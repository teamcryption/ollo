/**
 * Microscope: a lab microscope on a foot, a pillar with coarse and fine focus
 * knobs, a stage holding a slide over the lamp, an objective turret with three
 * lenses of different lengths under the head, and an inclined eyepiece tube.
 * The pointer's height raises the stage toward the lens (a spring), and the
 * pointer's side picks a lens: the turret turns to swing it into place, and
 * it is bright. At rest the shortest lens is in place, the stage half raised.
 * The slider is how quickly the stage follows.
 *
 * The pattern: a continuous input (height, a spring) beside a discrete choice
 * (which lens, a 700ms tween on the turret); the hit is on the screen, by bands
 * fixed at rest.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rings, spring, stepS, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TX = -5, TR = 5, TZ = 57, LEN = [7, 10, 13], ZLO = 25, REST_LENS = 0, REST_F = 0.4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-24, -16, 0], [16, 16, 0], [16, -16, 0], [-24, 16, 0], [-24, 0, 96], [-6, 0, 74]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  /** A round tube between two world points, radius r0 to r1: its outline, and the far end's rim as a crease. */
  function tube(p0, p1, r0, r1) {
    const d = p1.map((x, j) => x - p0[j]), n = Math.hypot(...d), a = d.map((x) => x / n);
    const ref = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let u = [a[1] * ref[2] - a[2] * ref[1], a[2] * ref[0] - a[0] * ref[2], a[0] * ref[1] - a[1] * ref[0]];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const w = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
    const ring = (p, r) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * Math.PI * 2; return P(...p.map((c, j) => c + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j]))); });
    const e = ring(p1, r1);
    return { sil: poly(hull(ring(p0, r0).concat(e))), crease: poly(ring(p1, r1 * 0.78)) };
  }
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };

  box(-25, -16, 15, 16, 6, 1.6, 0, 5);
  put(solid(g), prism(P, front, disc(0, 0, 4.5), disc(0, 0, 3.6), 5, 7.5));
  box(-21, -6, -11, 6, 3, 1, 5, 62);
  put(solid(g), tube([-16, 6, 19], [-16, 10, 19], 5.5, 5.5));
  put(solid(g), tube([-16, 10, 19], [-16, 13.5, 19], 3.2, 3.2));
  // the stage and its slide move together, on a spring
  const stg = solid(g), slide = solid(g), clips = mk("path", { class: "nf lo" }, g);
  const objs = mk("g", {}, g);
  const lenses = LEN.map((L, k) => ({ k, L, g: mk("g", {}, objs), barrel: null, tip: null }));
  for (const l of lenses) { l.barrel = solid(l.g); l.tip = solid(l.g); }
  put(solid(g), prism(P, front, disc(TX, 0, 9.5, 40), disc(TX, 0, 8, 40), TZ, TZ + 4));
  box(-21, -6.5, 5, 6.5, 3.5, 1.2, TZ + 4, TZ + 15);
  put(solid(g), tube([-8, 0, 70], [-21, 0, 90], 3.4, 3.4));
  put(solid(g), tube([-21, 0, 90], [-23, 0, 93], 4.4, 4.4));

  const zs = spring(lerp(ZLO, 40 - LEN[REST_LENS], REST_F), { k: 100 * value, c: 18 * Math.sqrt(value) });
  const tu = tween(0);
  let tuT = 0, dz = NaN, dt0 = NaN, lens = REST_LENS, painted = "";
  function draw(now) {
    const z = zs.x, t = tval(tu, now);
    if (!(Math.abs(z - dz) < 1e-3)) {
      dz = z;
      const [o, i] = rings(-11, -13, 12, 13, 2.2, 1); put(stg, prism(P, front, o, i, z, z + 3));
      const [so, si] = rings(-4, -10, 4, 10, 0.8, 0.4); put(slide, prism(P, front, so, si, z + 3, z + 3.8));
      clips.setAttribute("d", poly([P(-9, -6, z + 3.1), P(-3, -6, z + 3.9)]).replace("Z", "") + poly([P(-9, 6, z + 3.1), P(-3, 6, z + 3.9)]).replace("Z", ""));
    }
    if (!(Math.abs(t - dt0) < 1e-4)) {
      dt0 = t;
      for (const l of lenses) {
        const a = t + (l.k * 2 * Math.PI) / 3, x = TX + TR * Math.cos(a), y = TR * Math.sin(a);
        l.depth = x + y;
        put(l.barrel, prism(P, front, disc(x, y, 2.3), null, TZ - l.L, TZ));
        put(l.tip, prism(P, front, disc(x, y, 1.5), null, TZ - l.L - 2.5, TZ - l.L));
      }
      const order = lenses.slice().sort((p, q) => p.depth - q.depth), key = order.map((l) => l.k).join();
      if (key !== painted) { painted = key; for (const l of order) objs.appendChild(l.g); }
    }
  }
  const B = register(stage, (dt, now) => { const m = stepS(zs, dt); draw(now); return m || !tdone(tu, now); });
  bag.add(B.unregister);

  // bands fixed at rest: the pointer's side picks the lens, its height the stage
  const c0 = P(0, 0, 40), yLo = P(0, 0, 18)[1], yHi = P(0, 0, 70)[1];
  function aim(p) {
    const on = p && Math.abs(p[0] - c0[0]) < 110 && p[1] > yHi - 50 && p[1] < yLo + 50;
    const k = on ? (p[0] < c0[0] - 22 ? 1 : p[0] > c0[0] + 22 ? 2 : 0) : REST_LENS;
    const f = on ? clamp((yLo - p[1]) / (yLo - yHi), 0, 1) : REST_F;
    const now = performance.now();
    if (k !== lens || !on) {
      const want = (-k * 2 * Math.PI) / 3, cur = tuT;
      tuT = cur + Math.atan2(Math.sin(want - cur), Math.cos(want - cur)); tset(tu, tuT, now, 0);
    }
    lens = k;
    zs.t = lerp(ZLO, TZ - LEN[k] - 2.5 - 4.5, f);
    lenses.forEach((l) => { l.barrel.sil.classList.toggle("hi", l.k === k); l.tip.sil.classList.toggle("hi", l.k === k); });
    read.textContent = on ? `lens ${k + 1} · ${1 + Math.round(f * 4)}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { zs.k = 100 * v; zs.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "microscope",
  means: "A lab microscope: the pointer's height raises the stage toward the lens, and its side swings a lens into place.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 120], [250, 150], [200, 200], null],
  mount,
});
