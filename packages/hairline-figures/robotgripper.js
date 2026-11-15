/**
 * Gripper: a robot wrist flange carrying a parallel gripper, two fingers
 * closed on a small cube on the palm. The pointer's screen x opens it: the
 * wrist turns and the fingers slide apart. At rest the fingers hold the cube,
 * the cube bright; while the pointer works it, the fingers take the bright.
 * The slider is how far the wrist turns over the full travel.
 *
 * The pattern: a continuous input (screen x, which never moves) on one spring;
 * fingers and cube re-sort far to near as the wrist turns.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, spring, stepS,
  clamp, disposer, mk, pointer, put, register, solid,
} = HL;

const ZB = 20, ZP = 33, REST = 0.04;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-30, -30, 62], [30, 30, 62]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let sweep = value;

  put(solid(g), prism(P, front, circ(24, 64), circ(22.6, 64), 0, 5));
  put(solid(g), prism(P, front, circ(12, 48), circ(10.8, 48), 5, ZB));
  const body = solid(g), rail = solid(g);
  const top = mk("g", {}, g);
  const cube = solid(top);
  const fingers = [-1, 1].map((sd) => {
    const fg = mk("g", {}, top);
    return { sd, g: fg, base: solid(fg), tip: solid(fg) };
  });

  const B0 = rings(-22, -10, 22, 10, 4, 1.4), RL = rings(-19, -3, 19, 3, 1.5, 0.8), CU = rings(-6, -6, 6, 6, 1.5, 1);
  const sp = spring(REST);
  let drawn = NaN, active = false;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const a = -0.55 + t * 1.1 * sweep, x0 = 6 + t * 10;
    put(body, prism(P, front, turn(B0[0], a), turn(B0[1], a), ZB, ZP - 3));
    put(rail, prism(P, front, turn(RL[0], a), turn(RL[1], a), ZP - 3, ZP));
    put(cube, prism(P, front, turn(CU[0], a), turn(CU[1], a), ZP, ZP + 12));
    const keyed = [[0, cube.g]];
    for (const f of fingers) {
      const u0 = f.sd > 0 ? x0 : -x0 - 5, u1 = u0 + 5;
      const [o, i] = rings(u0, -8, u1, 8, 1.5, 1);
      const [o2, i2] = rings(f.sd > 0 ? u0 : u0 + 2, -5, f.sd > 0 ? u1 - 2 : u1, 5, 1.2, 0.8);
      put(f.base, prism(P, front, turn(o, a), turn(i, a), ZP - 4, ZP + 16));
      put(f.tip, prism(P, front, turn(o2, a), turn(i2, a), ZP + 16, ZP + 26));
      const um = f.sd * (x0 + 2.5);
      keyed.push([um * (Math.cos(a) + Math.sin(a)), f.g]);
    }
    keyed.sort((p, q) => p[0] - q[0]);
    for (const [, el] of keyed) top.appendChild(el);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function mark() {
    cube.sil.classList.toggle("hi", !active);
    for (const f of fingers) { f.base.sil.classList.toggle("hi", active); f.tip.sil.classList.toggle("hi", active); }
    read.textContent = active ? Math.round(12 + sp.t * 20) + "mm" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { active = true; sp.t = clamp((p[0] - 100) / 200, 0, 1); mark(); },
    leave: () => { active = false; sp.t = REST; mark(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); mark();
  return { set: (v) => { sweep = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "robotgripper",
  means: "A robot gripper holding a cube: the pointer's x turns the wrist and slides the two fingers open; the fingers are bright while they move.",
  rules: [1, 3, 5, 6, 8],
  range: [0.5, 1, 1.5],
  tour: [[136, 137], [264, 201], [249, 133], null],
  mount,
});
