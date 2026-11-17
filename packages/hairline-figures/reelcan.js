/**
 * Reel can: a round film can with a reel of film inside. The pointer opens
 * the lid on its hinge at the back, further the further right it stands. At
 * rest the lid stands open, bright. The slider is how far the lid can open.
 *
 * The pattern: one part swinging on a hinge (spring).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const R = 62, H = 16, T = 3, REST = 78;
const disc = (r, n = 48) => circ(r, n);
const rot = (v, a, t) => { const c = Math.cos(t), s = Math.sin(t), d = a[0] * v[0] + a[1] * v[1] + a[2] * v[2]; const x = [a[1] * v[2] - a[2] * v[1], a[2] * v[0] - a[0] * v[2], a[0] * v[1] - a[1] * v[0]]; return v.map((q, i) => q * c + x[i] * s + a[i] * d * (1 - c)); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-R * 1.15, -R * 1.15, H + 2 * R]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(R), disc(R - 2), 0, H));
  mk("path", { d: poly(ringAt(P, disc(R - 7), H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 22), H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(9, 24), H)), class: "nf" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  const s = Math.SQRT1_2, A = [s, -s, 0], hinge = [-R * s, -R * s, H];
  const ring = disc(R + 1), inner = disc(R - 6);
  const at = (q, z, th) => { const v = rot([q.u - hinge[0], q.v - hinge[1], z - hinge[2]], A, th); return P(v[0] + hinge[0], v[1] + hinge[1], v[2] + hinge[2]); };
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    if (ang.x === last) return;
    last = ang.x;
    const th = rad(ang.x), pts = [];
    for (const q of ring) pts.push(at(q, H, th), at(q, H + T, th));
    lid.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(inner.map((q) => at(q, H + T, th))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    ang.t = t;
    read.textContent = t === REST ? "rest" : Math.round(t) + "°";
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, { move: ([sx]) => aim(8 + clamp((sx - 60) / 280, 0, 1) * (max - 8)), leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "reelcan",
  means: "A round film can with a reel inside: the pointer swings the lid open on its back hinge, wider the further right it stands.",
  rules: [3, 5, 6, 8],
  range: [60, 95, 110],
  tour: [[200, 210], [118, 241], [282, 241], null],
  mount,
});
