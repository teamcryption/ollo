/**
 * Napkin holder: a low base with two upright end plates and a stack of
 * napkins standing between them, pressed forward by the spring plate. The
 * pointer over it draws the napkins up out of the holder, the front one
 * highest, the rest following less. At rest the front napkin stands a
 * little proud, bright. The slider is how far they rise.
 *
 * The pattern: items rising from slots (toaster).
 */
const {
  Cam, fit, facing, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 54, Y1 = 34, NH = 34, N = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-4, -2, 0], [X1 + 4, Y1 + 2, 0], [-4, Y1 + 2, 0], [X1 + 4, -2, 0], [X1 / 2, 6, 4 + NH + 34], [X1 / 2, Y1, 4 + NH + 34]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -2, X1 + 4, Y1 + 2, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [lr, li] = rings(-4, 2, 0, Y1 - 2, 1.5, 0.6);
  put(solid(g), prism(P, front, lr, li, 4, 30));
  const [pr, pi] = rings(2, 3, X1 - 2, 5.5, 1, 0.5);
  put(solid(g), prism(P, front, pr, pi, 4, 26));
  const naps = [];
  for (let i = 0; i < N; i++) {
    const y = 7 + i * 4.2, s = solid(g);
    const [nr, ni] = rings(3, y, X1 - 3, y + 2.4, 1, 0.6);
    naps.push({ i, s, nr, ni, last: NaN });
  }
  const [rr, ri] = rings(X1, 2, X1 + 4, Y1 - 2, 1.5, 0.6);
  put(solid(g), prism(P, front, rr, ri, 4, 30));
  const sp = spring(0);
  function draw(v) {
    for (const n of naps) {
      const w = (n.i + 1) / N, up = n.i === N - 1 ? Math.max(v, 0.18) : v;
      const z = 4 + up * 36 * w * w;
      if (z === n.last) continue;
      n.last = z;
      put(n.s, prism(P, front, n.nr, n.ni, z, z + NH));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(0);
  naps[N - 1].s.sil.classList.add("hi");
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? reach : 0;
    read.textContent = v ? "pull" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    const m = P(X1 / 2, Y1 / 2, 20);
    return Math.abs(sx - m[0]) < 100 && Math.abs(sy - m[1]) < 90;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "napkindisp",
  means: "A napkin holder: the pointer over it draws the napkins up between the end plates, the front one highest.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[200, 181], [185, 165], [218, 196], null],
  mount,
});
