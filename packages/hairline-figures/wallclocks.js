/**
 * Wall clocks: four round clocks of different sizes hung on a wall, each a
 * shallow case with four hour ticks and two hands. The pointer is what the
 * clocks watch: every clock's hands turn to point at it, each on its own
 * spring, and the nearest clock is bright. At rest every clock tells its own
 * time, the second one bright. The slider is how quickly the hands follow.
 *
 * The pattern: a continuous aim (officechairs' spring, on an angle per clock);
 * the hit is on the wall's plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const T = 3.5, XW = 78, ZW = 104;
const CLOCKS = [
  { x: -50, z: 70, r: 14, h: 2.1, m: 0.6 },
  { x: -8, z: 46, r: 22, h: 5.2, m: 2.0 },
  { x: 36, z: 74, r: 11, h: 0.3, m: 4.4 },
  { x: 54, z: 34, r: 16, h: 3.6, m: 1.1 },
];
const FAV = 1;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-XW, -4, 0], [XW, -4, 0], [-XW, 0, ZW], [XW, 0, ZW], [-XW, 6, 0], [XW, 6, 0]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wo, wi] = rings(-XW, -4, XW, 0, 2, 0.8);
  put(solid(g), prism(P, front, wo, wi, 0, ZW));
  // a point on the clock face plane y, angle a measured in the wall's x/z plane
  const F = (c, y, r, a) => P(c.x + r * Math.cos(a), y, c.z + r * Math.sin(a));
  const ring = (c, y, r) => Array.from({ length: 48 }, (_, i) => F(c, y, r, (i / 48) * Math.PI * 2));
  const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };

  const clocks = CLOCKS.map((c, k) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil", d: poly(hull(ring(c, 0, c.r).concat(ring(c, T, c.r)))) }, grp);
    mk("path", { class: "nf lo", d: poly(ring(c, T, c.r - 1.6)) }, grp);
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      mk("path", { class: "nf lo", d: seg(F(c, T, c.r - 2.6, a), F(c, T, c.r - 2.6 - c.r * 0.14, a)) }, grp);
    }
    const hands = mk("path", { class: "nf sil" }, grp);
    place(mk("circle", { class: "dot", r: 1.3 }, grp), P(c.x, T, c.z));
    return { k, c, sil, hands, hs: spring(c.h, opt), ms: spring(c.m, opt), drawn: "" };
  });

  function draw(cl) {
    const key = cl.hs.x.toFixed(4) + "," + cl.ms.x.toFixed(4);
    if (key === cl.drawn) return;
    cl.drawn = key;
    const c = cl.c, O = P(c.x, T, c.z);
    cl.hands.setAttribute("d", seg(O, F(c, T, c.r * 0.5, cl.hs.x)) + seg(O, F(c, T, c.r * 0.78, cl.ms.x)));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const cl of clocks) { const a = stepS(cl.hs, dt), b = stepS(cl.ms, dt); if (a || b) m = true; draw(cl); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const cl of clocks) {
      const c = cl.c;
      if (!over) { cl.hs.t = cl.hs.t + wrap(c.h - cl.hs.t); cl.ms.t = cl.ms.t + wrap(c.m - cl.ms.t); continue; }
      const dx = over[0] - c.x, dz = over[1] - c.z, d = Math.hypot(dx, dz) - c.r;
      if (d < bd) { bd = d; near = cl; }
      if (Math.hypot(dx, dz) < 2) continue;
      const a = Math.atan2(dz, dx);
      cl.hs.t = cl.hs.t + wrap(a - cl.hs.t);
      cl.ms.t = cl.ms.t + wrap(a - cl.ms.t);
    }
    for (const cl of clocks) cl.sil.classList.toggle("hi", over ? cl === near : cl.k === FAV);
    read.textContent = near ? "clock " + (near.k + 1) : "rest";
    B.wake();
  }

  // the face plane y = T: P is linear there in x and z, so invert it
  const o = P(0, T, 0), ex = P(1, T, 0).map((v, i) => v - o[i]), ez = P(0, T, 1).map((v, i) => v - o[i]);
  const det = ex[0] * ez[1] - ex[1] * ez[0];
  bag.add(pointer(stage, {
    move: (p) => {
      const dx = p[0] - o[0], dy = p[1] - o[1], x = (dx * ez[1] - dy * ez[0]) / det, z = (ex[0] * dy - ex[1] * dx) / det;
      over = Math.abs(x) < XW + 10 && z > -10 && z < ZW + 10 ? [clamp(x, -XW, XW), clamp(z, 0, ZW)] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const cl of clocks) for (const s of [cl.hs, cl.ms]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "wallclocks",
  means: "Four round clocks on a wall: every clock's hands turn to point at the pointer, and the nearest clock is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[131, 103], [186, 169], [267, 228], null],
  mount,
});
