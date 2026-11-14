/**
 * Bedside table: a small cabinet with a lamp on top and one drawer. The
 * pointer draws the drawer out toward it: the nearer the pointer comes on
 * the floor in front, the further it slides. At rest the drawer stands a
 * little open and the lamp's shade is bright. The slider is the furthest pull.
 *
 * The pattern: one part following the pointer (slide).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 36, D = 30, H = 50, REST = 5;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxO = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, D + 26, 0], [W, 0, 0], [0, D + 26, 0], [W / 2, D / 2, H + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const [x, y] of [[4, 4], [W - 4, 4], [4, D - 4], [W - 4, D - 4]]) put(solid(g), prism(P, front, disc(x, y, 1.8, 12), disc(x, y, 1, 12), 0, 6));
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 6, H));
  mk("path", { d: seg(P(3, D, 28), P(W - 3, D, 28)), class: "nf lo" }, g);

  // the lamp: a round foot, a stem, a drum shade
  const lx = W / 2 - 3, ly = D / 2 - 3;
  put(solid(g), prism(P, front, disc(lx, ly, 6), disc(lx, ly, 4.6), H, H + 2));
  mk("path", { d: seg(P(lx, ly, H + 2), P(lx, ly, H + 14)), class: "nf" }, g);
  const shade = solid(g);
  shade.sil.classList.add("sil");
  put(shade, { sil: poly(hull(ringAt(P, disc(lx, ly, 10), H + 13).concat(ringAt(P, disc(lx, ly, 6.5), H + 24)))), crease: "" });

  const tray = solid(g), face = solid(g), knob = mk("path", { class: "nf" }, g);
  face.sil.classList.add("sil");
  const out = spring(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    if (o > 1.2) { const [r, i] = rings(4, D - 1, W - 4, D + o, 1.5, 0.6); put(tray, prism(P, front, r, i, 33, 45)); } else put(tray, { sil: "", crease: "" });
    const [fr, fi] = rings(2, D + o, W - 2, D + o + 2.4, 1, 0.5);
    put(face, prism(P, front, fr, fi, 31, 47));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(W / 2, D + o + 2.4, 1.6, 10), 39).concat(ringAt(P, disc(W / 2, D + o + 4.4, 1.6, 10), 39)))));
  }
  const B = register(stage, (dt) => { const m = stepS(out, dt); draw(out.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { out.t = REST; shade.sil.classList.add("hi"); face.sil.classList.remove("hi"); read.textContent = "rest"; B.wake(); return; }
    const [, wy] = unproj(C, p[0], p[1], 0);
    out.t = clamp(((wy - 8) / 40) * maxO, 0, maxO);
    shade.sil.classList.remove("hi");
    face.sil.classList.add("hi");
    read.textContent = "open " + Math.round((out.t / 22) * 100) + "%";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxO = v; }, destroy: bag.dispose };
}

hairline({
  name: "bedsidetable",
  means: "A bedside table with a lamp: the drawer slides out toward the pointer, further the nearer it comes.",
  rules: [1, 3, 5, 8],
  range: [10, 16, 22],
  tour: [[200, 160], [180, 230], [160, 280], null],
  mount,
});
