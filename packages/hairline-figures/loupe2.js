/**
 * Watch stand: a watchmaker's movement holder, a round cushion foot, a yoke
 * of two uprights, and between them a ring clamp holding a movement with its
 * balance wheel. The pointer's place across the bench tilts the ring on its
 * pins, on a spring, toward it. At rest the ring leans back a little and the
 * balance wheel is bright. The slider is how far it may tilt.
 *
 * The pattern: one part answering on a spring (tilt).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZP = 46, MAX = rad(58), REST = rad(-14), RR = 30;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (x, y, dz, f) => [x * Math.cos(f) - dz * Math.sin(f), y, ZP + x * Math.sin(f) + dz * Math.cos(f)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-36, -44, 0], [36, 44, 0], [36, -44, 0], [-36, 44, 0], [0, 0, ZP + RR + 4], [-RR, 0, ZP], [RR, 0, ZP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 40, 48), disc(0, 0, 37, 48), 0, 8));
  const post = (y) => { const [a, b] = rings(-5, y - 4, 5, y + 4, 3, 1); put(solid(g), prism(P, front, a, b, 8, ZP + 4)); };
  post(-38);
  const ring = solid(g), plate = mk("path", { class: "nf lo" }, ring.g), wheel = mk("path", { class: "nf hi" }, ring.g), arms = mk("path", { class: "nf lo" }, ring.g), jew = mk("path", { class: "nf lo" }, ring.g);
  post(38);

  // the ring lies flat before its tilt about the pin axis (y)
  const circW = (cx, cy, r, h, f, n = 40) => circ(r, n).map((q) => P(...rot(cx + q.u, cy + q.v, h, f)));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    ring.sil.setAttribute("d", poly(hull(circW(0, 0, RR, -3, f).concat(circW(0, 0, RR, 3, f)))));
    ring.cr.setAttribute("d", poly(circW(0, 0, RR - 3, 3, f)));
    plate.setAttribute("d", poly(circW(0, 0, RR - 6, 3.5, f)));
    wheel.setAttribute("d", poly(circW(8, -6, 9, 4.5, f, 28)));
    arms.setAttribute("d", "M" + circW(8, -6, 0.01, 4.5, f, 4)[0].join(",") + "L" + P(...rot(8, 3, 4.5, f)).join(",") + "M" + P(...rot(-1, -6, 4.5, f)).join(",") + "L" + P(...rot(17, -6, 4.5, f)).join(","));
    jew.setAttribute("d", poly(circW(-12, 8, 4, 4.5, f, 16)) + poly(circW(-4, 14, 3, 4.5, f, 14)));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(x) > 110 || Math.abs(y) > 110) return leave();
    sp.t = clamp(x / 45, -1, 1) * MAX * clamp(gain, 0, 1);
    read.textContent = Math.round(sp.t * 180 / Math.PI) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "loupe2",
  means: "A watch movement holder: the ring clamp tilts on its pins toward the pointer, showing the movement and its balance wheel.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[306, 270], [94, 164], [250, 230], null],
  mount,
});
