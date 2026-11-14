/**
 * Gate latch: a farm gate hung between two posts, a latch bar on the far
 * post. The pointer stands on the ground behind the gate and the gate
 * swings back round its hinge into the paddock toward it, on a spring. At rest the gate
 * hangs a little ajar and the latch is bright. The slider is how wide the
 * gate may swing.
 *
 * The pattern: one part turning toward the pointer (officechairs).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 92, Z0 = 6, Z1 = 40, PH = 48, REST = 16;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = 40 + value / 2;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-30, -12, 0], [L + 14, -12, 0], [-12, -L - 8, 0], [L + 14, 14, 0], [0, 0, PH + 3], [L * 0.7, -L * 0.7, Z1], [-30, 0, 30]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-30, -12, L + 14, 16, 6, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 2));
  const gate = mk("g", {}, g);
  const plate = mk("path", { class: "sil" }, gate), inner = mk("path", { class: "nf lo" }, gate);
  // a stub of fence running off behind the hinge post
  mk("path", { d: seg(P(-30, 0, 22), P(-3, 0, 22)) + seg(P(-30, 0, 34), P(-3, 0, 34)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(-24, 0, 3), disc(-24, 0, 1.6), 2, 38));
  put(solid(g), prism(P, front, disc(0, 0, 4.2), disc(0, 0, 2.4), 2, PH));
  put(solid(g), prism(P, front, disc(L + 6, 0, 4.2), disc(L + 6, 0, 2.4), 2, PH - 2));
  // the latch: a short bar on the far post, the rest mark
  const latch = solid(g);
  const [lr, li] = rings(L - 1, -1.4, L + 3, 1.4, 1, 0.5);
  put(latch, prism(P, front, lr, li, 27, 30));
  latch.sil.classList.add("hi");

  const ang = spring(REST);
  let last = NaN;
  function W(u, z, t, c, s) { return P(u * c + t * s, -u * s + t * c, z); }
  function draw(a) {
    const r2a = Math.round(a * 10) / 10;
    if (r2a === last) return;
    last = r2a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), pts = [];
    for (const u of [4.5, L - 1.5]) for (const z of [Z0, Z1]) for (const t of [-1, 1]) pts.push(W(u, z, t, c, s));
    plate.setAttribute("d", poly(hull(pts)));
    let d = poly([W(8, Z0 + 3, 0, c, s), W(L - 5, Z0 + 3, 0, c, s), W(L - 5, Z1 - 3, 0, c, s), W(8, Z1 - 3, 0, c, s)]);
    for (const z of [15, 23.5, 31.5]) d += seg(W(8, z, 0, c, s), W(L - 5, z, 0, c, s));
    d += seg(W(8, Z0 + 3, 0, c, s), W(L - 5, Z1 - 3, 0, c, s));
    inner.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  let on = false;
  function move([sx, sy]) {
    const [gx, gy] = unproj(C, sx, sy, 0), dist = Math.hypot(gx, gy);
    const inside = dist < L + 30 && gx > -10 && gy < 20;
    if (inside) {
      const a = clamp(Math.atan2(-gy, gx) * 180 / Math.PI, 0, maxA);
      ang.t = a;
      read.textContent = Math.round(a) + "°";
    }
    setOn(inside);
    B.wake();
  }
  function setOn(v) {
    if (!v) { ang.t = REST; read.textContent = "rest"; }
    if (v === on) return;
    on = v;
    plate.classList.toggle("hi", v);
    latch.sil.classList.toggle("hi", !v);
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { setOn(false); B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = 40 + v / 2; }, destroy: bag.dispose };
}

hairline({
  name: "fencepost",
  means: "A farm gate between two posts: it swings on its hinge to point at the pointer, and settles back ajar with the latch lit.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[265, 231], [260, 174], [248, 131], null],
  mount,
});
