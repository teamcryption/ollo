/**
 * Chalkboard: a classroom board on a frame of two posts on feet and a top
 * rail, with two panels, one behind the other, and a chalk tray. The front
 * panel slides along its track on a spring toward the pointer, carrying its
 * chalk lines. At rest it stands a third of the way along, bright.
 * The slider is how quickly it follows.
 *
 * The pattern: a continuous slide; the hit maps the pointer's screen x onto
 * the board's resting line, which never moves.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 110, PW = 62, Z0 = 22, Z1 = 70, YF = 2.8, REST = 0.3;
const SPAN = W - 4 - PW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-6, -16, 0], [W + 6, 20, 0], [W + 6, -16, 0], [-6, 20, 0], [-4, -2, 76], [W + 4, -2, 76]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-5, -16, 1, 20, 2, 0.8, 0, 3);
  box(-4, -1.5, 0, 6, 1.2, 0.5, 3, 72);
  box(W - PW - 2, 0, W - 2, 2.2, 1, 0.5, Z0, Z1);
  const fp = mk("g", {}, g);
  const panel = solid(fp), chalk = mk("path", { class: "nf lo" }, fp);
  panel.sil.classList.add("hi");
  box(0, 5.4, W, 10, 1, 0.5, 18, 20.2);
  mk("path", { class: "nf lo", d: seg(P(70, 7.5, 20.4), P(76, 7.5, 20.4)) }, g);
  box(W - 1, -16, W + 5, 20, 2, 0.8, 0, 3);
  box(W, -1.5, W + 4, 6, 1.2, 0.5, 3, 72);
  box(-4, -1.5, W + 4, 6, 1.5, 0.6, 72, 75.5);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const x0 = 2 + sp.x * SPAN, yf = YF + 2.2;
    const [o, i] = rings(x0, YF, x0 + PW, yf, 1, 0.5);
    put(panel, prism(P, front, o, i, Z0, Z1));
    const ring = [];
    for (let k = 0; k <= 24; k++) { const t = (k / 24) * Math.PI * 2; ring.push(P(x0 + 44 + 8 * Math.cos(t), yf, 48 + 8 * Math.sin(t))); }
    chalk.setAttribute("d", open([P(x0 + 9, yf, 34), P(x0 + 29, yf, 34), P(x0 + 19, yf, 54), P(x0 + 9, yf, 34)]) + open(ring) + seg(P(x0 + 10, yf, 62), P(x0 + 54, yf, 62)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const a0 = P(0, YF, 46)[0], a1 = P(1, YF, 46)[0] - a0;
  function slideTo(sx, sy) {
    let t = null;
    if (sx != null) {
      const x = (sx - a0) / a1;
      if (x > -12 && x < W + 12 && sy > P(x, YF, 80)[1] - 6 && sy < P(x, YF, 0)[1] + 6) t = clamp((x - 2 - PW / 2) / SPAN, 0, 1);
    }
    sp.t = t == null ? REST : t;
    read.textContent = t == null ? "rest" : "panel " + Math.round(t * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => slideTo(p[0], p[1]), leave: () => slideTo(null) }));
  bag.add(() => svg.replaceChildren());
  slideTo(null);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "chalkboard",
  means: "A two-panel classroom chalkboard on a frame: the front panel slides along its track toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[109, 113], [250, 147], [180, 135], null],
  mount,
});
