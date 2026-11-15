/**
 * Dutch oven: a heavy round pot with loop ears and a low domed lid with a
 * knob. The pointer's place across the figure tilts the lid up off the pot
 * on its back rim. At rest the lid sits a little ajar, bright. The slider
 * is how far the lid can tilt.
 *
 * The pattern: one part turning on an edge (tilt).
 */
const { Cam, fit, proj, hull, poly, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const R = 32, RIM = 26, DOME = 7, REST = 0.2;
const B = Math.SQRT1_2, HX = -R * B, HY = -R * B, K = [B, -B, 0];
function rot([x, y, z], a) {
  const v = [x - HX, y - HY, z - RIM], c = Math.cos(a), s = Math.sin(a);
  const cr = [K[1] * v[2] - K[2] * v[1], K[2] * v[0] - K[0] * v[2], K[0] * v[1] - K[1] * v[0]];
  const d = (K[0] * v[0] + K[1] * v[1] + K[2] * v[2]) * (1 - c);
  return [HX + v[0] * c + cr[0] * s + K[0] * d, HY + v[1] * c + cr[1] * s + K[1] * d, RIM + v[2] * c + cr[2] * s + K[2] * d];
}
const ring = (r, z, n = 36) => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * 2 * Math.PI), r * Math.sin((i / n) * 2 * Math.PI), z]);
const domePts = () => { const o = [...ring(R + 1, RIM)]; for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); o.push(...ring((R + 1) * Math.cos(t), RIM + 2.5 + DOME * Math.sin(t))); } return o; };
const knobPts = () => [...ring(4, RIM + 2 + DOME, 20), ...ring(6, RIM + 2 + DOME + 6, 20)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.75);
  const dome = domePts(), knob = knobPts();
  fit(C, [...ring(R + 9, 0), ...ring(R + 9, RIM), ...dome, ...knob, ...dome.map((p) => rot(p, rad(80))), ...knob.map((p) => rot(p, rad(80)))], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // the far ear, the pot and its rim, the near ear
  const ear = (sx) => { const o = []; for (const z of [RIM - 9, RIM - 2]) o.push(...ring(5, z, 16).map(([x, y, zz]) => [x + sx * (R + 4) * B, y - sx * (R + 4) * B, zz])); return poly(hull(o.map((p) => P(...p)))); };
  mk("path", { d: ear(-1), class: "sil" }, g);
  mk("path", { d: poly(hull([...ring(R, 0), ...ring(R, RIM)].map((p) => P(...p)))), class: "sil" }, g);
  mk("path", { d: poly(ring(R, RIM, 60).map((p) => P(...p))) + poly(ring(R - 3, RIM, 60).map((p) => P(...p))), class: "nf lo" }, g);
  mk("path", { d: ear(1), class: "sil" }, g);
  const lid = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g), hand = mk("path", { class: "sil hi" }, g);
  const ang = tween(REST * maxA);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a), Q = (p) => P(...rot(p, r));
    lid.setAttribute("d", poly(hull(dome.map(Q))));
    seam.setAttribute("d", poly(ring(R + 1, RIM + 2.5, 48).map(Q)));
    hand.setAttribute("d", poly(hull(knob.map(Q))));
  }
  const L = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(L.unregister);
  const x0 = P(-R, R, 0)[0], x1 = P(R, -R, 0)[0], yc = P(0, 0, RIM)[1];
  function setT(t) {
    const to = t < 0 ? Math.round(REST * maxA) : Math.round(t * maxA);
    tset(ang, to, performance.now(), 0);
    read.textContent = t < 0 ? "rest" : to + "°";
    L.wake();
  }
  setT(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setT(sx < x0 - 30 || sx > x1 + 30 || Math.abs(sy - yc) > 120 ? -1 : clamp((sx - x0) / (x1 - x0), 0, 1)),
    leave: () => setT(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "dutchoven",
  means: "A Dutch oven: the pointer tilts the heavy domed lid up off the pot on its back rim.",
  rules: [1, 3, 4, 5],
  range: [30, 55, 80],
  tour: [[83, 256], [200, 201], [317, 172], null],
  mount,
});
