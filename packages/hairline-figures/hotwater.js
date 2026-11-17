/**
 * Hand warmer: a pocket hand warmer, a rounded clamshell case with its lid
 * hinged along the back edge and a burner grille inside. The pointer's height
 * along the case sets how far the lid swings open on a spring; nearer the
 * front, the wider it opens, showing the burner's holes. At rest the lid sits
 * just ajar, bright. The slider is the widest the lid will open.
 *
 * The pattern: a continuous aim on one hinged part; the hit is a fixed screen box round every pose.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad, rings, rrect, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 26, D = 40, HB = 9, HL_ = 8, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 4.6);
  const lidRing = rrect(0, 0, W, D, 7, 8), lidIn = rrect(1.6, 1.6, W - 1.6, D - 1.6, 5.4, 8);
  const lw = (x, y, zl, a) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return [x, y * c - zl * s, HB + y * s + zl * c];
  };
  const ext = [];
  [0, 130].forEach((a) => [[0, 0], [W, 0], [0, D], [W, D]].forEach(([x, y]) => [0, HL_].forEach((z) => ext.push(lw(x, y, z, a)))));
  ext.push([0, D, 0], [W, D, 0], [W, 0, 0], [0, 0, 0]);
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sp0 = ext.map((q) => P(...q)), xs = sp0.map((q) => q[0]), ys = sp0.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs)], by = [Math.min(...ys), Math.max(...ys)];

  // the case: a rounded body, with the burner grille on its top
  const [r0, i0] = rings(0, 0, W, D, 7, 1.6);
  const body = solid(g);
  put(body, prism(P, front, r0, i0, 0, HB));
  const grille = rrect(6, 8, W - 6, D - 8, 4, 6);
  mk("path", { class: "nf lo", d: poly(grille.map((p) => P(p.u, p.v, HB))) }, body.g);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const d = flatDot(body.g, C, 1.6, "dot off");
    place(d, P(10 + j * 6, 13 + i * 7, HB));
  }

  // the lid: a rounded plate turning about the hinge on the back edge
  const lid = { g: mk("g", {}, g) };
  lid.sil = mk("path", { class: "sil hi" }, lid.g);
  lid.cr = mk("path", { class: "nf lo" }, lid.g);
  const hinge = mk("path", { class: "nf lo" }, g);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    lidRing.forEach((p) => { pts.push(P(...lw(p.u, p.v, 0, a)), P(...lw(p.u, p.v, HL_, a))); });
    lid.sil.setAttribute("d", poly(hull(pts)));
    if (a < 80) {
      const keep = lidIn.map((p) => (front(p) ? P(...lw(p.u, p.v, HL_, a)) : null));
      const k0 = keep.findIndex((p, i) => p && !keep[(i - 1 + keep.length) % keep.length]);
      const runPts = [];
      for (let i = 0; i < keep.length; i++) { const p = keep[(k0 + i) % keep.length]; if (!p) break; runPts.push(p); }
      lid.cr.setAttribute("d", open(runPts));
    } else lid.cr.setAttribute("d", poly(lidIn.map((p) => P(...lw(p.u, p.v, 0, a)))));
    hinge.setAttribute("d", open([P(4, 0, HB), P(W - 4, 0, HB)]));
  }
  const sp = spring(REST);
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (p[0] < bx[0] - 8 || p[0] > bx[1] + 8 || p[1] < by[0] - 8 || p[1] > by[1] + 8) return leave();
    const t = clamp((p[1] - by[0]) / (by[1] - by[0]), 0, 1);
    sp.t = lerp(REST + 20, maxA, t);
    read.textContent = "lid " + Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "hotwater",
  means: "A pocket hand warmer: its hinged lid swings open toward the pointer, wider the nearer the front, showing the burner.",
  rules: [1, 3, 5, 8],
  range: [70, 110, 130],
  tour: [[200, 130], [190, 230], [120, 200], null],
  mount,
});
