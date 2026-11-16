/**
 * Mooring bollard: a squat iron bollard on a round quay plate, with a heavy
 * mooring line looped on its neck. The pointer is where the boat lies: the
 * line swings round the post to lead toward it on a spring, and stays bright.
 * At rest the line leads off to the right. The slider is how far it may swing.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, unproj, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const REST = 20, LEN = 88, TR = 4.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-22, -22, 0], [LEN, -8, 0], [-16, LEN, 0], [62, 62, 0], [-15, -15, 34]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const body = (s, ring, inner, w0, w1, M) => {
    const a = ring.map((q) => P(...M(q.u, q.v, w0))), b = ring.map((q) => P(...M(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    s.cr.setAttribute("d", poly(inner.map((q) => P(...M(q.u, q.v, w1)))));
  };
  const up = (u, v, w) => [u, v, w];
  body(solid(g), circ(22, 40), circ(20, 40), -4, 0, up);
  body(solid(g), circ(10, 32), circ(8.6, 32), 0, 24, up);
  body(solid(g), circ(15, 40), circ(13, 40), 24, 34, up);
  const rope = solid(g);
  const th = spring(REST);
  let over = false, last = NaN;
  function draw() {
    if (Math.abs(th.x - last) < 0.02) return;
    last = th.x;
    const a = (th.x * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const M = (u, v, w) => [c * w - s * u, s * w + c * u, 16 - w * 0.13 + v];
    body(rope, circ(TR, 16), circ(TR - 1.4, 16), 4, LEN, M);
  }
  rope.sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 20 && r < 150;
      const deg = (Math.atan2(y, x) * 180) / Math.PI;
      th.t = over ? clamp(REST + (deg - REST) * amp, -5, 100) : REST;
      read.textContent = over ? `${Math.round(th.t)}°` : "rest";
      B.wake();
    },
    leave: () => { over = false; th.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "mooringpost",
  means: "A mooring bollard with a heavy line on its neck: the line swings round the post to lead toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[69, 250], [300, 262], [376, 235], null],
  mount,
});
