/**
 * Pie keeper: a round tin base holding a pie, under a tall domed lid hinged
 * at the back. At rest the lid sits a little ajar, bright. The pointer over
 * the keeper tips the lid open on its hinge to show the pie. The slider is
 * how far it opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const CX = 40, CY = 40, R = 40, BZ = 7, DH = 30, HY = CY - R - 2;
const disc = (r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [80, 80, 0], [80, 0, 0], [0, 80, 0], [CX, HY - 30, 75], [CX, HY, BZ + 2 * R + 4], [CX, CY, BZ + DH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(CX - R, CY - R, CX + R, CY + R, R, 2.2);
  put(solid(g), prism(P, front, disc(R), disc(R - 2.2), 0, BZ));
  const pie = mk("g", {}, g), mound = [];
  for (const [r, z] of [[R - 5, 0], [R - 8, 4], [R - 14, 7]]) mound.push(...ringAt(P, disc(r, 32), BZ + z));
  mk("path", { d: poly(hull(mound)), class: "nf" }, pie);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2, r0 = 4, r1 = R - 14;
    mk("path", { d: "M" + P(CX + r0 * Math.cos(a), CY + r0 * Math.sin(a), BZ + 7) + "L" + P(CX + r1 * Math.cos(a), CY + r1 * Math.sin(a), BZ + 7), class: "nf lo" }, pie);
  }
  const lid = mk("g", {}, g);
  const dome = mk("path", { class: "sil hi" }, lid), rim = mk("path", { class: "nf lo" }, lid), knob = mk("path", { class: "nf" }, lid);
  const tw = tween(14);
  let last = NaN;
  function T(x, y, z, th) {
    const dy = y - HY, dz = z - BZ, c = Math.cos(th), s = Math.sin(th);
    return P(x, HY + dy * c - dz * s, BZ + dy * s + dz * c);
  }
  const ring = (r, z, th, n = 32) => circ(r, n).map((q) => T(q.u + CX, q.v + CY, z, th));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = (deg * Math.PI) / 180, pts = [];
    for (let i = 0; i <= 7; i++) { const t = (i / 7) * (Math.PI / 2); pts.push(...ring((R + 1) * Math.cos(t), BZ + 0.5 + DH * Math.sin(t), th)); }
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(R - 1, BZ + 3, th, 40)));
    knob.setAttribute("d", poly(hull(ring(4, BZ + DH, th, 16).concat(ring(4, BZ + DH + 4, th, 16)))));
    if (deg > 45) g.insertBefore(lid, pie); else g.appendChild(lid);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? max : 14, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); set(Math.hypot(x - CX, y - CY) < R + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "pietin",
  means: "A pie keeper: the domed lid, hinged at the back, tips open over the pie when the pointer comes near.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 85],
  tour: [[200, 162], [129, 260], [271, 260], null],
  mount,
});
