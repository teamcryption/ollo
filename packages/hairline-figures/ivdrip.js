/**
 * IV drip stand: a pole on a five-legged rolling base, an arm at the top
 * with a hook, and a drip bag hanging from it with its drip chamber and a
 * line running down. The pointer turns the whole stand on its casters so the
 * bag faces it; leaving, the stand swings back to a quarter turn. The bag is
 * the bright mark. The slider is how far the stand may turn.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 40, TOP = 112, LEG = 22;
const SPH = [];
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
  SPH.push([c, s, 0], [c, 0, s], [0, c, s]);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-LEG - 4, -LEG - 4, 0], [LEG + 4, LEG + 4, 0], [-LEG - 4, LEG + 4, 0], [LEG + 4, -LEG - 4, 0], [-24, -24, TOP + 4], [24, 24, TOP + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g), poleG = mk("g", {}, g), fore = mk("g", {}, g);
  const capsule = (A, B, r) => {
    const pts = [];
    for (const [dx, dy, dz] of SPH) pts.push(P(A[0] + dx * r, A[1] + dy * r, A[2] + dz * r), P(B[0] + dx * r, B[1] + dy * r, B[2] + dz * r));
    return poly(hull(pts));
  };
  put(solid(poleG), prism(P, front, circ(4.5, 24), circ(3, 24), 3, 8));
  put(solid(poleG), prism(P, front, circ(1.8, 20), circ(1, 20), 8, TOP));
  const legs = [0, 1, 2, 3, 4].map(() => ({ arm: mk("path", { class: "sil" }, back), wheel: mk("path", { class: "sil" }, back) }));
  const bagG = mk("g", {}, fore);
  const tube = mk("path", { class: "nf lo" }, bagG);
  const armP = mk("path", { class: "sil" }, bagG), hook = mk("path", { class: "sil" }, bagG);
  const pouch = solid(bagG), port = mk("path", { class: "sil" }, bagG), drip = mk("path", { class: "sil" }, bagG);
  pouch.sil.classList.add("hi");
  const bagRing = rrect(6, -3.2, 22, 3.2, 3, 5), bagIn = rrect(7.2, -2, 20.8, 2, 2, 5);

  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const W = (u, v, z) => [u * c - v * s, u * s + v * c, z];
    const rot = (ring) => ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
    legs.forEach((L, i) => {
      const t = a + (i / 5) * Math.PI * 2 + 0.3, ex = Math.cos(t) * LEG, ey = Math.sin(t) * LEG;
      L.arm.setAttribute("d", capsule([0, 0, 5], [ex, ey, 3.2], 1.5));
      L.wheel.setAttribute("d", capsule([ex, ey, 2.2], [ex, ey, 2.4], 2.2));
      const into = ex + ey > 0 ? fore : back;
      if (L.arm.parentNode !== into) { into.prepend(L.wheel); into.prepend(L.arm); }
    });
    armP.setAttribute("d", capsule(W(0, 0, TOP - 2), W(14, 0, TOP - 2), 1.1));
    hook.setAttribute("d", capsule(W(14, 0, TOP - 2), W(14, 0, 103), 0.7));
    put(pouch, prism(P, front, rot(bagRing), rot(bagIn), 78, 101));
    port.setAttribute("d", capsule(W(14, 0, 77), W(14, 0, 73), 1.1));
    drip.setAttribute("d", capsule(W(14, 0, 70), W(14, 0, 62), 2));
    tube.setAttribute("d", open([[14, 0, 60], [15, 0, 50], [17.5, 0, 40], [21, 0, 31], [24, 0, 26]].map(([u, v, z]) => P(...W(u, v, z)))));
    const bx = W(14, 0, 0);
    bagG.parentNode !== (bx[0] + bx[1] > 0 ? fore : back) && (bx[0] + bx[1] > 0 ? fore : back).append(bagG);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { ang.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    let want = (Math.atan2(wy, wx) * 180) / Math.PI;
    want = REST + clamp(((want - REST + 540) % 360) - 180, -reach, reach);
    ang.t = want;
    read.textContent = Math.round(((want % 360) + 360) % 360) + "°";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ivdrip",
  means: "An IV drip stand on casters: the whole stand turns on its base so the hanging bag faces the pointer, and swings back when it leaves.",
  rules: [1, 3, 5, 8],
  range: [30, 120, 170],
  tour: [[94, 290], [200, 305], [306, 290], null],
  mount,
});
