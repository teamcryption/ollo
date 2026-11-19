/**
 * Jumping jack toy: a flat wooden clown hung from a loop, arms and legs
 * pinned at the shoulders and hips, a pull string with a bead below. The
 * pointer over the toy pulls the bead down and the limbs fling up and out.
 * At rest the limbs hang a little open and the bead is bright. The slider
 * is how far the limbs swing.
 *
 * The pattern: one object, one gesture (tween on hover).
 */
const {
  Cam, fit, hull, open, poly, proj, tdone, tset, tval, tween, clamp, lerp, rad,
  disposer, mk, pointer, register,
} = HL;

const K = Math.SQRT1_2, TH = 3;
// local (u across the face, z up, d toward the viewer) to world
const W = (u, z, d = 0) => [u * K + d * K, -u * K + d * K, z];
const disc = (u, z, r, n = 14) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push([u + Math.cos(a) * r, z + Math.sin(a) * r]); } return o; };
const limb = (u, z, a, L, r0, r1, s) => { const eu = u + s * Math.sin(a) * L, ez = z - Math.cos(a) * L; return disc(u, z, r0).concat(disc(eu, ez, r1)); };
const ARM = [9, 70, 30, 4, 5.5], LEG = [7, 45, 34, 4.5, 6];
const A0 = 55, L0 = 22, AUP = 105, LUP = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [W(-40, -22), W(40, -22), W(-40, 132), W(40, 132), W(0, -22, -TH)], 200, 160);
  const P = proj(C);
  const plate = (pts) => { const s = []; for (const [u, z] of pts) { s.push(P(...W(u, z, 0))); s.push(P(...W(u, z, -TH))); } return poly(hull(s)); };
  const g = mk("g", {}, svg);
  const top = mk("path", { class: "nf lo", d: poly(disc(0, 127, 5, 16).map(([u, z]) => P(...W(u, z)))) }, g);
  const str = mk("path", { class: "nf lo" }, g);
  const limbs = [0, 1, 2, 3].map(() => mk("path", { class: "sil" }, g));
  // body, head and hat, fixed
  const body = []; for (const [u, z] of [[-8, 42], [8, 42], [-9, 70], [9, 70]]) body.push(...disc(u, z, 5));
  mk("path", { class: "sil", d: plate(body) }, g);
  mk("path", { class: "lo nf", d: open([P(...W(-11, 58)), P(...W(11, 58))]) }, g);
  mk("path", { class: "sil", d: plate(disc(0, 86, 11, 24)) }, g);
  mk("path", { class: "sil", d: plate([[-10, 95], [10, 95], [0, 119]].flatMap(([u, z]) => disc(u, z, 2, 8))) }, g);
  const pom = mk("path", { class: "nf", d: plate(disc(0, 121, 3, 12)) }, g);
  const bead = mk("path", { class: "sil hi" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    const key = v * 10 + amp;
    if (key === last) return;
    last = key;
    const aa = rad(lerp(A0, A0 + AUP * amp, v)), la = rad(lerp(L0, L0 + LUP * amp, v));
    limbs[0].setAttribute("d", plate(limb(-ARM[0], ARM[1], aa, ARM[2], ARM[3], ARM[4], -1)));
    limbs[1].setAttribute("d", plate(limb(ARM[0], ARM[1], aa, ARM[2], ARM[3], ARM[4], 1)));
    limbs[2].setAttribute("d", plate(limb(-LEG[0], LEG[1], la, LEG[2], LEG[3], LEG[4], -1)));
    limbs[3].setAttribute("d", plate(limb(LEG[0], LEG[1], la, LEG[2], LEG[3], LEG[4], 1)));
    const bz = -2 - 16 * v * amp;
    str.setAttribute("d", open([P(...W(-ARM[0] + 2, ARM[1] - 2, -TH)), P(...W(0, 30, -TH)), P(...W(ARM[0] - 2, ARM[1] - 2, -TH))]) + open([P(...W(0, 30, -TH)), P(...W(0, bz + 4, -TH))]).replace("M", " M"));
    bead.setAttribute("d", plate(disc(0, bz, 4.5, 16)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const lo = P(...W(-34, -4)), hi = P(...W(34, 130));
  const hit = ([sx, sy]) => sx > lo[0] - 8 && sx < hi[0] + 8 && sy > hi[1] - 8 && sy < lo[1] + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "pull" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v / 100, 0, 1); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "jumpingjack",
  means: "A jumping jack toy: the pointer pulls its string and the clown's arms and legs fling up and out.",
  rules: [1, 5, 6, 8],
  range: [30, 80, 100],
  tour: [[200, 105], [228, 175], [176, 225], null],
  mount,
});
