/**
 * Compact: a round powder compact, its lid hinged at the back. The pointer's
 * height over the figure opens the lid on a spring: up swings it upright to
 * show the mirror, down closes it on the powder pan. At rest it stands ajar,
 * the lid's edge bright. The slider is the widest opening.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 34, H = 9, T = 3, REST = 32;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R, H + 2 * R + 4], [R, -R, H + 2 * R]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g), baseG = mk("g", {}, g);
  put(solid(baseG), prism(P, front, disc(R), disc(R - 2), 0, H));
  mk("path", { d: poly(ringAt(P, disc(R - 5), H)), class: "nf lo" }, baseG);
  const pan = mk("path", { d: poly(ringAt(P, disc(R - 9), H - 1)), class: "nf" }, baseG);
  const puff = mk("path", { d: poly(hull(ringAt(P, circ(11, 24).map((q) => ({ ...q, u: q.u + 4, v: q.v + 6 })), H - 1).concat(ringAt(P, circ(10, 24).map((q) => ({ ...q, u: q.u + 4, v: q.v + 6 })), H + 2)))), class: "nf lo" }, baseG);
  const lid = mk("path", { class: "sil" }, lidG), face = mk("path", { class: "nf lo" }, lidG), clasp = mk("path", { class: "nf" }, lidG);

  // a lid point: ring sample (u, v) rotated by a about the hinge at y = -R, z = H
  const L = (u, v, w, a) => {
    const d = v + R, s = Math.sin(a), c = Math.cos(a);
    return P(u, -R + d * c - w * s, H + d * s + w * c);
  };
  const ring = disc(R), inner = disc(R - 5);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const q of ring) { pts.push(L(q.u, q.v, 0, a), L(q.u, q.v, T, a)); }
    lid.setAttribute("d", poly(hull(pts)));
    const showInner = 0.61 * Math.sin(a) - 0.5 * Math.cos(a) > 0;
    face.setAttribute("d", poly(inner.map((q) => L(q.u, q.v, showInner ? 0 : T, a))));
    clasp.setAttribute("d", poly(hull([[-4, R - 1], [4, R - 1], [4, R + 2], [-4, R + 2]].flatMap(([u, v]) => [L(u, v, 0, a), L(u, v, T, a)]))));
    if (deg > 48) g.insertBefore(lidG, baseG); else g.insertBefore(baseG, lidG);
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const top = P(0, 0, H)[1];
  function aim(p) {
    if (!p) { sp.t = REST; lid.classList.add("hi"); read.textContent = "rest"; B.wake(); return; }
    const f = clamp((top + 20 - p[1]) / 150, 0, 1);
    sp.t = f * maxA;
    lid.classList.add("hi");
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "compact",
  means: "A round powder compact: the pointer's height swings its hinged lid open to the mirror, or closes it on the pan.",
  rules: [3, 5, 6, 8],
  range: [60, 100, 110],
  tour: [[200, 104], [179, 242], [303, 144], null],
  mount,
});
