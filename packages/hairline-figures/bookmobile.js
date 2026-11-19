/**
 * Mobile library van: a tall box body behind a sloped cab, a long side panel
 * hinged along its top edge. The pointer swings the panel up into an awning,
 * propped on two struts, and the shelves of books behind it show. At rest the
 * panel hangs just ajar, bright. The slider is how far it opens.
 *
 * The pattern: one hinged part (swing up).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 156, W = 58, ZB = 14, ZT = 84, X0 = 10, X1 = 110, H0 = 30, H1 = 76, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  const pan = (x, f, a) => [x, W + f * Math.sin(rad(a)), H1 - f * Math.cos(rad(a))];
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, 0, ZT], [X0, W + 46, H1], [X1, W + 46, H1], [X0, W, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [28, 132]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [br, bi] = rings(0, 0, 120, W, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, ZB, ZT));
  const foot = rrect(118, 0, L, W, 7, 6), top = rrect(120, 4, L - 18, W - 4, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB).concat(ringAt(P, foot, 40), ringAt(P, top, 66)))));
  mk("path", { d: seg(P(L - 3, W - 6, 42), P(L - 16, W - 6, 63)), class: "nf lo" }, g);
  // the opening, its shelves and the books on them
  const at = (x, z) => P(x, W, z);
  let d = poly([at(X0, H0), at(X1, H0), at(X1, H1), at(X0, H1)]);
  for (const z of [H0, 45, 60]) {
    if (z > H0) d += open([at(X0, z), at(X1, z)]);
    for (let x = X0 + 4, i = 0; x < X1 - 4; x += 4.6, i++) { const h = 9 + ((i * 7) % 5); if (i % 6 !== 5) d += open([at(x, z), at(x, z + h)]); }
  }
  mk("path", { d, class: "nf lo" }, g);
  for (const x of [28, 132]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const struts = mk("path", { class: "nf lo" }, g), panel = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const F = H1 - H0 + 2;
    panel.setAttribute("d", poly([P(...pan(X0 - 2, 0, a)), P(...pan(X1 + 2, 0, a)), P(...pan(X1 + 2, F, a)), P(...pan(X0 - 2, F, a))]));
    edge.setAttribute("d", open([P(...pan(X0, F - 3, a)), P(...pan(X1, F - 3, a))]));
    const s = clamp((a - 30) / 40, 0, 1);
    struts.setAttribute("d", s > 0 ? seg(P(X0 + 4, W, H0 + 6), P(...pan(X0 + 4, F * s, a))) + seg(P(X1 - 4, W, H0 + 6), P(...pan(X1 - 4, F * s, a))) : "");
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  const PX = P((X0 + X1) / 2, W, H0)[0];

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp(1.4 - Math.abs(sx - PX) / 90, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookmobile",
  means: "A mobile library van with a side panel hinged at its top: the pointer swings the panel up into an awning over shelves of books.",
  rules: [1, 3, 5, 6],
  range: [50, 80, 95],
  tour: [[167, 161], [120, 150], [290, 210], null],
  mount,
});
