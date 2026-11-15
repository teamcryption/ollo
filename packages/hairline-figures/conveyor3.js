/**
 * Roller conveyor: two rails on legs with a run of rollers between them and
 * a taped carton riding on top. The pointer slides the carton along the
 * rollers to the point under it. At rest the carton sits past the middle,
 * bright. The slider is how far the carton follows.
 */
const { Cam, clamp, fit, hull, poly, prism, proj, facing, rings, seg, unproj, disposer, mk, pointer, put, register, solid, spring, stepS } = HL;
const L = 140, W = 40, ZR = 26, NR = 10, BW = 42, BD = 32, BH = 32, REST = 62;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -4, 0], [L, W + 4, 0], [L, -4, 0], [0, W + 4, 0], [0, 4, ZR + BH], [L, 4, ZR + BH]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const box3 = (x0, y0, x1, y1, z0, z1, r, b) => { const s = solid(g), [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };
  const legs = (y) => [6, L - 10].forEach((x) => box3(x, y, x + 4, y + 4, 0, ZR - 6, 1.2, 0.5));
  legs(-4);
  box3(0, -4, L, 0, ZR - 6, ZR + 2, 1.5, 0.6);
  legs(W);
  const R = 3.6;
  for (let k = 0; k < NR; k++) {
    const x = 7 + (k * (L - 14)) / (NR - 1), end = (y) => Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2; return P(x + R * Math.cos(a), y, ZR - R + R * Math.sin(a)); });
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(end(0).concat(end(W)))));
    s.cr.setAttribute("d", poly(end(W - 0.5)));
  }
  const box = solid(g), tape = mk("path", { class: "nf lo" }, box.g);
  box3(0, W, L, W + 4, ZR - 6, ZR + 2, 1.5, 0.6);
  const bx = spring(REST);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const [a, i] = rings(x, 4, x + BW, 4 + BD, 3, 1.2);
    put(box, prism(P, front, a, i, ZR, ZR + BH));
    tape.setAttribute("d", seg(P(x + 2, 4 + BD / 2, ZR + BH), P(x + BW - 2, 4 + BD / 2, ZR + BH)) + seg(P(x + BW, 4 + BD / 2, ZR + BH), P(x + BW, 4 + BD / 2, ZR + BH - 9)));
  }
  draw(REST);
  box.sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(bx, dt); draw(bx.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    let t = REST, act = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], ZR + BH / 2);
      if (x > -20 && x < L + 20 && y > -24 && y < W + 24) { act = true; t = REST + (clamp(x - BW / 2, 0, L - BW) - REST) * gain; }
    }
    bx.t = t;
    read.textContent = act ? "r" + (Math.round(((t + BW / 2 - 7) * (NR - 1)) / (L - 14)) + 1) : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(p), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "conveyor3",
  means: "A roller conveyor: the taped carton slides along the rollers to the spot under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[138, 113], [274, 181], [120, 104], null],
  mount,
});
