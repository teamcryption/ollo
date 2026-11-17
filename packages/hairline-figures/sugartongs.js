/**
 * Sugar bowl: a tall round bowl of sugar lumps with tongs beside it, under a
 * domed lid hinged at the back. At rest the lid sits ajar, bright; the pointer
 * over the bowl tips the lid open to show the sugar. The slider is
 * how far it opens.
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, unproj,
} = HL;

const CX = 34, CY = 34, R = 26, BZ = 26, DH = 14, HY = CY - R - 2;
const disc = (r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.88);
  fit(C, [[0, 0, 0], [92, 70, 0], [CX, HY, BZ + 2 * R + 4], [CX, CY, BZ + DH], [CX - R, CY + R, 0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tongs = mk("g", {}, g);
  for (const dx of [-3, 3]) mk("path", { d: "M" + P(76, 60 + dx, 1) + "L" + P(64, 60 + dx * 0.4, 1) + "L" + P(56, 60, 1.5), class: "nf" }, tongs);
  mk("path", { d: "M" + P(76, 57, 1) + "Q" + P(80, 60, 1) + " " + P(76, 63, 1), class: "nf" }, tongs);
  const bowl = [];
  for (const [r, z] of [[R * 0.62, 0], [R * 0.72, 2], [R, BZ * 0.55], [R, BZ]]) bowl.push(...ringAt(P, disc(r), z));
  mk("path", { d: poly(hull(bowl)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 1.6), BZ)), class: "nf lo" }, g);
  const pie = mk("g", {}, g);
  for (const [dx, dy] of [[-9, -6], [3, -10], [8, 2], [-4, 6], [-12, 6], [12, -6], [2, 12]]) {
    const x = CX + dx * 0.8, y = CY + dy * 0.8, z = BZ;
    mk("path", { d: poly(hull([P(x - 3, y - 3, z), P(x + 3, y - 3, z), P(x + 3, y + 3, z), P(x - 3, y + 3, z), P(x - 3, y - 3, z + 5), P(x + 3, y - 3, z + 5), P(x + 3, y + 3, z + 5), P(x - 3, y + 3, z + 5)])) }, pie);
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
    rim.setAttribute("d", poly(ring(R - 1, BZ + 2, th, 40)));
    knob.setAttribute("d", poly(hull(ring(3.5, BZ + DH, th, 16).concat(ring(2.5, BZ + DH + 5, th, 16)))));
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
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0), [u, v] = unproj(C, sx, sy, BZ); set(Math.hypot(x - CX, y - CY) < R + 26 || Math.hypot(u - CX, v - CY) < R + 6); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "sugartongs",
  means: "A sugar bowl: its domed lid, hinged at the back, tips open over the lumps when the pointer comes near; tongs rest beside it.",
  rules: [1, 3, 5, 6],
  range: [35, 60, 75],
  tour: [[224, 129], [167, 252], [257, 295], null],
  mount,
});
