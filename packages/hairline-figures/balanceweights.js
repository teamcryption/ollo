/**
 * Weight set: a fitted box of five calibration weights, each a cylinder with
 * a knob, standing in a row, and a lid hinged along the back edge. The
 * pointer's x swings the lid on a spring, from standing open to closing down
 * over the weights. At rest the lid stands open, bright. The slider is how
 * far down it can close.
 *
 * The pattern: one part answering a continuous input (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const L = 66, D = 30, H = 14, T = 3, REST = 104;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const area = (p) => { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lo = value;
  const C = Cam(45, 0.5, 2.55);
  const lp = (x, t, w, a) => [x, t * Math.cos(rad(a)) - w * Math.sin(rad(a)), H + t * Math.sin(rad(a)) + w * Math.cos(rad(a))];
  const fp = [[0, 0, 0], [L, D, 0], [0, D, 0], [L, 0, 0]];
  for (const a of [0, 60, 120]) fp.push(lp(0, D, T, a), lp(L, D, T, a));
  fit(C, fp, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the box and its fitted well
  const boxG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, L, D, 3, 1.5);
  put(solid(boxG), prism(P, front, br, bi, 0, H));
  // the weights, largest first
  let x = 4;
  [[7, 12], [6, 10], [5, 8.5], [4, 7], [3, 6]].forEach(([r, h]) => {
    x += r;
    const y = D / 2, z1 = H - 2 + h;
    put(solid(boxG), prism(P, front, disc(x, y, r), disc(x, y, r - 1), H - 2, z1));
    put(solid(boxG), prism(P, front, disc(x, y, r * 0.3, 16), disc(x, y, r * 0.3 - 0.3, 16), z1, z1 + 1.8));
    put(solid(boxG), prism(P, front, disc(x, y, r * 0.55, 20), disc(x, y, r * 0.55 - 0.5, 20), z1 + 1.8, z1 + 4));
    x += r + 2.5;
  });

  // the lid: a plate turning about the back edge
  const ring = rrect(0, 0, L, D, 3, 4), inner = rrect(1.5, 1.5, L - 1.5, D - 1.5, 1.5, 4);
  const lid = mk("g", {}, g);
  const lsil = mk("path", { class: "sil hi" }, lid), lcr = mk("path", { class: "nf lo" }, lid);
  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const at = (rg, w) => rg.map((q) => P(...lp(q.u, q.v, w, a)));
    lsil.setAttribute("d", poly(hull(at(ring, 0).concat(at(ring, T)))));
    const top = at(inner, T), under = at(inner, 0);
    const shut = inner.map((q) => P(...lp(q.u, q.v, T, 0)));
    lcr.setAttribute("d", poly(area(top) * area(shut) > 0 ? top : under));
    if (a > 92) g.insertBefore(lid, boxG); else g.append(lid);
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    draw(th.x);
    return moving;
  });
  bag.add(B.unregister);

  const cx = P(L / 2, D / 2, H)[0];
  function aim(t, label) {
    th.t = t;
    read.textContent = label ? Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(lo, 118, clamp((sx - cx + 80) / 160, 0, 1)), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lo = v; }, destroy: bag.dispose };
}

hairline({
  name: "balanceweights",
  means: "A box of calibration weights: its hinged lid swings down over the weights as the pointer moves left, and stands open again when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 12, 40],
  tour: [[116, 178], [250, 190], [160, 210], null],
  mount,
});
