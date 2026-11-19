/**
 * Fairing: a rocket's upper stage on a pad, capped by a payload fairing in
 * two clamshell halves around a satellite. The pointer picks a half by which
 * side of the rocket it is on: that half swings open on its base hinge and the
 * other follows halfway, showing the satellite inside. At rest the right half
 * stands just ajar, bright. The slider is how far a half swings.
 *
 * The pattern: one of two parts, picked by screen x against the rest axis.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 16, ZS = 26, H1 = 28, H2 = 26, PAD = 34, AJAR = 0.22;
const SQ = Math.SQRT1_2;
// u runs screen-right (x - y), w runs toward the viewer (x + y)
const W = (u, w, z) => [(u + w) * SQ, (w - u) * SQ, z];
const prof = (t) => (t <= H1 ? R : R * Math.cos(((t - H1) / H2) * Math.PI / 2) ** 0.75 + 1.2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-PAD, -PAD, 0], [PAD, PAD, 0], [PAD, -PAD, 0], [-PAD, PAD, 0], W(-60, 0, ZS + 50), W(60, 0, ZS + 50), [0, 0, ZS + H1 + H2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PAD, -PAD, PAD, PAD, 8, 2);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  put(solid(g), prism(P, front, circ(R, 48), circ(R - 1.5, 48), 0, ZS));
  mk("path", { d: poly(ringAt0(R - 4, ZS + 0.4)), class: "nf lo" }, g);
  function ringAt0(r, z) { return circ(r, 40).map((q) => P(q.u, q.v, z)); }

  // the satellite: a box body, a dish on top, two folded panels
  const sat = mk("g", {}, g);
  const [br, bi] = rings(-7, -7, 7, 7, 1.5, 1);
  put(solid(sat), prism(P, front, br, bi, ZS + 2, ZS + 26));
  put(solid(sat), prism(P, front, circ(5, 24), circ(3.5, 24), ZS + 26, ZS + 29));
  mk("path", { d: seg(P(0, 0, ZS + 29), P(0, 0, ZS + 34)), class: "nf" }, sat);
  for (const s of [-1, 1]) {
    const [a, b] = [W(s * 7.2, -4, ZS + 6), W(s * 7.2, 4, ZS + 22)];
    mk("path", { d: poly([P(...W(s * 7.2, -5, ZS + 5)), P(...W(s * 7.2, 5, ZS + 5)), P(...W(s * 7.2, 5, ZS + 23)), P(...W(s * 7.2, -5, ZS + 23))]), class: "nf lo" }, sat);
    void a; void b;
  }

  // a half: semicircle rings up the profile, turned about its outer base edge
  const halves = [-1, 1].map((s) => {
    const grp = mk("g", {}, g), sil = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp);
    return { s, grp, sil, edge, a: tween(s > 0 ? AJAR : 0), last: NaN };
  });
  function pt(s, phi, t, th) {
    const r = prof(t), u = s * r * Math.cos(phi), w = r * Math.sin(phi), z = t;
    const du = u - s * R, u2 = s * R + du * Math.cos(th) + s * z * Math.sin(th), z2 = -s * du * Math.sin(th) + z * Math.cos(th);
    return P(...W(u2, w, ZS + z2));
  }
  function draw(h, th) {
    if (th === h.last) return;
    h.last = th;
    const pts = [], lip = [];
    for (let i = 0; i <= 14; i++) {
      const t = (i / 14) * (H1 + H2);
      for (let j = 0; j <= 12; j++) pts.push(pt(h.s, -Math.PI / 2 + (j / 12) * Math.PI, t, th));
      lip.push(pt(h.s, Math.PI / 2, t, th));
    }
    for (let i = 14; i >= 0; i--) lip.push(pt(h.s, -Math.PI / 2, (i / 14) * (H1 + H2), th));
    h.sil.setAttribute("d", poly(hull(pts)));
    const ring = [];
    for (let j = 0; j <= 12; j++) ring.push(pt(h.s, -Math.PI / 2 + (j / 12) * Math.PI, H1, th));
    h.edge.setAttribute("d", "M" + ring.map((p) => p.join(",")).join("L") + " M" + lip.map((p) => p.join(",")).join("L"));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const h of halves) { draw(h, tval(h.a, now) * 1.25); if (!tdone(h.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const axis = P(0, 0, ZS + 20), top = P(0, 0, ZS + H1 + H2), foot = P(0, 0, 0);
  function hit([sx, sy]) {
    if (sy < top[1] - 20 || sy > foot[1] + 30 || Math.abs(sx - axis[0]) > 110) return -1;
    return sx < axis[0] ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    halves.forEach((h, k) => {
      const v = a < 0 ? (k === 1 ? AJAR : 0) : k === a ? amax : amax * 0.45;
      tset(h.a, v, now, a < 0 || k === a ? 0 : 60);
      h.sil.classList.toggle("hi", k === (a < 0 ? 1 : a));
    });
    read.textContent = a < 0 ? "rest" : (a ? "right " : "left ") + Math.round(amax * 72) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { amax = clamp(v, 0.3, 1); const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "fairing",
  means: "A rocket's payload fairing in two halves: the half on the pointer's side swings open on its hinge to show the satellite.",
  rules: [1, 4, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[180, 105], [220, 105], [180, 105], null],
  mount,
});
