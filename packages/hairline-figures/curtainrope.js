/**
 * Stage curtain: a low stage with two curtain halves hung from a rail. The
 * pointer across the stage draws them apart on a spring, wider the nearer
 * it is to the middle. At rest they hang just parted, the left half bright.
 * The slider is how far they can draw.
 *
 * The pattern: a continuous slide, hit by screen x against the rest pose.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rrect, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const W = 70, HT = 92, ST = 10, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-W - 8, -14, 0], [W + 8, 24, 0], [-W - 8, 0, ST + HT + 6], [W + 8, 0, ST + HT + 6]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const add = (a, b, s) => a.map((x, i) => x + b[i] * s);
  function slab(c, U, V, Wn, a, b, t, r) {
    const pts = [], at = (q, z) => P(...add(add(add(c, U, q.u), V, q.v), Wn, z));
    for (const q of rrect(-a, -b, a, b, r, 4)) pts.push(at(q, -t / 2), at(q, t / 2));
    const inner = rrect(-a + 2, -b + 2, a - 2, b - 2, Math.max(1, r - 2), 4).map((q) => at(q, t / 2));
    return { sil: poly(hull(pts)), cr: poly(inner) };
  }
  const deck = slab([0, 4, ST / 2], [1, 0, 0], [0, 1, 0], [0, 0, 1], W + 8, 20, ST, 5);
  mk("path", { d: deck.sil, class: "sil" }, g);
  mk("path", { d: deck.cr, class: "nf lo" }, g);
  const rail = slab([0, -2, ST + HT + 3], [1, 0, 0], [0, 1, 0], [0, 0, 1], W + 6, 2, 3, 1);
  mk("path", { d: rail.sil, class: "sil" }, g);
  const halves = [-1, 1].map((s) => ({ s, sil: mk("path", { class: s < 0 ? "sil hi" : "sil" }, g), cr: mk("path", { class: "nf lo" }, g) }));

  const gap = spring(REST);
  let last = NaN;
  function draw() {
    if (gap.x === last) return;
    last = gap.x;
    for (const h of halves) {
      const w = (W - gap.x) / 2, cx = h.s * (gap.x + w);
      const b = slab([cx, 0, ST + HT / 2 + 0.5], [1, 0, 0], [0, 0, 1], [0, 1, 0], w, HT / 2, 4, 3);
      h.sil.setAttribute("d", b.sil);
      let folds = "";
      for (let i = 1; i < 4; i++) { const x = cx - w + (2 * w * i) / 4; folds += seg(P(x, 2, ST + 4), P(x, 2, ST + HT - 4)); }
      h.cr.setAttribute("d", b.cr + folds);
    }
  }
  const B = register(stage, (dt) => { const m = stepS(gap, dt); draw(); return m; });
  bag.add(B.unregister);
  const cx = P(0, 0, ST)[0];
  function aim(p) {
    const d = p ? Math.abs(p[0] - cx) : Infinity, on = d < 170;
    gap.t = on ? clamp(1 - d / 170, 0.2, 1) * 52 * reach : REST;
    read.textContent = on ? "open " + Math.round(gap.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "curtainrope",
  means: "Two curtain halves on a stage rail: they draw apart as the pointer nears the middle, and hang just parted at rest.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.2],
  tour: [[60, 170], [200, 170], [320, 170], null],
  mount,
});
