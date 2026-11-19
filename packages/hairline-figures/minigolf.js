/**
 * Mini golf windmill: a little windmill hut on a putting pad, a tunnel
 * through its foot and four broad sails on its face, a ball waiting on the
 * carpet. The pointer's side turns the sails on a spring; at rest they stand
 * off the cross, the lead sail bright. The slider is how far they can turn.
 *
 * The pattern: one part turning on an axis, driven by the pointer's x.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, open, run, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const HW = 9, HZ = 30, RZ = 44, XS = HW + 2.5, R0 = 3, R1 = 27, W0 = 3, W1 = 11, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-22, -22, 0], [26, 26, 0], [XS, -R1, HZ], [XS, R1, HZ], [XS, 0, HZ + R1], [XS, 0, HZ - R1], [0, 0, RZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-22, -22, 26, 26, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 2.5));
  const hole = mk("ellipse", { class: "lo" }, g);
  const hp = P(-14, 16, 2.5); hole.setAttribute("cx", hp[0]); hole.setAttribute("cy", hp[1]); hole.setAttribute("rx", 4.2); hole.setAttribute("ry", 2.1);
  // the hut and its tunnel
  const [hr, hi] = rings(-HW, -HW, HW, HW, 2, 1.2);
  const hut = solid(g);
  put(hut, prism(P, front, hr, hi, 2.5, HZ - 6));
  const arch = [];
  for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; arch.push(P(-4 * Math.cos(t), HW, 2.5 + 5 + 5 * Math.sin(t))); }
  arch.unshift(P(-4, HW, 2.5)); arch.push(P(4, HW, 2.5));
  mk("path", { class: "nf lo", d: open(arch) }, hut.g);
  // the cap: a pyramid roof from the hut's top to a point
  const foot = rrect(-HW - 1.5, -HW - 1.5, HW + 1.5, HW + 1.5, 2, 4), top = rrect(-0.8, -0.8, 0.8, 0.8, 0.6, 2);
  const roof = solid(g);
  roof.sil.setAttribute("d", poly(hull(ringAt(P, foot, HZ - 6).concat(ringAt(P, top, RZ)))));
  roof.cr.setAttribute("d", open(ringAt(P, run(foot, front), HZ - 6)));
  // the hub and the sails, in the plane x = XS
  const hub = mk("ellipse", { class: "" }, g);
  const sails = [0, 1, 2, 3].map((k) => { const sg = mk("g", {}, g); return { sil: mk("path", { class: k === 0 ? "sil hi" : "sil" }, sg), lat: mk("path", { class: "nf lo" }, sg) }; });
  const hc = P(XS + 1, 0, HZ); hub.setAttribute("cx", hc[0]); hub.setAttribute("cy", hc[1]); hub.setAttribute("rx", 3.2); hub.setAttribute("ry", 3.6);
  const ball = flatDot(g, C, 2.6, "dot m"); place(ball, P(14, 18, 2.5));
  const at = (r, n, t) => { const d = [Math.cos(t), Math.sin(t)], m = [-Math.sin(t), Math.cos(t)]; return P(XS, d[0] * r + m[0] * n, HZ + d[1] * r + m[1] * n); };
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    sails.forEach((s, k) => {
      const t = rad(a + k * 90);
      s.sil.setAttribute("d", poly([at(R0, -W0 / 2, t), at(R1, -W1 / 2, t), at(R1, W1 / 2, t), at(R0, W0 / 2, t)]));
      s.lat.setAttribute("d", open([at(R0 + 2, 0, t), at(R1 - 1, 0, t)]) + open([at(R1 * 0.55, -W1 * 0.36, t), at(R1 * 0.55, W1 * 0.36, t)]));
    });
    g.appendChild(hub);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  function aim(p) {
    const u = p ? clamp((p[0] - 200) / 90, -1, 1) : null;
    ang.t = u === null ? REST : REST + u * reach;
    read.textContent = u === null ? "rest" : "sails " + Math.round(ang.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "minigolf",
  means: "A mini golf windmill: the sails on the hut's face turn toward the pointer's side, the further out the further they go.",
  rules: [3, 5, 8, 9],
  range: [15, 40, 45],
  tour: [[276, 203], [120, 170], [256, 113], null],
  mount,
});
