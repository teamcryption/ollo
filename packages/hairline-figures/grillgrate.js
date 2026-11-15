/**
 * Grill grate: a kettle barbecue on three legs, its domed lid hinged at the
 * back rim. The pointer's place across the figure swings the lid open to
 * show the grate inside. At rest the lid stands a little ajar, bright. The
 * slider is how far the lid can swing.
 *
 * The pattern: one part turning on a hinge (swing).
 */
const { Cam, fit, proj, hull, poly, seg, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const R = 34, RIM = 30, DOME = 24, REST = 0.18;
const B = Math.SQRT1_2, HX = -R * B, HY = -R * B, K = [B, -B, 0];
function rot([x, y, z], a) {
  const v = [x - HX, y - HY, z - RIM], c = Math.cos(a), s = Math.sin(a);
  const cr = [K[1] * v[2] - K[2] * v[1], K[2] * v[0] - K[0] * v[2], K[0] * v[1] - K[1] * v[0]];
  const d = (K[0] * v[0] + K[1] * v[1] + K[2] * v[2]) * (1 - c);
  return [HX + v[0] * c + cr[0] * s + K[0] * d, HY + v[1] * c + cr[1] * s + K[1] * d, RIM + v[2] * c + cr[2] * s + K[2] * d];
}
const ring = (r, z, n = 36) => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * 2 * Math.PI), r * Math.sin((i / n) * 2 * Math.PI), z]);
const domePts = () => { const o = []; for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); o.push(...ring((R + 1) * Math.cos(t), RIM + DOME * Math.sin(t))); } return o; };
const handlePts = () => [[-8, 8, RIM + DOME + 5], [8, -8, RIM + DOME + 5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.45);
  const dome = domePts();
  fit(C, [...ring(R, 0), ...ring(R, RIM), ...dome, ...dome.map((p) => rot(p, rad(110))), ...handlePts().map((p) => rot(p, rad(110)))], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // legs, then the bowl, then the grate
  let legs = "";
  for (const a of [0.8, 2.9, 5.0]) legs += seg(P(20 * Math.cos(a), 20 * Math.sin(a), 12), P(31 * Math.cos(a), 31 * Math.sin(a), 0));
  mk("path", { d: legs, class: "nf" }, g);
  const bowlG = mk("g", {}, g), bowl = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); bowl.push(...ring(R * Math.sin(t), RIM - 22 * Math.cos(t))); }
  mk("path", { d: poly(hull(bowl.map((p) => P(...p)))), class: "sil" }, bowlG);
  mk("path", { d: poly(ring(R, RIM, 60).map((p) => P(...p))), class: "nf" }, bowlG);
  let grate = poly(ring(R - 4, RIM - 2, 48).map((p) => P(...p)));
  for (let y = -24; y <= 24; y += 6) { const w = Math.sqrt((R - 4) ** 2 - y * y); grate += seg(P(-w, y, RIM - 2), P(w, y, RIM - 2)); }
  mk("path", { d: grate, class: "nf lo" }, bowlG);
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), seam = mk("path", { class: "nf lo" }, lidG), hand = mk("path", { class: "nf" }, lidG);
  const ang = tween(REST * maxA);
  let last = NaN, behind = false;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a), Q = (p) => P(...rot(p, r));
    lid.setAttribute("d", poly(hull(dome.map(Q))));
    seam.setAttribute("d", poly(ring(R + 1, RIM + 3, 48).map(Q)));
    const [h0, h1] = handlePts();
    hand.setAttribute("d", seg(Q(h0), Q(h1)) + seg(Q(h0), Q([h0[0], h0[1], h0[2] - 5])) + seg(Q(h1), Q([h1[0], h1[1], h1[2] - 5])));
    const b = a > 55;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lidG, bowlG); else g.appendChild(lidG); }
  }
  lid.classList.add("hi");
  const L = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(L.unregister);
  const x0 = P(-R, R, 0)[0], x1 = P(R, -R, 0)[0], yc = P(0, 0, RIM)[1];
  function setT(t) {
    const to = t < 0 ? REST * maxA : Math.round(t * maxA);
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
  name: "grillgrate",
  means: "A kettle grill: the pointer swings the domed lid open on its back hinge to show the grate inside.",
  rules: [1, 3, 4, 5],
  range: [60, 95, 110],
  tour: [[96, 275], [200, 195], [304, 160], null],
  mount,
});
