/**
 * Stair stepper: a base, a column with its handlebar, and two long pedals
 * hinged at the column. The pointer chooses a pedal by where it falls on the
 * floor: that pedal presses down and the other rises, as a step does. At rest
 * the left pedal is up, bright. The slider is how quickly the step lands.
 */
const { Cam, fit, proj, facing, rings, prism, hull, poly, unproj, tween, tset, tval, tdone, rad, disposer, mk, pointer, put, register, solid } = HL;

const H = -15, L = 34, Z = 8, T = 3, UP = 20, DOWN = -3, REST = [16, -2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-26, -15, 0], [26, 15, 0], [-24, -15, 49], [20, 15, 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1) => {
    const s = solid(g), R = rings(x0, y0, x1, y1, 0.8, Math.min(1, 0.25 * Math.min(x1 - x0, y1 - y0)));
    put(s, prism(P, front, R[0], R[1], z0, z1));
    return s;
  };
  box(-26, -15, 26, 15, 0, 4);
  box(-22, -2, -18, 2, 4, 46);
  box(-23.5, -15, -16.5, 15, 46, 49);
  const peds = [[-13, -3], [3, 13]].map(([y0, y1], i) => ({ i, y0, y1, s: solid(g), tw: tween(REST[i], 700 / value), drawn: NaN }));

  function draw(p, now) {
    const a = rad(tval(p.tw, now));
    if (Math.abs(a - p.drawn) < 1e-5) return;
    p.drawn = a;
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (const u of [0, 1]) for (const v of [p.y0, p.y1]) for (const w of [0, T]) pts.push(P(H + u * L * c - w * s, v, Z + u * L * s + w * c));
    put(p.s, { sil: poly(hull(pts)), crease: poly([pts[1], pts[3], pts[7], pts[5]]) });
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const p of peds) { draw(p, now); if (!tdone(p.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function choose(k) {
    const now = performance.now();
    peds.forEach((p) => {
      tset(p.tw, k == null ? REST[p.i] : p.i === k ? DOWN : UP, now, 0);
      p.s.sil.classList.toggle("hi", k == null ? p.i === 0 : p.i === k);
    });
    read.textContent = k == null ? "rest" : k ? "right" : "left";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], 10);
      choose(Math.abs(x) > 34 || Math.abs(y) > 24 ? null : y < 0 ? 0 : 1);
    },
    leave: () => choose(null),
  }));
  bag.add(() => svg.replaceChildren());
  choose(null);
  return { set: (v) => peds.forEach((p) => { p.tw.dur = 700 / v; }), destroy: bag.dispose };
}

hairline({
  name: "stepper",
  means: "A stair stepper: the pedal under the pointer presses down and the other rises, and the pressed pedal is bright.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[241, 207], [205, 225], [195, 185], null],
  mount,
});
