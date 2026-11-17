/**
 * Studio monitor: a two-way speaker cabinet hung in a yoke on a desk stand,
 * woofer and tweeter on its front. The pointer is where the listener's ears
 * are: the cabinet pitches on its side bolts to aim at them, down when the
 * pointer is in front, back when it is behind. At rest it leans back a
 * little and its woofer is bright. The slider is how far it may tilt.
 *
 * The pattern: a continuous aim (spotlights' spring, on one angle); the hit
 * is on a fixed plane at the bolts' height, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, rrect, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PIV = 54, HW = 14, HD = 12, HH = 21, YX = 17, MAX = rad(28), REST = -0.16;
const AZ = rad(45), KK = 0.5, V = [Math.sin(AZ), Math.cos(AZ), KK / Math.sqrt(1 - KK * KK)];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-20, -16, 0], [20, 16, 0], [20, -16, 0], [-20, 16, 0], [HW, HD + 12, PIV + HH + 4], [-HW, -HD - 12, PIV + HH + 4], [HW, HD + 14, PIV - HH], [-HW, -HD - 14, PIV - HH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-20, -16, 20, 16, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  put(solid(g), prism(P, front, circ(3, 20), circ(2, 20), 3, PIV - HH - 8));
  const [yr, yi] = rings(-YX - 1.5, -2, YX + 1.5, 2, 1.5, 0.6);
  put(solid(g), prism(P, front, yr, yi, PIV - HH - 8, PIV - HH - 5));
  mk("path", { class: "nf sil", d: seg(P(-YX, 0, PIV - HH - 5), P(-YX, 0, PIV)) }, g);
  const box = mk("path", { class: "sil" }, g), crease = mk("path", { class: "nf lo" }, g);
  const woof = mk("path", { class: "nf" }, g), cone = mk("path", { class: "nf lo" }, g), tweet = mk("path", { class: "nf" }, g);
  mk("path", { class: "nf sil", d: seg(P(YX, 0, PIV - HH - 5), P(YX, 0, PIV)) }, g);
  const bolt = mk("path", { class: "nf" }, g);
  const ring = rrect(-HW, -HD, HW, HD, 4, 4), inner = rrect(-HW + 1.6, -HD + 1.6, HW - 1.6, HD - 1.6, 2.4, 4);
  const th = spring(REST);
  let last = NaN, over = null;

  function draw() {
    const t = th.x;
    if (t === last) return;
    last = t;
    const c = Math.cos(t), s = Math.sin(t);
    // pitch about x: +z leans toward +y by t
    const rot = (p) => [p[0], p[1] * c + p[2] * s, -p[1] * s + p[2] * c];
    const at = (u, v, w) => { const q = rot([u, v, w]); return P(q[0], q[1], PIV + q[2]); };
    const faces = (q) => dot(rot([q.nu, q.nv, 0]), V) > 0;
    const top = dot(rot([0, 0, 1]), V) > 0 ? HH : -HH;
    box.setAttribute("d", poly(hull(ring.map((q) => at(q.u, q.v, -HH)).concat(ring.map((q) => at(q.u, q.v, HH))))));
    crease.setAttribute("d", open(run(inner, faces).map((q) => at(q.u, q.v, top))));
    const disc = (r, w, n) => poly(circ(r, n).map((q) => at(q.u, HD + 0.2, w + q.v)));
    woof.setAttribute("d", disc(10, -6, 40));
    cone.setAttribute("d", disc(5.5, -6, 32) + disc(2, -6, 16));
    tweet.setAttribute("d", disc(4.2, 12, 28));
    bolt.setAttribute("d", poly(circ(1.8, 12).map((q) => P(YX + 0.5, q.u, PIV + q.v))));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    th.t = over ? clamp(over[1] / 40, -1, 1) * MAX * reach : REST;
    woof.setAttribute("class", over ? "nf" : "nf hi");
    box.setAttribute("class", over ? "sil hi" : "sil");
    read.textContent = over ? `pitch ${Math.round((-th.t * 180) / Math.PI)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], PIV); over = Math.hypot(x, y) > 95 ? null : [x, y]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "reelmic",
  means: "A studio monitor in a yoke on a desk stand: the cabinet pitches on its bolts to aim at the pointer, down in front, up behind.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.4],
  tour: [[133, 139], [200, 55], [155, 188], null],
  mount,
});
