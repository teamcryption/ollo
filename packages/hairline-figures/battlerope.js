/**
 * Dip station: two parallel bars, each on a pair of posts, standing on two
 * floor rails. The pointer sets the grip: both bars slide along the rails to
 * sit as far apart as the pointer is from the middle, and the bar on its side
 * is bright. At rest the bars stand a little off-centre, the near one bright.
 * The slider is how quickly the bars follow.
 */
const { Cam, fit, proj, facing, rings, prism, unproj, spring, stepS, clamp, disposer, mk, pointer, put, register, solid } = HL;

const PX = 18, HT = 40, REST = [-10, 14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-28, -28, 43], [28, 28, 43]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = (x0, y0, x1, y1) => rings(x0, y0, x1, y1, 0.8, Math.min(1, 0.25 * Math.min(x1 - x0, y1 - y0)));
  const box = (s, x0, y0, x1, y1, z0, z1) => { const r = R(x0, y0, x1, y1); put(s, prism(P, front, r[0], r[1], z0, z1)); };
  box(solid(g), -PX - 4, -28, -PX + 4, 28, 0, 2.5);
  box(solid(g), PX - 4, -28, PX + 4, 28, 0, 2.5);
  const sides = REST.map((y, i) => {
    const sg = mk("g", {}, g);
    return { i, a: solid(sg), b: solid(sg), bar: solid(sg), sp: spring(y, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN };
  });

  function draw(s) {
    const y = s.sp.x;
    if (Math.abs(y - s.drawn) < 1e-3) return;
    s.drawn = y;
    box(s.a, -PX - 1.6, y - 1.6, -PX + 1.6, y + 1.6, 2.5, HT);
    box(s.b, PX - 1.6, y - 1.6, PX + 1.6, y + 1.6, 2.5, HT);
    box(s.bar, -28, y - 1.8, 28, y + 1.8, HT, HT + 3);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of sides) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  function aim(y) {
    const w = y == null ? null : clamp(Math.abs(y), 7, 26);
    sides.forEach((s) => {
      s.sp.t = w == null ? REST[s.i] : s.i ? w : -w;
      s.bar.sil.classList.toggle("hi", y == null ? s.i === 1 : (y < 0) === (s.i === 0));
    });
    read.textContent = w == null ? "rest" : "w " + Math.round(w * 2);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], 20);
      aim(Math.abs(x) > 40 || Math.abs(y) > 40 ? null : y);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => sides.forEach((s) => { s.sp.k = 100 * v; s.sp.c = 18 * Math.sqrt(v); }), destroy: bag.dispose };
}

hairline({
  name: "battlerope",
  means: "A dip station: both parallel bars slide apart or together to the pointer's grip width, and the bar on its side is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[147, 188], [216, 154], [253, 135], null],
  mount,
});
