/**
 * Tagine: one clay tagine, a wide shallow dish with a tall conical lid and a
 * knob on its tip. At rest the lid sits just ajar, bright. The pointer over
 * the pot lifts the lid clear of the dish to show the stew mounded under it.
 * The slider is how high the lid lifts.
 *
 * The pattern: one part answers (cloche).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DR = 34, LR = 27, LH = 46, REST = 3;
const disc = (r, n = 44) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-DR, -DR, 0], [DR, DR, 0], [DR, -DR, 0], [-DR, DR, 0], [0, 0, 8 + 34 + LH + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the dish: a wide low plate with a raised rim
  put(solid(g), prism(P, front, disc(DR), disc(DR - 3), 0, 7));
  // the stew mounded in the dish
  const mound = [];
  for (const [r, z] of [[20, 0], [17, 4], [12, 8], [6, 10.5], [2, 11.5]]) mound.push(...ringAt(P, disc(r, 22), 7 + z));
  mk("path", { d: poly(hull(mound)), class: "nf" }, g);
  const lid = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const z = tween(REST);
  let last = NaN;

  function draw(h) {
    if (h === last) return;
    last = h;
    const base = 7.2 + h, pts = [];
    // a cone whose sides curve in a little toward the tip
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(...ringAt(P, disc(LR * (1 - t) * (1 - 0.25 * t * (1 - t)) + 3 * t, 28), base + LH * t)); }
    lid.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAt(P, disc(LR - 1.5, 44), base + 2)));
    const top = base + LH;
    knob.setAttribute("d", poly(hull(ringAt(P, disc(4.5, 16), top).concat(ringAt(P, disc(4.5, 16), top + 4), ringAt(P, disc(2, 12), top + 7)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 25);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? lift : REST, performance.now(), 0);
    read.textContent = a ? "lid up" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 0.8) < 95), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "tagine",
  means: "A clay tagine with a tall conical lid: the pointer over the pot lifts the lid clear to show the stew under it.",
  rules: [1, 4, 5, 8],
  range: [14, 26, 34],
  tour: [[200, 154], [200, 110], [170, 190], null],
  mount,
});
