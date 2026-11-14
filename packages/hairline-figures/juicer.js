/**
 * Juicer: a citrus press, a round cup with a ribbed cone on a base and a
 * lever arm hinged on a post at the back. The pointer presses: the lower it
 * stands over the press, the further the arm swings down onto the cone, on a
 * spring. At rest the arm stands raised, bright. The slider is how far the
 * arm comes down.
 *
 * The pattern: one part following the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 32, CY = 44, HZ = 52, REST = 42;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let low = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [64, 78, 0], [64, 0, 0], [0, 78, 0], [10, 6, HZ + 50], [54, 6, HZ + 50]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(CX - 7, 0, CX + 7, 12, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, HZ + 2));
  put(solid(g), prism(P, front, disc(CX, CY, 32), disc(CX, CY, 30), 0, 8));
  put(solid(g), prism(P, front, disc(CX, CY, 24), disc(CX, CY, 21.5), 8, 24));
  // the cone, with ribs from its tip down
  const cone = mk("g", {}, g);
  mk("path", { d: poly(hull(disc(CX, CY, 15, 32).map((q) => P(q.u, q.v, 24)).concat([P(CX, CY, 38)]))) }, cone);
  let rib = "";
  for (let k = 0; k < 5; k++) { const t = rad(20 + k * 25); rib += seg(P(CX, CY, 37), P(CX + 14 * Math.cos(t), CY + 14 * Math.sin(t), 24.5)); }
  mk("path", { d: rib, class: "nf lo" }, cone);
  // the arm: a plate turning on the hinge at the post's top
  const arm = mk("g", {}, g);
  const asil = mk("path", { class: "sil hi" }, arm), acr = mk("path", { class: "nf lo" }, arm), cap = mk("path", {}, arm);
  const plate = rrect(CX - 18, 0, CX + 18, 70, 12, 4), inner = rrect(CX - 15, 3, CX + 15, 67, 9, 4);
  const capR = disc(CX, CY - 6, 16, 32);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const L = (u, v, w) => P(u, 6 + v * c - w * s, HZ + v * s + w * c);
    const at = (ring, w) => ring.map((q) => L(q.u, q.v, w));
    cap.setAttribute("d", poly(hull(at(capR, -9).concat(at(capR, 0)))));
    asil.setAttribute("d", poly(hull(at(plate, 0).concat(at(plate, 5)))));
    acr.setAttribute("d", poly(at(inner, 5)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const mid = P(CX, CY, 30)[1];
  function move([, sy]) {
    const t = clamp((sy - mid + 50) / 120, 0, 1);
    ang.t = lerp(REST - 4, low, t);
    read.textContent = Math.round(((REST - ang.t) / (REST - low)) * 100) + "%";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { low = v; }, destroy: bag.dispose };
}

hairline({
  name: "juicer",
  means: "A citrus press: the lower the pointer stands over it, the further the lever arm swings down onto the ribbed cone.",
  rules: [3, 5, 6, 8],
  range: [-4, 2, 10],
  tour: [[200, 120], [200, 200], [200, 260], null],
  mount,
});
