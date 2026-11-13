/**
 * Pillbox: a seven-day pill organizer, one cell a day, each under its own
 * hinged lid with a pull tab. At rest the days already taken sit ajar and
 * empty, today's lid stands open and bright over its pills, and the days to
 * come are shut on theirs. The pointer picks a day: its lid swings open, and the lids
 * beside it lift a little, staggered out from it. The slider is the stagger.
 *
 * The pattern: discrete items (riffle). Tweens per lid, a stagger by distance,
 * and a hit test on the closed lids' plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, poly, prism, proj, rad, rings, ringAt, rrect, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, reflect, register, solid,
} = HL;

const N = 7, CW = 26, D = 30, HB = 16, TK = 1.6, YH = 1.2, DL = D - 2.4, TAB = 3;
const TODAY = 2, OPEN = 100, WAVE = [0, 26, 10];
const REST = [18, 9, 58, 0, 0, 0, 0];
const X1 = N * CW, FLIP = 39; // past FLIP degrees the lid's underside faces the viewer

/** Lid i's outline in its own plane: u along the row, v from the hinge to the tab. */
function lidShape(i) {
  const xa = i * CW + 1.5, xb = (i + 1) * CW - 1.5, xc = (xa + xb) / 2;
  return fillet(
    [[xa, 0], [xb, 0], [xb, DL], [xc + 4, DL], [xc + 4, DL + TAB], [xc - 4, DL + TAB], [xc - 4, DL], [xa, DL]],
    [1.5, 1.5, 2.5, 1, 1.2, 1.2, 1, 2.5],
  );
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // fitted with every lid at its most open, the tab's overhang and the reflection
  const C = Cam(45, 0.5, 1.72);
  const tipY = YH + DL * Math.cos(rad(OPEN)), tipZ = HB + DL * Math.sin(rad(OPEN));
  fit(C, [[0, 0, 0], [X1, D + 2, 0], [X1, 0, 0], [0, D + 2, 0], [0, tipY, tipZ], [X1, tipY, tipZ], [X1, D, -8]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [ring, inner] = rings(0, 0, X1, D, 5, 1.6);
  reflect(svg, g, P, front, ring, 0, 14);
  put(solid(g), prism(P, front, ring, inner, 0, HB));

  const cells = [];
  for (let i = 0; i < N; i++) {
    const xc = (i + 0.5) * CW;
    // the cell's well, a day tick on the front face, then pills and lid in their own groups
    mk("path", { d: poly(ringAt(P, rrect(i * CW + 3.2, 3.2, (i + 1) * CW - 3.2, D - 3.2, 3, 4), HB)), class: "nf lo" }, g);
    place(mk("circle", { r: 1.1, class: "dot off" }, g), P(xc, D, HB * 0.45));
    const pills = mk("g", {}, g);
    if (i > TODAY - 1) for (const [dx, y] of [[-5, 10], [3.5, 14.5], [-1.5, 21]]) place(mk("circle", { r: 2.1, class: "dot" }, pills), P(xc + dx, y, HB - 0.6));
    const lid = mk("g", {}, g);
    const under = mk("path", { class: "lo" }, lid), over = mk("path", { class: "sil" }, lid);
    cells.push({ shape: lidShape(i), pills, lid, under, over, th: tween(REST[i]), last: NaN, flipped: false });
  }

  /** Lid i at th degrees: the face away from the viewer first, the one facing it last and bright-able. */
  function draw(cd, th) {
    const s = Math.sin(rad(th)), c = Math.cos(rad(th));
    const base = (u, v) => P(u, YH + v * c, HB + v * s);
    const top = (u, v) => P(u, YH + v * c - TK * s, HB + v * s + TK * c);
    const flip = th > FLIP;
    const a = poly(cd.shape.map(([u, v]) => (flip ? top : base)(u, v)));
    const b = poly(cd.shape.map(([u, v]) => (flip ? base : top)(u, v)));
    cd.under.setAttribute("d", a); cd.over.setAttribute("d", b);
    // an open lid stands behind its pills; a shut one covers them
    if (flip !== cd.flipped) { cd.flipped = flip; if (flip) cd.pills.after(cd.lid); else cd.lid.after(cd.pills); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const cd of cells) {
      const th = tval(cd.th, now);
      if (th !== cd.last) { draw(cd, th); cd.last = th; }
      if (!tdone(cd.th, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The day under the point, on the shut lids' plane, which never moves; -1 off the box. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HB);
    if (y < -4 || y > D + TAB + 3 || x < 0 || x > X1) return -1;
    return clamp(Math.floor(x / CW), 0, N - 1);
  }

  let act = -1;
  const mark = (a) => cells.forEach((cd, i) => cd.over.classList.toggle("hi", i === (a < 0 ? TODAY : a)));
  /** Opens day a (-1 lets every lid back to rest), staggered out from the day touched or let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cells.forEach((cd, i) => {
      const d = Math.abs(i - a), th = a < 0 ? REST[i] : d === 0 ? OPEN : Math.max(WAVE[d] ?? 0, 0);
      tset(cd.th, th, now, Math.abs(i - from) * stag);
    });
    mark(a);
    read.textContent = a < 0 ? "rest" : "day " + (a + 1);
    B.wake();
  }

  mark(-1);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pillbox",
  means: "A week of pills under seven lids: the day under the pointer opens, and the days beside it lift in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[136, 142], [231, 189], [294, 221], null],
  mount,
});
