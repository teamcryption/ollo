/**
 * Light table: a designer's tracing table, a cabinet with a glass top hinged
 * at its front edge, a sheet of tracing paper on the glass. The pointer's
 * place along the table sets how far the glass tilts up, a strut holding it.
 * At rest it leans a little, bright. The slider is the most it will tilt.
 *
 * The pattern: one part answering the pointer on a fixed plane.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, unproj, clamp, lerp, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid, put, facing,
} = HL;

const LX = 90, WY = 120, BZ = 34, TH = 3, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [LX, WY, 0], [LX, 0, 0], [0, WY, 0], [10, 0, BZ + 74], [10, WY, BZ + 74]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, LX, WY, 5, 2.5);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const strut = mk("path", { class: "nf" }, g);
  const plate = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g);
  const sheet = mk("path", { class: "nf" }, g), art = mk("path", { class: "nf lo" }, g);
  const a = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), c = Math.cos(th), s = Math.sin(th);
    const W = (u, y, t) => P(LX - 2 - u * c + t * s, y, BZ + u * s + t * c);
    const pts = [];
    for (const u of [0, LX - 4]) for (const y of [2, WY - 2]) for (const t of [0, TH]) pts.push(W(u, y, t));
    plate.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([W(0, 2, TH), W(LX - 4, 2, TH), W(LX - 4, WY - 2, TH), W(0, WY - 2, TH)]));
    sheet.setAttribute("d", poly([W(14, 22, TH), W(72, 18, TH), W(76, 92, TH), W(18, 96, TH)]));
    const ring = [];
    for (let i = 0; i < 24; i++) { const q = (i / 24) * 2 * Math.PI; ring.push(W(44 + 14 * Math.cos(q), 56 + 18 * Math.sin(q), TH)); }
    art.setAttribute("d", poly(ring) + seg(W(30, 40, TH), W(60, 76, TH)));
    const tip = W(LX - 6, WY / 2, 0);
    strut.setAttribute("d", seg(P(LX - 6 - (LX - 6) * 0.55, WY / 2, BZ), tip) + seg(P(LX - 6 - (LX - 6) * 0.55, WY / 2 - 6, BZ), P(LX - 6 - (LX - 6) * 0.55, WY / 2 + 6, BZ)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);
  function aim(p) {
    const now = performance.now();
    let to = REST, lbl = "rest";
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wx > -30 && wx < LX + 40 && wy > -20 && wy < WY + 20) { to = Math.round(lerp(4, 18 + 30 * most, clamp(wy / WY, 0, 1))); lbl = to + "°"; }
    }
    tset(a, to, now, 0);
    read.textContent = lbl;
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "lightbox",
  means: "A light table with a tracing sheet on its glass: the pointer's place along the table tilts the glass top up toward you.",
  rules: [1, 3, 5, 6],
  range: [0, 0.7, 1],
  tour: [[138, 263], [200, 232], [262, 201], null],
  mount,
});
