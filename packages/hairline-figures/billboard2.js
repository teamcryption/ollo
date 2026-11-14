/**
 * Pop-up banner: a roll-up stand, the banner pulled out of its cassette and
 * held by a pole. The pointer's height sets how far the banner stands out of
 * the cassette, on a spring. At rest it stands most of the way up, its top
 * rail bright. The slider is the banner's width.
 *
 * The pattern: one continuous value, read from where the pointer is.
 */
const {
  Cam, clamp, fillet, fit, facing, hull, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HB = 9, HMAX = 150, REST = 0.78, TH = 0.8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let half = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-58, -10, 0], [58, 10, 0], [58, -10, 0], [-58, 10, 0], [-48, 0, HB + HMAX + 4], [48, 0, HB + HMAX + 4]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pole = mk("path", { class: "nf lo" }, g);
  const ban = solid(g), lines = mk("path", { class: "nf lo" }, g), rail = solid(g);
  const cas = solid(g);
  rail.sil.classList.add("hi");
  const h = spring(REST);
  let last = NaN, lastHalf = NaN;

  function draw() {
    if (h.x === last && half === lastHalf) return;
    last = h.x; lastHalf = half;
    const W = half, top = HB + 6 + (HMAX - 6) * clamp(h.x, 0.04, 1);
    const [cr, ci] = rings(-W - 6, -7, W + 6, 7, 4, 1.4);
    put(cas, prism(P, front, cr, ci, 0, HB));
    pole.setAttribute("d", open([P(0, -3, HB), P(0, -3, top)]));
    const face = (y) => fillet([P(-W, y, HB), P(W, y, HB), P(W, y, top), P(-W, y, top)], [0.5, 0.5, 1, 1], 3);
    const f = face(TH);
    put(ban, { sil: poly(hull(face(-TH).concat(f))), crease: open([f[f.length - 1]].concat(f.slice(0, 1))) });
    const d = [];
    for (const t of [0.82, 0.74, 0.3, 0.22]) { const z = HB + (top - HB) * t, w = t > 0.5 ? W * 0.7 : W * 0.45; d.push(open([P(-w, TH, z), P(w, TH, z)])); }
    lines.setAttribute("d", d.join(" "));
    const [rr, ri] = rings(-W - 2, -2.4, W + 2, 2.4, 2, 0.8);
    put(rail, prism(P, front, rr, ri, top, top + 3.5));
  }

  const loop = register(stage, (dt) => { const m = stepS(h, dt); draw(); return m; });
  bag.add(loop.unregister);

  const yBase = P(0, 0, HB)[1], yTop = P(0, 0, HB + HMAX)[1];
  function aim(p) {
    if (!p) { h.t = REST; read.textContent = "rest"; }
    else { h.t = clamp((yBase - p[1]) / (yBase - yTop), 0.04, 1); read.textContent = Math.round(h.t * 100) + "%"; }
    loop.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { half = v; last = NaN; loop.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "billboard2",
  means: "A roll-up banner stand: the pointer's height sets how far the banner stands out of its cassette, on a spring.",
  rules: [1, 3, 5, 8],
  range: [30, 40, 46],
  tour: [[200, 145], [200, 249], [200, 42], null],
  mount,
});
