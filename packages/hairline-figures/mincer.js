/**
 * Meat mincer: one cast mincer, a barrel on a stand with a hopper on top and
 * a crank at one end. At rest the crank stands part way round, bright. The
 * crank turns to point at the pointer, on a spring. The slider is how far
 * the crank arm reaches.
 *
 * The pattern: one part aims at the pointer (aim).
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const BR = 11, ZC = 34, X0 = -20, X1 = 18, XC = 24, REST = 0.9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let L = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-24, -24, 0], [24, 24, 0], [-24, 24, 0], [24, -24, 0], [0, 0, ZC + 34], [XC, 30, ZC + 30], [XC, -30, ZC - 30]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const yz = (x, y, z, r, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(P(x, y + r * Math.cos(t), z + r * Math.sin(t))); } return o; };
  const xyr = (cx, cy, r, z, n = 24) => ringAt(P, circ(r, n).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), z);
  const nearX = P(30, 0, 0)[1] > P(-30, 0, 0)[1];
  const crank = mk("g", {}, g);
  const body = mk("g", {}, g);
  if (nearX) body.after(crank);
  // stand: a foot and a column up to the barrel
  mk("path", { d: poly(hull(xyr(0, 0, 18, 0).concat(xyr(0, 0, 18, 4)))), class: "sil" }, body);
  mk("path", { d: poly(hull(xyr(0, 0, 6, 4).concat(xyr(0, 0, 5, ZC)))), class: "sil" }, body);
  // barrel along x, then the hopper funnel on top
  mk("path", { d: poly(hull(yz(X0, 0, ZC, BR, 32).concat(yz(X1, 0, ZC, BR, 32)))), class: "sil" }, body);
  mk("path", { d: poly(yz(nearX ? X1 : X0, 0, ZC, BR - 2, 32)), class: "nf lo" }, body);
  mk("path", { d: poly(hull(xyr(-4, 0, 6, ZC + 6).concat(xyr(-4, 0, 16, ZC + 24), xyr(-4, 0, 16, ZC + 26)))), class: "sil" }, body);
  mk("path", { d: poly(xyr(-4, 0, 14, ZC + 26, 32)), class: "nf lo" }, body);
  // crank: hub, arm, handle
  const hub = mk("path", { d: poly(hull(yz(X1, 0, ZC, 4).concat(yz(XC, 0, ZC, 4)))), class: "nf" }, crank);
  const arm = mk("path", { class: "sil hi" }, crank), knob = mk("path", { class: "nf" }, crank);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const y = L * Math.cos(a), z = ZC + L * Math.sin(a);
    arm.setAttribute("d", poly(hull(yz(XC, 0, ZC, 5).concat(yz(XC + 3, 0, ZC, 5), yz(XC, y, z, 3), yz(XC + 3, y, z, 3)))));
    knob.setAttribute("d", poly(hull(yz(XC + 3, y, z, 2.6).concat(yz(XC + 14, y, z, 2.6)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const o = P(XC, 0, ZC), ey = P(XC, 1, ZC), ez = P(XC, 0, ZC + 1);
  const uy = [ey[0] - o[0], ey[1] - o[1]], uz = [ez[0] - o[0], ez[1] - o[1]], det = uy[0] * uz[1] - uy[1] * uz[0];
  function aim(t, on) {
    let d = t - sp.t;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    sp.t += d;
    read.textContent = on ? ((Math.round((sp.t * 180) / Math.PI) % 360) + 360) % 360 + "°" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const dx = sx - o[0], dy = sy - o[1];
    if (Math.hypot(dx, dy) < 6) return;
    const u = (dx * uz[1] - dy * uz[0]) / det, w = (uy[0] * dy - uy[1] * dx) / det;
    aim(Math.atan2(w, u), true);
  }
  aim(REST, false);
  bag.add(pointer(stage, { move, leave: () => aim(REST, false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { L = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "mincer",
  means: "A cast meat mincer on its stand: the crank at its end turns round to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [18, 24, 28],
  tour: [[249, 257], [249, 86], [156, 207], null],
  mount,
});
