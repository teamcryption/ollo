/**
 * Cocktail shaker: a steel tin with a strainer top and a small cap. The
 * pointer over the shaker lifts the strainer top up and off to the side.
 * At rest the top sits slightly raised, bright. The slider is how far.
 */
const { Cam, fit, facing, prism, proj, circ, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 13, BZ = 30, REST = 4;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-R - 4, -R - 4, 0], [R + 34, R + 4, 0], [-R, R, 0], [R + 30, -R, 75], [-R, -R, 60]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-R - 4, -R - 4, R + 34, R + 4, 5, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 2));
  put(solid(g), prism(P, front, disc(0, 0, R - 1.5), disc(0, 0, R - 3), 2, 6));
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.5), 6, BZ));
  const top = solid(g), neck = solid(g), cap = solid(g);
  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const dx = z * 0.6, b = BZ + z;
    put(top, prism(P, front, disc(dx, 0, R + 1), disc(dx, 0, R - 1), b - 4, b + 12));
    put(neck, prism(P, front, disc(dx, 0, R * 0.62), disc(dx, 0, R * 0.5), b + 12, b + 20));
    put(cap, prism(P, front, disc(dx, 0, R * 0.48), disc(dx, 0, R * 0.36), b + 20, b + 26));
  }
  top.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, BZ);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lift, a ? 10 + open * 0.3 : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(lift, 10 + open * 0.3, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cocktailshaker",
  means: "A cocktail shaker: the pointer over the tin lifts the strainer top and cap up and off to one side.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[171, 150], [186, 142], [160, 160], null],
  mount,
});
