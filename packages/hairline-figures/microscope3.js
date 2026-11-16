/**
 * Stereo microscope: a heavy foot with a round stage, a pillar at the back
 * and a binocular head on an arm. The pointer brings the head sliding down
 * the pillar to focus on the stage. At rest the stage plate is bright.
 * The slider is how far the head travels.
 */
const { Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100, act = false;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [40, 50, 0], [40, 0, 0], [0, 50, 0], [6, 10, 78], [34, 46, 78], [6, 10, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const box = (g, x0, y0, x1, y1, z0, z1, r = 3) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, 1.5), z0, z1)); return s; };
  const cyl = (g, x, y, r, z0, z1) => { const s = solid(g); put(s, prism(P, front, disc(x, y, r), disc(x, y, r - 1.2), z0, z1)); return s; };
  const g = mk("g", {}, svg);
  box(g, 0, 0, 40, 50, 0, 7, 6);
  const plate = cyl(g, 20, 20, 13, 7, 9.5);
  cyl(g, 20, 44, 4, 7, 76);
  const mv = mk("g", {}, g);
  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    mv.replaceChildren();
    const h = 12 - 16 * amt * k;
    cyl(mv, 13, 20, 3.5, 34 + h, 42 + h);
    cyl(mv, 27, 20, 3.5, 34 + h, 42 + h);
    box(mv, 14, 30, 26, 47, 46 + h, 54 + h, 3);
    const head = box(mv, 4, 9, 36, 32, 40 + h, 54 + h, 6);
    cyl(mv, 12, 18, 4, 54 + h, 64 + h);
    cyl(mv, 28, 18, 4, 54 + h, 64 + h);
    head.sil.classList.toggle("hi", act);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const A = P(20, 20, 50);
  function setActive(a) {
    if (a === act) return;
    act = a;
    last = NaN;
    tset(t, a ? 1 : 0, performance.now(), 0);
    plate.sil.classList.toggle("hi", !a);
    read.textContent = a ? "focus" : "rest";
    B.wake();
  }
  plate.sil.classList.add("hi");
  read.textContent = "rest";
  bag.add(pointer(stage, { move: ([x, y]) => setActive(Math.hypot(x - A[0], y - A[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "microscope3",
  means: "A stereo microscope: the binocular head slides down its pillar to focus on the round stage under the pointer.",
  rules: [1, 4, 5, 8],
  range: [40, 70, 100],
  tour: [[209, 129], [200, 104], [217, 178], null],
  mount,
});
