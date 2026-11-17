/**
 * Throttle: a throttle quadrant, a low housing with two slots and twin levers
 * joined by one crossbar handle. The pointer's place along the quadrant is the
 * power setting: the levers tilt on a spring to follow it, from idle at the
 * back to full at the front. At rest they sit just past idle, handle bright.
 * The slider is how far the levers swing.
 *
 * The pattern: a continuous tilt on one spring; the hit is on the fixed plane at the handle's height.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 40, PZ = 6, YS = [-7, 7], REST = -0.3, MAX = 0.62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-28, -14, 0], [28, 14, 0], [-28, 14, 0], [28, -14, 0], [-28, 0, PZ + L + 4], [28, 0, PZ + L + 4], [0, -16, PZ + L + 4], [0, 16, PZ + L + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ts = (s, ring, inner, z0, z1, T) => {
    const pts = (r, z) => r.map((q) => P(...T([q.u, q.v, z])));
    put(s, { sil: poly(hull(pts(ring, z0).concat(pts(ring, z1)))), crease: inner ? poly(pts(inner, z1)) : "" });
  };
  put(solid(g), prism(P, front, ...rings(-28, -14, 28, 14, 5, 1.6), 0, 12));
  for (const y of YS) mk("path", { class: "nf lo", d: poly(rings(-20, y - 1.2, 20, y + 1.2, 1.2, 0.4)[0].map((q) => P(q.u, q.v, 12))) }, g);
  const levers = YS.map(() => solid(g));
  const handle = solid(g);
  const [sr] = rings(-1.6, -1.6, 1.6, 1.6, 0.8, 0.4);
  const [hr, hi] = rings(-4, -16, 4, 16, 3, 1.2);
  const sp = spring(REST);
  let drawn = NaN, over = null;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const c = Math.cos(sp.x), s = Math.sin(sp.x);
    const T = (y0) => ([u, v, w]) => [w * s + u * c, y0 + v, PZ + w * c - u * s];
    levers.forEach((lv, k) => ts(lv, sr, null, 0, L, T(YS[k])));
    ts(handle, hr, hi, L - 3, L + 4, T(0));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    sp.t = over == null ? REST : clamp(over / 26, -1, 1) * MAX * value;
    handle.sil.classList.toggle("hi", true);
    read.textContent = over == null ? "rest" : Math.round(((clamp(over / 26, -1, 1) + 1) / 2) * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], PZ + L);
      over = Math.abs(x) < 70 && Math.abs(y) < 50 ? x : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cockpitswitch",
  means: "A throttle quadrant with twin levers: the pointer's place along it sets the power, and the levers tilt to follow.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[150, 75], [233, 114], [265, 130], null],
  mount,
});
