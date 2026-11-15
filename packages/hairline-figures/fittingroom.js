/**
 * Fitting room: a booth front, two posts and a rail over a floor plate,
 * with a pleated curtain hung from the rail. The pointer over the booth
 * draws the curtain open: the pleats slide along the rail and bunch at
 * the left post, the one nearest the pointer first. At rest it hangs
 * nearly shut, a gap at the edge, the leading pleat bright. The slider
 * is the stagger.
 *
 * The pattern: a row sliding along one axis; the hit is on the ground.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 44, D = 30, H = 62, N = 6, PW = 7, CY = D - 3;
const REST = [2, 9, 15.5, 22, 28, 33], OPEN = [2, 3.6, 5.2, 6.8, 8.4, 10];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [0, 0, H], [W, D, H]], 200, 168);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r) => { const [o, i] = rings(x0, y0, x1, y1, r, 0.4); put(s, prism(P, front, o, i, z0, z1)); };

  const floor = solid(g); box(floor, 0, 0, W, D, 0, 2, 2);
  const back = solid(g); box(back, 0, 0, W, 2, 2, H, 0.6);
  const left = solid(g); box(left, 0, 0, 2, D, 2, H, 0.6);
  const pleats = [];
  for (let k = 0; k < N; k++) pleats.push({ k, s: solid(g), x: tween(REST[k]), last: NaN });
  const post = solid(g); box(post, W - 2, D - 2, W, D, 2, H, 0.6);
  const rail = solid(g); box(rail, 0, D - 2, W, D, H - 2, H, 0.6);

  const R = register(stage, (_dt, now) => {
    let moving = false;
    pleats.forEach((p) => {
      const x = tval(p.x, now);
      if (x !== p.last) { p.last = x; const y = CY + (p.k % 2 ? 1.6 : 0); box(p.s, x, y - 1, x + PW, y + 0.4, 4, H - 3, 0.5); }
      if (!tdone(p.x, now)) moving = true;
    });
    return moving;
  });
  bag.add(R.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 31);
    if (x < -14 || x > W + 14 || y < -30 || y > D + 30) return -1;
    return clamp(Math.round((x - 2) / 6.2), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if ((a < 0) === (act < 0) && act !== -2) return;
    const now = performance.now();
    act = a;
    pleats.forEach((p) => {
      tset(p.x, a < 0 ? REST[p.k] : OPEN[p.k], now, a < 0 ? 0 : Math.abs(p.k - a) * stag);
      p.s.sil.classList.toggle("hi", p.k === N - 1);
    });
    read.textContent = a < 0 ? "rest" : "open";
    R.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fittingroom",
  means: "A fitting room booth: the pointer over it draws the pleated curtain open along the rail, bunching at the post.",
  rules: [1, 2, 4, 5],
  range: [0, 40, 80],
  tour: [[170, 180], [200, 172], [230, 165], null],
  mount,
});
