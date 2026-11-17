/**
 * Paper crane: a folded crane with a pointed neck and tail, a creased
 * body and two broad wings. At rest the wings spread almost flat and the
 * near wing is bright. The pointer over the crane raises both wings on
 * their fold, as in a flap. The slider is how high the wings rise.
 *
 * The pattern: hinged parts swinging on one fold line (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const RZ = 18, WL = 46, REST = 18;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let up = value;
  const C = Cam(45, 0.5, 3.35);
  fit(C, [[-40, -WL, RZ], [44, WL, RZ], [-6, -12, RZ + WL], [-6, 12, RZ + WL], [0, 0, 0], [44, 0, 44], [-40, 0, 34]], 200, 160);
  const P = proj(C);
  const H2 = (pts) => poly(hull(pts.map((p) => P(p[0], p[1], p[2]))));
  const g = mk("g", {}, svg);
  const far = mk("path", { class: "sil" }, g);
  mk("path", { d: H2([[-12, -2, RZ - 2], [-12, 2, RZ - 2], [-42, 0, 36], [-38, 0, 38]]) }, g);
  mk("path", { d: H2([[16, 0, RZ], [-14, 0, RZ], [0, -9, RZ - 6], [0, 9, RZ - 6], [0, 0, 2]]) }, g);
  mk("path", { d: poly([P(16, 0, RZ), P(0, 9, RZ - 6), P(0, 0, 2)]), class: "nf lo" }, g);
  mk("path", { d: H2([[12, -2, RZ - 2], [12, 2, RZ - 2], [40, 0, 40], [36, 0, 42]]) }, g);
  mk("path", { d: H2([[36, 0, 42], [40, 0, 40], [48, 0, 34]]) }, g);
  const near = mk("path", { class: "sil hi" }, g), fold = mk("path", { class: "nf lo" }, g);
  const ph = tween(REST);
  let last = NaN;
  const wing = (s, a) => [[16, 0, RZ], [-14, 0, RZ], [-6, s * WL * Math.cos(a), RZ + WL * Math.sin(a)], [6, s * WL * 0.8 * Math.cos(a), RZ + WL * 0.8 * Math.sin(a)]];
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = rad(d);
    far.setAttribute("d", H2(wing(-1, a)));
    near.setAttribute("d", H2(wing(1, a)));
    fold.setAttribute("d", poly([P(1, 0, RZ), P(0, WL * 0.9 * Math.cos(a), RZ + WL * 0.9 * Math.sin(a))]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ph, now)); return !tdone(ph, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, RZ);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ph, on ? up : REST, performance.now(), 0);
    read.textContent = on ? "flap" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { up = v; if (act) { tset(ph, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "origamicrane",
  means: "A folded paper crane: the pointer over it raises both wings on their fold, as in a flap.",
  rules: [1, 3, 5, 6],
  range: [40, 65, 80],
  tour: [[115, 192], [309, 195], [96, 82], null],
  mount,
});
