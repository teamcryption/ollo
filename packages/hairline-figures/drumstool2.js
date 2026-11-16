/**
 * Cowbell: a cowbell on a drum clamp, the clamp on a short post over a round
 * foot. The pointer is where the drummer sits: the bell turns on the clamp to
 * point its mouth there, on a spring. At rest it points a little right, bright.
 * The slider is how quickly the bell follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is the
 * pointer's screen x, which never moves with the drawing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 64, REST = 0.35, L = 46;
const BACK = rrect(-7, -5, 7, 5, 2.5, 4), MOUTH = rrect(-15, -10, 15, 10, 4, 4), LIP = rrect(-13.4, -8.4, 13.4, 8.4, 3, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-14, -14, 0], [14, 14, 0], [L * 0.7, L * 0.7, H + 10], [-6, -6, H + 12], [0, L, H - 10], [L, 0, H - 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(14, 48), circ(12.6, 48), 0, 2.5));
  put(solid(g), prism(P, front, circ(2.2, 20), null, 2.5, H + 6));
  const [cr, ci] = [rrect(-5, -5, 5, 5, 2, 4), rrect(-4, -4, 4, 4, 1.4, 4)];
  put(solid(g), prism(P, front, cr.map((q) => q), ci, H - 6, H + 6));
  const bell = solid(g);
  bell.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const at = (x, q) => P(x * c - q.u * s, x * s + q.u * c, H + q.v);
    const back = BACK.map((q) => at(5, q)), mouth = MOUTH.map((q) => at(L, q));
    put(bell, { sil: poly(hull(back.concat(mouth))), crease: poly(LIP.map((q) => at(L + 0.2, q))) });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over == null ? REST : over;
    read.textContent = over == null ? "rest" : Math.round((over * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp(lerp(1.5, 0.05, (p[0] - 90) / 220), 0.05, 1.5); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drumstool2",
  means: "A cowbell on a drum clamp: it turns on the clamp to point its mouth where the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[155, 153], [291, 141], [137, 262], null],
  mount,
});
