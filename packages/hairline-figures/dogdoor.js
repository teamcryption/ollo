/**
 * Dog door: a garden wall on a ground plate with a low opening and a flap
 * hung from its top edge. The flap swings toward whichever side of the wall
 * the pointer stands on, further the further out it is. At rest it hangs
 * pushed a little way in, bright. The slider is the widest swing.
 *
 * The pattern: one part turning toward the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -22, Y0 = 0, Y1 = 110, HY0 = 25, HY1 = 85, H = 88, SILL = 6, TOP = 68, L = 61, T = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-64, Y0 - 6, 0], [64, Y1 + 6, 0], [-64, Y1 + 6, 0], [64, Y0 - 6, 0], [0, Y0, H], [0, Y1, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-50, Y0 - 10, 50, Y1 + 10, 8, 2);
  put(solid(g), prism(P, front, gr, gi, -4, 0));

  const flapBack = mk("g", {}, g);
  const block = (y0, y1, z0, z1) => { const [r, i] = rings(-T, y0, T, y1, 1, 0.6); put(solid(g), prism(P, front, r, i, z0, z1)); };
  block(Y0, HY0, 0, H);
  block(HY0, HY1, 0, SILL);
  block(HY0, HY1, TOP, H);
  block(HY1, Y1, 0, H);
  const flapFront = mk("g", {}, g);

  const flap = mk("g", {}, flapBack);
  const sil = mk("path", { class: "sil" }, flap), face = mk("path", { class: "nf lo" }, flap);
  const pad = mk("path", { class: "nf" }, flap);
  const ang = spring(REST);
  let last = NaN, side = 0;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (y, d, n) => P(d * s + n * c, y, TOP - d * c + n * s);
    const ya = HY0 + 1.5, yb = HY1 - 1.5, pts = [];
    for (const y of [ya, yb]) for (const d of [0, L]) for (const n of [-1.2, 1.2]) pts.push(at(y, d, n));
    sil.setAttribute("d", poly(hull(pts)));
    const n = a >= 0 ? 1.2 : -1.2;
    face.setAttribute("d", poly([at(ya + 4, 6, n), at(yb - 4, 6, n), at(yb - 4, L - 6, n), at(ya + 4, L - 6, n)]));
    pad.setAttribute("d", poly([at(ya + 12, L - 14, n), at(yb - 12, L - 14, n), at(yb - 12, L - 9, n), at(ya + 12, L - 9, n)]));
    const s2 = a >= 0 ? 1 : -1;
    if (s2 !== side) { side = s2; (s2 > 0 ? flapFront : flapBack).appendChild(flap); }
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null;
  function aim(p) {
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wy > Y0 - 30 && wy < Y1 + 30) a = clamp(wx / 34, -1, 1) * maxA;
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    sil.classList.add("hi");
    read.textContent = !p ? "rest" : a >= 0 ? "out " + a + "°" : "in " + -a + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (tgt !== null && tgt !== REST) { ang.t = clamp(ang.t, -v, v); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dogdoor",
  means: "A flap hung in a garden wall: it swings toward the side the pointer stands on, further the further out.",
  rules: [1, 3, 5, 6],
  range: [30, 70, 85],
  tour: [[256, 238], [144, 182], [324, 204], null],
  mount,
});
