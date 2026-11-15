/**
 * Transmission jack: a low cross base on four casters, a two-stage ram and a
 * wide saddle with corner jaws on top. The pointer is the gearbox coming down:
 * the higher it sits over the jack, the further the ram telescopes and the
 * saddle tilts to meet it. At rest the ram is half up, the saddle bright. The
 * slider is the ram's reach.
 *
 * The pattern: one lift and one tilt on springs; the hit is a fixed screen band.
 */
const {
  Cam, fit, prism, proj, rings, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const BL = 26, BZ = 6, REST = 10, MAX = 28, SW = 18;
const box = (P, front, x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.7) => {
  const [o, i] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, o, i, z0, z1);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.35);
  fit(C, [[-BL, -BL, 0], [BL, BL, 0], [-BL, BL, 0], [BL, -BL, 0], [-SW, -SW, BZ + 30 + MAX + 14], [SW, SW, BZ + 30], [-SW, SW, BZ + 30], [SW, -SW, BZ + 30]], 200, 160);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[-BL + 3, 0], [0, -BL + 3], [0, BL - 3], [BL - 3, 0]]) place(flatDot(g, C, 2.4, "dot off"), P(x, y, 0));
  put(solid(g), box(P, front, -BL, -4, BL, 4, 2, BZ));
  put(solid(g), box(P, front, -4, -BL, 4, BL, 2, BZ));
  put(solid(g), box(P, front, -7, -7, 7, 7, BZ, BZ + 18, 2.5, 1));
  const st1 = solid(g), st2 = solid(g), sad = solid(g), jaws = solid(g);
  const lift = spring(REST, { k: 110, c: 19 });
  let drawn = NaN, max = MAX * value;

  function draw() {
    const h = lift.x;
    if (Math.abs(h - drawn) < 1e-3) return;
    drawn = h;
    const z1 = BZ + 18 + h * 0.5, z2 = z1 + 12 + h * 0.5;
    put(st1, box(P, front, -5, -5, 5, 5, BZ + 18, z1 + 6, 2, 0.8));
    put(st2, box(P, front, -3, -3, 3, 3, z1 + 6, z2, 1.2, 0.5));
    // the saddle tilts toward +x as it rises: a sheared slab
    const t = (h / MAX) * 5, zs = z2;
    const T = (pts) => pts;
    const s = box(P, front, -SW, -SW + 4, SW, SW - 4, zs, zs + 3, 3, 1.2);
    put(sad, s);
    let js = "", jc = "";
    for (const [x, y] of [[-SW, -SW + 4], [SW - 4, -SW + 4], [-SW, SW - 8], [SW - 4, SW - 8]]) {
      const j = box(P, front, x, y, x + 4, y + 4, zs + 3, zs + 8 + (x > 0 ? t : 0), 1, 0.4);
      js += j.sil; jc += j.crease;
    }
    put(jaws, T({ sil: js, crease: jc }));
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(u) {
    lift.t = u == null ? REST : clamp(REST + (max - REST) * u, REST, max);
    sad.sil.classList.toggle("hi", true);
    read.textContent = u == null ? "rest" : Math.round(lift.t) + " cm";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [cx, fy] = P(0, 0, 0), ty = P(0, 0, BZ + 30 + MAX)[1];
      if (Math.abs(p[0] - cx) > 90 || p[1] > fy + 40 || p[1] < ty - 20) return aim(null);
      aim(clamp((fy - p[1]) / ((fy - ty) * 0.6), 0, 1));
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { max = MAX * v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "transjack",
  means: "A transmission jack: the two-stage ram telescopes up and lifts its jawed saddle as the pointer rises over it.",
  rules: [1, 3, 5],
  range: [0.6, 1, 1],
  tour: [[200, 136], [200, 90], [200, 190], null],
  mount,
});
