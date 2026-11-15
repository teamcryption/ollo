/**
 * Floor safe: a hatch set into a floor slab, its heavy lid hinged on the far
 * edge with a dial on top. The nearer the pointer comes to the hatch, the
 * further the lid swings up on its hinge, showing the well beneath. At rest
 * the lid stands just ajar and the dial is bright. The slider is how far the
 * lid may open.
 *
 * The pattern: one part swinging on a hinge, following the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect,
  disposer, mk, pointer, put, register, solid, spring, stepS, unproj,
} = HL;

const SZ = 8, LX0 = 26, LX1 = 84, LY0 = 22, LY1 = 74, TH = 3.5, REST = 14;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-2, -2, 0], [112, 98, 0], [112, -2, 0], [-2, 98, 0], [LX0, LY0, SZ + 58], [LX1, LY0, SZ + 58]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, 110, 96, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // the recessed frame and the opening
  mk("path", { d: poly(ringAt(P, rrect(LX0 - 4, LY0 - 4, LX1 + 4, LY1 + 4, 5, 4), SZ)), class: "nf lo" }, g);
  const hole = ringAt(P, rrect(LX0 + 2, LY0 + 2, LX1 - 2, LY1 - 2, 2, 4), SZ);
  mk("path", { d: poly(hole), class: "nf" }, g);
  // the well's far walls: their bottom edges, kept inside the opening
  const inside = (q) => {
    let s = 0;
    for (let i = 0; i < hole.length; i++) {
      const a = hole[i], b = hole[(i + 1) % hole.length];
      const c = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
      if (c !== 0) { if (s === 0) s = Math.sign(c); else if (Math.sign(c) !== s) return false; }
    }
    return true;
  };
  const D = SZ + 14, wx = LX0 + 2, wy = LY0 + 2;
  for (const [a, b] of [[[wx, wy], [LX1 - 2, wy]], [[wx, wy], [wx, LY1 - 2]]]) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const q = P(lerp(a[0], b[0], i / 40), lerp(a[1], b[1], i / 40), SZ - D); if (inside(q)) pts.push(q); }
    if (pts.length > 1) mk("path", { d: open(pts), class: "nf lo" }, g);
  }
  mk("path", { d: open([P(wx, wy, SZ), P(wx, wy, SZ - D)].filter(inside)), class: "nf lo" }, g);

  const lid = solid(g), top = mk("path", { class: "nf lo" }, g), dial = mk("path", { class: "nf" }, g), knob = mk("path", { class: "nf" }, g);
  const lring = rrect(LX0, LY0, LX1, LY1, 5, 4), linner = rrect(LX0 + 2, LY0 + 2, LX1 - 2, LY1 - 2, 3, 4);
  const cx = (LX0 + LX1) / 2, cy = (LY0 + LY1) / 2 + 4;
  const ang = spring(REST);
  let last = NaN;
  function W(u, v, h, a) {
    const d = v - LY0, ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    return P(u, LY0 + d * ca - h * sa, SZ + d * sa + h * ca);
  }
  const at = (ring, h, a) => ring.map((q) => W(q.u, q.v, h, a));
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    lid.sil.setAttribute("d", poly(hull(at(lring, 0, a).concat(at(lring, TH, a)))));
    const up = a < 62;
    top.setAttribute("d", up ? poly(at(linner, TH, a)) : "");
    dial.setAttribute("d", up ? poly(at(disc(cx, cy, 8), TH, a)) : "");
    knob.setAttribute("d", up ? poly(hull(at(disc(cx, cy, 3, 16), TH, a).concat(at(disc(cx, cy, 3, 16), TH + 3, a)))) : "");
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let t = REST, hot = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], SZ);
      const d = Math.hypot(x - cx, y - (LY0 + LY1) / 2);
      if (d < 95) { hot = true; t = lerp(maxA, REST + 6, clamp((d - 18) / 77, 0, 1)); }
    }
    ang.t = t;
    if (hot !== on) {
      on = hot;
      lid.sil.classList.toggle("hi", hot);
      dial.classList.toggle("hi", !hot);
    }
    read.textContent = hot ? Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "wallsafe",
  means: "A floor safe set in a slab: the nearer the pointer, the further the hinged lid swings open over the well.",
  rules: [3, 4, 5, 8],
  range: [60, 100, 112],
  tour: [[255, 170], [197, 192], [212, 264], null],
  mount,
});
