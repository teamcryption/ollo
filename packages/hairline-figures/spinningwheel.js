/**
 * Spinning top: a toy top balanced on its point on a small round board. The
 * top leans toward the pointer, as a spinning top precesses, and the lean
 * follows the pointer on a spring, clamped so it never tips over. At rest it
 * leans a little back, its rim bright. The slider is the most lean.
 *
 * The pattern: one part answering where the pointer is (aim).
 */
const {
  Cam, circ, clamp, fit, hull, poly, open, proj, ringAt, run, facing, prism, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PROF = [[1.5, 0], [8, 5], [22, 14], [22, 18], [17, 23]];
const RX = -0.12, RY = -0.18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value / 100;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-30, 30, 0], [30, -30, 0], [-12, -12, 38], [12, 12, 38]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const br = rrect(-30, -30, 30, 30, 30, 14), bi = rrect(-28, -28, 28, 28, 28, 14);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const shadow = mk("path", { class: "nf lo dash" }, g);
  const body = mk("path", { class: "sil hi" }, g);
  const band = mk("path", { class: "nf lo" }, g);
  const handle = mk("path", { class: "sil" }, g);
  const lx = spring(RX), ly = spring(RY);
  let last = "";

  const ring = (r, z, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + lx.x * z, v: q.v + ly.x * z }));
  function draw() {
    const key = lx.x.toFixed(3) + ly.x.toFixed(3);
    if (key === last) return;
    last = key;
    const pts = [];
    for (const [r, z] of PROF) pts.push(...ringAt(P, ring(r, z), z));
    body.setAttribute("d", poly(hull(pts)));
    band.setAttribute("d", open(ringAt(P, run(ring(21, 18), front), 18)));
    handle.setAttribute("d", poly(hull(ringAt(P, ring(3, 23, 16), 23).concat(ringAt(P, ring(3, 36, 16), 36)))));
    shadow.setAttribute("d", poly(ringAt(P, circ(22, 36).map((q) => ({ ...q, u: q.u + lx.x * 16, v: q.v + ly.x * 16 })), 0)));
    const deg = Math.round(Math.atan(Math.hypot(lx.x, ly.x)) * 180 / Math.PI);
    read.textContent = act ? deg + "°" : "rest";
  }

  let act = false;
  const B = register(stage, (dt) => {
    const a = stepS(lx, dt), b = stepS(ly, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    const d = Math.hypot(wx, wy) || 1, m = clamp(d / 45, 0, 1) * 0.5 * most;
    lx.t = (wx / d) * m; ly.t = (wy / d) * m;
    act = true; last = ""; B.wake();
  }
  function leave() { lx.t = RX; ly.t = RY; act = false; last = ""; B.wake(); }
  draw();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "spinningwheel",
  means: "A toy top balanced on its point: it leans toward the pointer like a precessing top, on a spring, never tipping over.",
  rules: [1, 3, 5, 8],
  range: [20, 70, 100],
  tour: [[293, 240], [107, 240], [200, 100], null],
  mount,
});
