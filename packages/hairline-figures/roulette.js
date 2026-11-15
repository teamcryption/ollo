/**
 * Spinner wheel: a flat game wheel on a round plinth, twelve wedges, a peg at
 * each wedge's edge and a fixed pawl at the front rim. The pointer is where the
 * wheel turns to: its angle round the hub becomes the wheel's turn, on a
 * spring, and the wedge that lands under the pawl is bright. At rest the wheel
 * is left a little past a wedge, that wedge lit. The slider is how far the
 * wheel follows (a fraction of the pointer's angle).
 *
 * The pattern: a continuous aim on one spring; the hit is the plinth's top
 * plane, which never moves, and the chosen wedge reads the spring's target.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, poly,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 12, R = 60, ZT = 12, REST = 0.22;
const W = (Math.PI * 2) / N, FRONT = Math.PI / 4;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; ext.push([(R + 6) * Math.cos(a), (R + 6) * Math.sin(a), 0], [R * Math.cos(a), R * Math.sin(a), ZT + 7]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R + 6, 72), circ(R + 4.6, 72), 0, 6));
  put(solid(g), prism(P, front, circ(R, 72), circ(R - 2, 72), 6, ZT));
  const lines = mk("path", { class: "nf lo", d: "" }, g);
  const inner = mk("path", { class: "nf lo", d: "" }, g);
  const wedge = mk("path", { class: "nf hi", d: "" }, g);
  const pegs = [];
  for (let i = 0; i < N; i++) pegs.push(flatDot(g, C, 1.3, "dot off"));
  put(solid(g), prism(P, front, circ(7, 32), circ(5.8, 32), ZT, ZT + 5));
  const pc = (R - 1) / Math.SQRT2;
  put(solid(g), prism(P, front, ...rings(pc - 4, pc - 4, pc + 4, pc + 4, 1.6, 0.8), ZT, ZT + 7));

  const sp = spring(REST);
  let drawn = NaN;
  const at = (r, a) => P(r * Math.cos(a), r * Math.sin(a), ZT);
  function draw() {
    const a0 = sp.x;
    if (Math.abs(a0 - drawn) < 1e-4) return;
    drawn = a0;
    let d = "", d2 = [];
    for (let i = 0; i < N; i++) {
      const a = a0 + i * W;
      d += seg(at(9, a), at(R - 2, a));
      place(pegs[i], at(R - 4.5, a));
    }
    for (let k = 0; k <= 48; k++) d2.push(at(R * 0.62, (k / 48) * Math.PI * 2));
    lines.setAttribute("d", d);
    inner.setAttribute("d", poly(d2));
    // the wedge whose span holds the front, by the spring's target
    const i = pick(sp.t), s = sp.x + i * W, arc = [];
    for (let k = 0; k <= 8; k++) arc.push(at(R - 2, s + (k / 8) * W));
    for (let k = 8; k >= 0; k--) arc.push(at(R * 0.62, s + (k / 8) * W));
    wedge.setAttribute("d", poly(arc));
  }
  const pick = (t) => ((Math.floor(wrap(FRONT - t) / W) % N) + N) % N;

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t, on) {
    sp.t = sp.t + wrap(t - sp.t);
    drawn = NaN;
    read.textContent = on ? "wedge " + (pick(sp.t) + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZT), r = Math.hypot(x, y);
      if (r > R + 30 || r < 6) return r > R + 30 ? aim(REST, false) : undefined;
      aim(value * wrap(Math.atan2(y, x) - FRONT) + REST, true);
    },
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "roulette",
  means: "A spinner wheel: it turns with the pointer's angle round the hub, and the wedge under the front pawl is bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[151, 101], [102, 206], [298, 206], null],
  mount,
});
