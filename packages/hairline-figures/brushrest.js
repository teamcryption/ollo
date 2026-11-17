/**
 * Brush rest: a low ceramic rest shaped as a row of mountain peaks, with a
 * calligraphy brush laid in one of its valleys, bright. The pointer over
 * the rest lifts the brush out of the valley and tilts it up, tip down,
 * as if to write. The slider is how far the brush tilts.
 *
 * The pattern: one part lifting and tilting (tilt).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PROF = [[0, 0], [0, 6], [10, 15], [20, 8], [32, 24], [44, 8], [54, 15], [64, 6], [64, 0]];
const T = 14, VX = 44, VZ = 8, BR = 3.2, BL = 76, LIFT = 26, REST = 4;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[0, 0, 0], [64, T, 0], [VX, -BL / 2, VZ], [VX, BL / 2 + 6, VZ], [VX, 0, VZ + LIFT + BL / 2], [0, 0, 24]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const face = (y) => poly(PROF.map(([x, z]) => P(x, y, z)));
  mk("path", { d: face(0) }, g);
  for (let i = 1; i < PROF.length - 1; i++) {
    const [a, b] = [PROF[i], PROF[i + 1]];
    mk("path", { d: poly([P(a[0], 0, a[1]), P(b[0], 0, b[1]), P(b[0], T, b[1]), P(a[0], T, a[1])]) }, g);
  }
  mk("path", { d: face(T) }, g);
  const brush = mk("path", { class: "sil hi" }, g), band = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = rad(d), k = (d - REST) / 90, cz = VZ + BR + LIFT * Math.min(1, k * 2.2);
    const dir = [0, Math.cos(a), -Math.sin(a)], e2 = [0, Math.sin(a), Math.cos(a)];
    const at = (s, r, t) => [VX + r * Math.cos(t), T / 2 + s * dir[1] + r * Math.sin(t) * e2[1], cz + s * dir[2] + r * Math.sin(t) * e2[2]];
    const pts = [], ring = [];
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * 2 * Math.PI;
      pts.push(at(-BL / 2, BR, t), at(BL / 2 - 14, BR, t));
      ring.push(at(BL / 2 - 14, BR + 0.6, t));
    }
    pts.push(at(BL / 2 + 6, 0, 0));
    brush.setAttribute("d", poly(hull(pts.map((p) => P(...p)))));
    band.setAttribute("d", poly(hull(ring.map((p) => P(...p)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(32, T / 2, 10);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? tilt : REST, performance.now(), 0);
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "brushrest",
  means: "A mountain-shaped brush rest: the pointer lifts the brush out of its valley and tilts it up, tip down, as if to write.",
  rules: [1, 3, 5, 6],
  range: [30, 55, 75],
  tour: [[156, 241], [224, 298], [93, 196], null],
  mount,
});
