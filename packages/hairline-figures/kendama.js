/**
 * Kendama: one kendama held upright, a handle with a cross-piece of two
 * cups, a spike on top and a ball on a string. The pointer over the toy
 * swings the ball up and over in an arc until it lands on the spike. At
 * rest the ball hangs out to one side, bright. The slider is how far the
 * ball swings.
 *
 * The pattern: one object, one gesture (tween on hover).
 */
const {
  Cam, fit, hull, open, poly, proj, tdone, tset, tval, tween, clamp, lerp, rad,
  disposer, mk, pointer, register,
} = HL;

const K = Math.SQRT1_2, TH = 4;
// local (u across the face, z up, d toward the viewer) to world
const W = (u, z, d = 0) => [u * K + d * K, -u * K + d * K, z];
const ell = (u, z, ru, rz, n = 16) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push([u + Math.cos(a) * ru, z + Math.sin(a) * rz]); } return o; };
const PV = [0, 60], L = 31, BR = 10, A0 = 62, SWING = 118;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [W(-26, 0), W(44, 0), W(-26, 102), W(44, 102), W(0, 0, -TH)], 200, 162);
  const P = proj(C);
  const plate = (pts, d0 = 0) => { const s = []; for (const [u, z] of pts) { s.push(P(...W(u, z, d0))); s.push(P(...W(u, z, d0 - TH))); } return poly(hull(s)); };
  const g = mk("g", {}, svg);
  // the ken: handle with its bottom cup, cross-piece with two cups, spike
  mk("path", { class: "sil", d: plate([...ell(0, 6, 9, 3), ...ell(0, 12, 4, 2)]) }, g);
  mk("path", { class: "sil", d: plate([...ell(0, 13, 3.6, 1, 8), ...ell(0, 56, 4.4, 1, 8)]) }, g);
  mk("path", { class: "sil", d: plate([...ell(-14, 61, 4, 4), ...ell(-23, 61, 2.5, 10)]) }, g);
  mk("path", { class: "sil", d: plate([...ell(14, 61, 4, 4), ...ell(21, 61, 2, 7.5)]) }, g);
  mk("path", { class: "sil", d: plate([...ell(-14, 61, 5, 5), ...ell(14, 61, 5, 5)]) }, g);
  mk("path", { class: "lo nf", d: open([P(...W(-23, 52)), P(...W(-23, 70))]) + " " + open([P(...W(21, 54.5)), P(...W(21, 67.5))]) }, g);
  mk("path", { class: "sil", d: plate([...ell(0, 66, 3.6, 1, 8), [0, 80]]) }, g);
  const str = mk("path", { class: "nf lo" }, g);
  const ball = mk("path", { class: "sil hi" }, g), hole = mk("path", { class: "nf lo" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    const key = v * 10 + amp;
    if (key === last) return;
    last = key;
    const a = rad(lerp(A0, A0 + SWING * amp, v));
    const bu = PV[0] + Math.sin(a) * L, bz = PV[1] - Math.cos(a) * L;
    const sag = (1 - v) * 4;
    str.setAttribute("d", open([P(...W(0, 50, 1)), P(...W(bu * 0.5 + sag, (50 + bz) / 2 - sag, 1)), P(...W(bu, bz, 1))]));
    ball.setAttribute("d", plate(ell(bu, bz, BR, BR, 28), TH + 1));
    const hu = bu - Math.sin(a) * 6, hz = bz + Math.cos(a) * 6;
    hole.setAttribute("d", poly(ell(hu, hz, 2.6, 2.6, 12).map(([u, z]) => P(...W(u, z, TH + 1)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const lo = P(...W(-26, 0)), hi = P(...W(44, 102));
  const hit = ([sx, sy]) => sx > lo[0] - 8 && sx < hi[0] + 8 && sy > hi[1] - 8 && sy < lo[1] + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "swing" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v / 100, 0, 1); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "kendama",
  means: "A kendama held upright: the pointer swings its ball up and over on the string until it lands on the spike.",
  rules: [1, 5, 6, 8],
  range: [30, 100, 100],
  tour: [[250, 180], [200, 140], [175, 188], null],
  mount,
});
