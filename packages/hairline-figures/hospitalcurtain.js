/**
 * Hospitalcurtain: a bed under a ceiling rail, its pleated screen hanging
 * from the rail. The pointer's position along the rail draws the curtain:
 * it slides out across the bed or bunches back to the wall end. At rest it
 * is half drawn, bright. The slider is the pleat depth.
 *
 * The pattern: one continuous value (spring).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, lerp, spring, stepS, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RY = 62, H = 72, TOP = 92, X0 = 2, X1 = 128, LO = 10, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dep = value, lastD = NaN, lastE = NaN;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, 0], [132, 0, 0], [0, 66, 0], [132, 66, 0], [0, RY, TOP], [132, RY, TOP], [0, 0, 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the bed: frame, mattress, pillow
  const [b1, b1i] = rings(10, 8, 112, 50, 4, 1.6);
  put(solid(g), prism(P, front, b1, b1i, 0, 16));
  const [b2, b2i] = rings(12, 10, 110, 48, 5, 1.6);
  put(solid(g), prism(P, front, b2, b2i, 16, 23));
  const [b3, b3i] = rings(16, 14, 34, 44, 5, 1.4);
  put(solid(g), prism(P, front, b3, b3i, 23, 27));
  // ceiling drops and the rail
  for (const x of [8, 122]) { const [d, di] = rings(x - 1.2, RY - 1.2, x + 1.2, RY + 1.2, 1.2, 0.4); put(solid(g), prism(P, front, d, di, H + 2, TOP)); }
  const curt = mk("path", { class: "sil hi" }, g), folds = mk("path", { class: "nf lo" }, g);
  const [rr, ri] = rings(0, RY - 2, 132, RY + 2, 2, 0.7);
  put(solid(g), prism(P, front, rr, ri, H, H + 2.4));

  function draw(ext) {
    if (ext === lastE && dep === lastD) return;
    lastE = ext; lastD = dep;
    const n = Math.max(4, Math.round((ext - X0) / 7)), top = [], bot = [];
    let fd = "";
    for (let i = 0; i <= n; i++) {
      const x = lerp(X0, ext, i / n), y = RY + (i % 2 ? dep : -dep);
      top.push(P(x, y, H)); bot.push(P(x, y, LO + (i % 2 ? 1.5 : 0)));
      if (i > 0 && i < n) fd += seg(P(x, y, H - 1), P(x, y, LO + 3));
    }
    curt.setAttribute("d", poly(top.concat(bot.reverse())));
    folds.setAttribute("d", fd);
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 16, X1)); return m; });
  bag.add(B.unregister);
  const sa = P(16, RY, H / 2)[0], sb = P(X1, RY, H / 2)[0];
  function setExt(e, label) { sp.t = e; read.textContent = label; B.wake(); }
  setExt(REST, "rest");
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = clamp((sx - sa) / (sb - sa), 0, 1); setExt(lerp(16, X1, t), Math.round(t * 100) + "%"); },
    leave: () => setExt(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dep = v; B.wake(); draw(clamp(sp.x, 16, X1)); }, destroy: bag.dispose };
}

hairline({
  name: "hospitalcurtain",
  means: "A bed under a ceiling rail: the pointer's place along the rail slides the pleated screen out across the bed or back.",
  rules: [1, 3, 5, 8],
  range: [1.5, 3, 5],
  tour: [[104, 143], [230, 207], [240, 211], null],
  mount,
});
