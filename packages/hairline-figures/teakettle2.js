/**
 * Gooseneck kettle: a squat kettle with a long thin swan-neck spout and a
 * loop handle. The pointer's place across the figure tips the whole kettle
 * forward on its front base edge to pour. At rest it stands level with the
 * spout bright. The slider is how far it can tip.
 *
 * The pattern: one body turning on an edge (tilt).
 */
const { Cam, fit, proj, hull, poly, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const RB = 24, RT = 16, H = 30, AX = 24, REST = 0;
const ring = (r, z, n = 36) => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * 2 * Math.PI), r * Math.sin((i / n) * 2 * Math.PI), z]);
const rot = ([x, y, z], a) => { const c = Math.cos(a), s = Math.sin(a), dx = x - AX; return [AX + dx * c + z * s, y, -dx * s + z * c]; };
// a tube in the x-z plane: its centreline and half width, as a closed outline
function tube(line, w) {
  const L = [], Rr = [];
  line.forEach((p, i) => {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const n = Math.hypot(tx, tz) || 1; tx /= n; tz /= n;
    L.push([p[0] - tz * w, 0, p[1] + tx * w]); Rr.push([p[0] + tz * w, 0, p[1] - tx * w]);
  });
  return L.concat(Rr.reverse());
}
const bez = (p0, p1, p2, p3, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); });
const SPOUT = tube(bez([18, 6], [44, 0], [34, 40], [56, 42]), 2);
const HANDLE = tube(bez([-14, H + 2], [-42, H + 6], [-40, 4], [-22, 6]), 2.6);
const BODY = [...ring(RB, 0), ...ring(RB, 4), ...ring(RT, H)];
const LID = [...ring(RT - 2, H), ...ring(8, H + 6, 24), ...ring(3, H + 8, 12), ...ring(3, H + 12, 12)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.2);
  const all = [...BODY, ...LID, ...SPOUT, ...HANDLE];
  fit(C, [...all, ...all.map((p) => rot(p, rad(50)))], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hand = mk("path", { class: "sil" }, g), body = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), spout = mk("path", { class: "sil hi" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a), Q = (p) => P(...rot(p, r));
    hand.setAttribute("d", poly(HANDLE.map(Q)));
    body.setAttribute("d", poly(hull(BODY.map(Q))));
    seam.setAttribute("d", poly(ring(RB, 4, 48).map(Q)) + poly(ring(RT - 2, H, 40).map(Q)));
    lid.setAttribute("d", poly(hull(LID.map(Q))));
    spout.setAttribute("d", poly(SPOUT.map(Q)));
  }
  const Lp = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(Lp.unregister);
  const x0 = P(-RB, RB, 0)[0], x1 = P(RB, -RB, 0)[0], yc = P(0, 0, H / 2)[1];
  function setT(t) {
    const to = t < 0 ? REST : Math.round(t * maxA);
    tset(ang, to, performance.now(), 0);
    read.textContent = t < 0 ? "rest" : to + "°";
    Lp.wake();
  }
  setT(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setT(sx < x0 - 40 || sx > x1 + 60 || Math.abs(sy - yc) > 120 ? -1 : clamp((sx - x0) / (x1 - x0), 0, 1)),
    leave: () => setT(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "teakettle2",
  means: "A gooseneck kettle: the pointer tips the whole kettle forward on its base edge to pour from the thin spout.",
  rules: [1, 3, 4, 5],
  range: [20, 35, 50],
  tour: [[64, 203], [155, 137], [245, 114], null],
  mount,
});
