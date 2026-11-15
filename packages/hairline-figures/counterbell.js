/**
 * Queue ticket: a take-a-number dispenser, a round-cornered housing on a
 * post and foot, with a roll of paper tickets feeding out of its mouth.
 * The pointer over it pulls the tickets: they slide out long, the nearest
 * first, the others after it. At rest a short stub of each shows, the top
 * one bright. The slider is the stagger.
 *
 * The pattern: a short stack answering in order; the hit is on the ground.
 */
const { Cam, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 26, D = 22, Z0 = 20, Z1 = 44, REST = [6, 3, 8], OUT = [34, 26, 18], TZ = [36, 32, 28];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.8);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D + 36, 30], [W, D + 36, 26], [0, 0, Z1], [W, D, Z1]], 200, 168);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r) => { const [o, i] = rings(x0, y0, x1, y1, r, 0.6); put(s, prism(P, front, o, i, z0, z1)); };

  const foot = solid(g); box(foot, 2, 2, W - 2, D - 2, 0, 3, 8);
  const post = solid(g); box(post, W / 2 - 3, D / 2 - 3, W / 2 + 3, D / 2 + 3, 3, Z0, 3);
  const body = solid(g); box(body, 0, 0, W, D, Z0, Z1, 10);
  const tk = TZ.map((z, k) => ({ k, z, s: solid(g), y: tween(REST[k]), last: NaN })).reverse();

  const R = register(stage, (_dt, now) => {
    let moving = false;
    tk.forEach((t) => {
      const y = tval(t.y, now);
      if (y !== t.last) { t.last = y; box(t.s, 5 + t.k, D - 4, W - 5 - t.k, D + y, t.z, t.z + 1.2, 1); }
      if (!tdone(t.y, now)) moving = true;
    });
    return moving;
  });
  bag.add(R.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 32);
    return x > -12 && x < W + 12 && y > -24 && y < D + 40 ? 0 : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tk.forEach((t) => tset(t.y, a < 0 ? REST[t.k] : OUT[t.k], now, t.k * stag));
    tk.forEach((t) => t.s.sil.classList.toggle("hi", t.k === 0));
    read.textContent = a < 0 ? "rest" : "no. 42";
    R.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "counterbell",
  means: "A take-a-number dispenser: the pointer over it pulls the paper tickets out of its mouth, one after another.",
  rules: [1, 2, 4, 5],
  range: [0, 60, 120],
  tour: [[230, 140], [248, 131], [262, 122], null],
  mount,
});
