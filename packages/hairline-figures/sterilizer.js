/**
 * Autoclave: a squat steel chamber with a round, thick pressure door on its
 * front face. The door swings out on its side hinge as the pointer comes over
 * the chamber, wider the nearer the front. At rest it stands a little ajar,
 * bright. The slider is the widest swing.
 *
 * The pattern: one door turning on a hinge (open).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 56, W = 70, H = 66, R = 26, TH = 8, REST = 14, ZC = H / 2 + 2, YH = W / 2 + R;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [D + 2 * R + 8, W + 4, 0], [D + 4, -4, 0], [-4, W + 4, 0], [0, 0, H + 8], [D, W, H + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, D + 4, W + 4, 4, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 5));
  const [br, bi] = rings(0, 0, D, W, 6, 1.8);
  put(solid(g), prism(P, front, br, bi, 5, H));
  const bore = circ(R - 3, 32).map((q) => P(D, W / 2 + q.u, ZC + q.v));
  mk("path", { d: poly(bore), class: "nf lo" }, g);
  mk("path", { d: seg(P(D * 0.3, 8, H), P(D * 0.3, 22, H)) + seg(P(D * 0.6, 8, H), P(D * 0.6, 22, H)), class: "nf lo" }, g);

  const door = solid(g);
  door.sil.classList.add("hi");
  const spokes = mk("path", { class: "nf" }, door.g);
  const ang = spring(REST);
  const ring = circ(R, 40), inner = circ(R - 4, 40), hub = circ(4, 16);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    // u runs from the hinge across the door, t out of the face
    const at = (u, z, t) => P(D + u * s + t * c, YH - u * c + t * s, z);
    const face = (rg, t, du = R) => rg.map((q) => at(du + q.u, ZC + q.v, t));
    door.sil.setAttribute("d", poly(hull(face(ring, 0).concat(face(ring, TH)))));
    door.cr.setAttribute("d", poly(face(inner, TH)));
    let d = poly(hull(face(hub, TH).concat(face(hub, TH + 5))));
    for (let k = 0; k < 3; k++) { const t = rad(90 + k * 120); d += seg(at(R + 4 * Math.cos(t), ZC + 4 * Math.sin(t), TH + 5), at(R + 15 * Math.cos(t), ZC + 15 * Math.sin(t), TH + 5)); }
    d += seg(at(-3, ZC + 14, TH / 2), at(2, ZC + 14, TH / 2)) + seg(at(-3, ZC - 14, TH / 2), at(2, ZC - 14, TH / 2));
    spokes.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function swing(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], ZC);
      if (wy > -30 && wy < W + 50 && wx > -30 && wx < D + 70) a = maxA * clamp((wx + 20) / (D + 50), 0.3, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "door " + a + "°";
    B.wake();
  }
  swing(null);
  bag.add(pointer(stage, { move: swing, leave: () => swing(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; swing(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "sterilizer",
  means: "An autoclave whose round pressure door swings out on its hinge as the pointer comes over the chamber, wider nearer the front.",
  rules: [1, 3, 5, 6],
  range: [40, 75, 100],
  tour: [[240, 158], [190, 217], [262, 140], null],
  mount,
});
