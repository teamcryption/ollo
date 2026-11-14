/**
 * Furnace: a foundry ladle hung between two posts on its trunnions, over a
 * floor plate with a mould beside it. The pointer's reach to the right tips
 * the ladle on its pivot; past the pour angle a stream falls from the lip
 * into the mould and takes the bright. At rest the ladle leans a little,
 * bright. The slider is the farthest tilt.
 *
 * The pattern: one part tilting on a pivot (spring).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 20, H = 34, PIV = 22, PZ = 50, PY = 30, REST = 12, POUR = 38;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-40, -40, 0], [46, 40, 0], [46, -40, 0], [-40, 40, 0], [0, 0, PZ + 14], [-20, 0, PZ + 14]], 200, 172);
  const P = proj(C), front = facing(C);
  // a point on the ladle: local u across, w up from its base; tilted by a about the pivot
  const L = (u, v, w, a) => { const wr = w - PIV, c = Math.cos(a), s = Math.sin(a); return P(u * c + wr * s, v, PZ + wr * c - u * s); };
  const ring = (r, w, a, n = 32) => circ(r, n).map((q) => L(q.u, q.v, w, a));

  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-40, -40, 46, 40, 8, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const post = (y) => { const [a, b] = rings(-5, y - 4, 5, y + 4, 3, 1.2); put(solid(g), prism(P, front, a, b, 3, PZ + 4)); };
  post(-PY);
  // the mould: a low block with a sprue cup
  const [mr, mi] = rings(14, -12, 40, 12, 3, 1.5);
  put(solid(g), prism(P, front, mr, mi, 3, 13));
  mk("path", { d: poly(ringAt(P, disc(26, 0, 4, 20), 13)), class: "nf lo" }, g);
  const body = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf lo" }, g), band = mk("path", { class: "nf lo" }, g);
  const pin = mk("path", { class: "nf" }, g);
  const stream = mk("path", { class: "nf" }, g);
  post(PY);

  const sp = spring(rad(REST));
  let last = NaN, pouring = false;
  function draw(a) {
    if (a === last) return;
    last = a;
    body.setAttribute("d", poly(hull(ring(R - 3, 0, a).concat(ring(R, H, a)))));
    mouth.setAttribute("d", poly(ring(R - 1.5, H, a, 40)));
    band.setAttribute("d", open(ring(R - 0.6, PIV - 3, a, 40).filter((_, i) => i <= 8 || i >= 32)));
    pin.setAttribute("d", poly(hull(circ(3, 12).map((q) => L(q.u, PY - 4, PIV + q.v, a)).concat(circ(3, 12).map((q) => L(q.u, R - 1, PIV + q.v, a))))));
    const lip = L(R, 0, H, a);
    const on = a > rad(POUR);
    stream.setAttribute("d", on ? seg(lip, P(26, 0, 13)) + seg([lip[0] + 2, lip[1]], P(27.5, 0, 13)) : "");
    if (on !== pouring) { pouring = on; stream.classList.toggle("hi", on); body.classList.toggle("hi", !on); }
    read.textContent = Math.round(a * 180 / Math.PI) + "°" + (on ? " pour" : "");
  }
  body.classList.add("hi");
  draw(sp.x);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const cx = P(0, 0, PZ)[0];
  let here = false;
  function aim([sx]) { here = true; sp.t = rad(clamp((sx - cx + 40) / 130, 0, 1) * maxT); B.wake(); }
  function leave() { here = false; sp.t = rad(REST); B.wake(); }
  draw(sp.x);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; if (here) B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "furnace",
  means: "A foundry ladle on its trunnions: the pointer tips it toward the mould, and past the pour angle a stream runs from the lip.",
  rules: [3, 4, 5, 8],
  range: [30, 60, 70],
  tour: [[150, 160], [250, 170], [320, 190], null],
  mount,
});
