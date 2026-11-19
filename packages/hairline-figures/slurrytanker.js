/**
 * Slurry tanker: a round tank on two wheels with a drawbar at the front and a
 * dribble bar at the back, its two boom wings folded up for the road, hoses
 * hanging from them. The pointer over the tanker unfolds the wings down and
 * out to spread, hoses trailing. At rest the wings stand folded, the near one
 * bright. The slider is how far the booms unfold.
 *
 * The pattern: one continuous value (a spring on the fold angle); the hit is a
 * fixed box round the rest pose.
 */
const {
  Cam, circ, fit, hull, poly, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const TL = 100, TR = 18, TZ = 34, WX = 52, WR = 14, WY = 23, BX = 108, HZ = 24, HY = 7, WL = 62, REST = 74;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-34, 0, 0], [BX, HY + WL, HZ], [BX, -HY - WL, HZ], [WX, WY + 8, 0], [WX, -WY - 8, 0], [0, 0, TZ + TR], [BX, HY, HZ + WL]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const yz = (x, r, zc, n = 36) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x, r * Math.cos(t), zc + r * Math.sin(t)); });
  const xz = (y, r, xc, zc, n = 32) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(xc + r * Math.cos(t), y, zc + r * Math.sin(t)); });
  const tube = (a, b, r) => poly(hull(circ(r, 10).map((q) => P(a[0] + q.u, a[1] + q.v, a[2])).concat(circ(r, 10).map((q) => P(b[0] + q.u, b[1] + q.v, b[2])))));
  const wheel = (y) => {
    const s = mk("g", {}, g), y2 = y + Math.sign(y) * 7;
    mk("path", { class: "sil", d: poly(hull(xz(y, WR, WX, WR).concat(xz(y2, WR, WX, WR)))) }, s);
    mk("path", { class: "nf lo", d: poly(xz(Math.max(y, y2), WR - 5, WX, WR)) }, s);
  };
  const wingEl = (cls) => { const w = mk("g", {}, g); return { bar: mk("path", { class: cls }, w), hoses: mk("path", { class: "nf lo" }, w) }; };
  wheel(-WY);
  const farW = wingEl("sil");
  mk("path", { class: "sil", d: tube([-34, 0, 12], [6, 0, 18], 2.2) }, g);
  mk("path", { class: "sil", d: poly(hull(yz(0, TR, TZ).concat(yz(TL, TR, TZ)))) }, g);
  mk("path", { class: "nf", d: poly(yz(TL, TR, TZ)) }, g);
  mk("path", { class: "nf lo", d: poly(yz(TL, TR - 4, TZ)) }, g);
  mk("path", { class: "sil", d: tube([TL * 0.45, 0, TZ + TR], [TL * 0.45, 0, TZ + TR + 4], 5) }, g);
  wheel(WY);
  mk("path", { class: "sil", d: tube([BX, -HY - 2, HZ], [BX, HY + 2, HZ], 2.6) }, g);
  mk("path", { class: "nf", d: seg(P(TL - 2, 0, TZ - TR + 2), P(BX, 0, HZ)) }, g);
  const nearW = wingEl("sil hi");

  const sp = spring(REST);
  let last = NaN;
  function wing(w, side, deg) {
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a), h = [BX, side * HY, HZ];
    const at = (t) => [BX, side * (HY + t * c), HZ + t * s];
    w.bar.setAttribute("d", tube(h, at(WL), 2.2));
    let d = "";
    for (let t = 8; t <= WL; t += 9) { const p = at(t); d += seg(P(p[0] - 2, p[1], p[2]), P(p[0] + 3, p[1], p[2] - 8)); }
    w.hoses.setAttribute("d", d);
  }
  function draw(deg) {
    if (deg === last) return; last = deg;
    wing(farW, -1, deg); wing(nearW, 1, deg);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const box = [[-34, 0, 0], [BX, HY + WL, HZ], [BX, -HY - WL, HZ], [BX, HY, HZ + WL], [WX, WY + 8, 0], [0, 0, TZ + TR + 6], [TL, 0, 0]].map((q) => P(...q));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const x0 = Math.min(...xs) - 10, x1 = Math.max(...xs) + 10, y0 = Math.min(...ys) - 10, y1 = Math.max(...ys) + 10;
  let on = false;
  function retarget() {
    sp.t = on ? REST - (REST + 4) * (0.3 + 0.7 * amt) : REST;
    read.textContent = on ? "boom " + Math.round(REST - sp.t) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { on = p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1; retarget(); },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "slurrytanker",
  means: "A slurry tanker on two wheels: the pointer over it unfolds the dribble bar's two boom wings down and out to spread.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[217, 126], [342, 159], [58, 126], null],
  mount,
});
