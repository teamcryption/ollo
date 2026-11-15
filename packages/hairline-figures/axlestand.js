/**
 * Axle stand: a four-legged stand on a square foot, a collar with its pawl
 * lever, and a toothed ratchet column carrying a saddle. The pointer is how
 * high the axle sits: the nearer it comes to the stand, the further the column
 * slides up out of the collar, notch by notch. At rest the column stands a few
 * notches up, saddle bright. The slider is the column's reach.
 *
 * The pattern: one continuous lift on a spring; the hit is on the floor plane.
 */
const {
  Cam, fit, prism, proj, rings, seg, unproj, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FT = 20, CL = 6, CO = 4, CZ = 34, NOTCH = 4, REST = 10, MAX = 30;
const box = (P, front, x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.7) => {
  const [o, i] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, o, i, z0, z1);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-FT, -FT, 0], [FT, FT, 0], [-FT, FT, 0], [FT, -FT, 0], [0, 0, CZ + 20 + MAX + 8]], 200, 160);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), box(P, front, -FT, -FT, FT, FT, 0, 2.5, 3, 1.4));
  const legs = [];
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    legs.push(seg(P(sx * (FT - 3), sy * (FT - 3), 2.5), P(sx * CL, sy * CL, CZ - 4)));
    legs.push(seg(P(sx * (FT - 7), sy * (FT - 3), 2.5), P(sx * (CL - 1), sy * CL, CZ - 6)));
  }
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  put(solid(g), box(P, front, -CL, -CL, CL, CL, CZ - 6, CZ, 1.5, 0.8));
  // pawl lever on the collar's near face
  mk("path", { class: "nf sil", d: seg(P(CL, 0, CZ - 3), P(CL + 12, 4, CZ + 4)) }, g);
  const col = solid(g), sad = solid(g), ears = solid(g);
  const lift = spring(REST, { k: 120, c: 20 });
  let drawn = NaN, max = MAX * value;

  function draw() {
    const h = lift.x;
    if (Math.abs(h - drawn) < 1e-3) return;
    drawn = h;
    const top = CZ + 14 + h;
    const c = box(P, front, -CO, -CO, CO, CO, CZ, top, 0.6, 0.4);
    let teeth = "";
    for (let z = top - 3; z > CZ + 1; z -= NOTCH) {
      teeth += seg(P(CO, -CO, z), P(CO, CO, z - 1.5)) + seg(P(-CO, CO, z), P(CO, CO, z - 1.5));
    }
    put(col, { sil: c.sil, crease: c.crease + teeth });
    put(sad, box(P, front, -10, -5, 10, 5, top, top + 3, 1.5, 0.8));
    const e1 = box(P, front, -10, -5, -7, 5, top + 3, top + 8, 0.8, 0.4), e2 = box(P, front, 7, -5, 10, 5, top + 3, top + 8, 0.8, 0.4);
    put(ears, { sil: e1.sil + e2.sil, crease: e1.crease + e2.crease });
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(d) {
    lift.t = d == null ? REST : clamp(REST + (max - REST) * (1 - d / 46), REST, max);
    sad.sil.classList.toggle("hi", true);
    ears.sil.classList.toggle("hi", true);
    read.textContent = d == null ? "rest" : "notch " + Math.round(lift.t / NOTCH);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      // fixed screen band of the stand at rest: the higher the pointer, the higher the column
      const [cx, fy] = P(0, 0, 0), ty = P(0, 0, CZ + 22 + MAX)[1];
      if (Math.abs(p[0] - cx) > 80 || p[1] > fy + 30 || p[1] < ty - 20) return aim(null);
      aim(46 * (1 - clamp((fy - p[1]) / ((fy - ty) * 0.6), 0, 1)));
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { max = MAX * v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "axlestand",
  means: "An axle stand: the ratchet column slides up out of its collar, notch by notch, as the pointer nears.",
  rules: [1, 3, 5],
  range: [0.6, 1, 1],
  tour: [[200, 99], [222, 33], [200, 140], null],
  mount,
});
