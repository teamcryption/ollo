/**
 * Fanfold: a folding hand fan held upright, its sticks pinned at a rivet,
 * a pleated leaf across their tips. One guard stays put on the left; the
 * leading guard follows the pointer round the rivet on a spring, and every
 * stick between spreads evenly after it. At rest the fan is half open and
 * the leading guard is bright. The slider is how far it may open.
 *
 * The pattern: a continuous aim (a spring on one angle), read against the
 * rivet, which never moves.
 */
const {
  Cam, clamp, fit, poly, proj, seg, spring, stepS, rad,
  disposer, mk, pointer, register,
} = HL;

const R = 78, R1 = 34, N = 13, A0 = -82, REST = 8, H = 6;
const D = [Math.SQRT1_2, -Math.SQRT1_2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.35);
  const W = (r, a) => [D[0] * r * Math.sin(rad(a)), D[1] * r * Math.sin(rad(a)), H + r * Math.cos(rad(a))];
  const ext = [];
  for (let a = -90; a <= 90; a += 15) ext.push(W(R, a));
  ext.push([0, 0, 0]);
  fit(C, ext, 200, 168);
  const P = proj(C);
  const Q = (r, a) => P(...W(r, a));
  const g = mk("g", {}, svg);
  const leaf = mk("path", { class: "sil" }, g);
  const pleats = mk("path", { class: "nf lo" }, g);
  const sticks = mk("path", { class: "nf" }, g);
  const guard0 = mk("path", { class: "nf sil" }, g);
  const guard1 = mk("path", { class: "nf sil hi" }, g);
  const rivet = mk("circle", { r: 2.6, class: "dot m" }, g);
  const piv = Q(0, 0);
  rivet.setAttribute("cx", piv[0]); rivet.setAttribute("cy", piv[1]);
  const sp = spring(REST);
  let last = NaN;

  function draw() {
    const a1 = sp.x;
    if (a1 === last) return;
    last = a1;
    const angs = Array.from({ length: N }, (_, i) => A0 + ((a1 - A0) * i) / (N - 1));
    const outer = [], inner = [];
    angs.forEach((a, i) => {
      const half = i < N - 1 ? (a + angs[i + 1]) / 2 : null;
      outer.push(Q(R, a));
      if (half !== null) outer.push(Q(R - 3, half));
      inner.push(Q(R1, a));
      if (half !== null) inner.push(Q(R1 - 1.5, half));
    });
    leaf.setAttribute("d", poly(outer.concat(inner.reverse())));
    pleats.setAttribute("d", angs.slice(1, -1).map((a) => seg(Q(R1, a), Q(R, a))).join(""));
    sticks.setAttribute("d", angs.slice(1, -1).map((a) => seg(piv, Q(R1, a))).join(""));
    guard0.setAttribute("d", seg(Q(-8, A0), Q(R + 2, A0)));
    guard1.setAttribute("d", seg(Q(-8, a1), Q(R + 2, a1)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  // screen basis of the fan's plane, for reading the pointer's angle round the rivet
  const ex = Q(1, 90), ez = Q(1, 0);
  const bx = [ex[0] - piv[0], ex[1] - piv[1]], bz = [ez[0] - piv[0], ez[1] - piv[1]];
  const det = bx[0] * bz[1] - bx[1] * bz[0];

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const dx = p[0] - piv[0], dy = p[1] - piv[1];
    const u = (dx * bz[1] - dy * bz[0]) / det, w = (bx[0] * dy - bx[1] * dx) / det;
    const a = clamp(Math.atan2(u, w) * 180 / Math.PI, -50, maxA);
    sp.t = a;
    read.textContent = Math.round(a - A0) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "fanfold",
  means: "A folding hand fan held upright: its leading guard follows the pointer round the rivet and the pleated leaf spreads after it.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 90],
  tour: [[300, 131], [383, 241], [200, 90], null],
  mount,
});
