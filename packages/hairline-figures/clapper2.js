/**
 * Script stack: six bound scripts piled a little askew, each a thin plate
 * with two brass brads along its spine. The pointer picks a script by which
 * cover or edge it is over: that script slides out of the pile towards the
 * viewer, the ones near it shift a little after it, staggered by distance.
 * At rest one script already sticks out, lit. The slider is the stagger.
 *
 * The pattern: stepped parts; the hit unprojects onto each script's own rest
 * top and takes the one whose middle is nearest.
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 6, W = 32, D = 42, T = 3.8, OUT = 24, FAV = 3;
const DX = [0, 3, -2, 4, 1, -3], DY = [1, -2, 2, 0, -1, 2], REST = [0, 0, 0, 8, 0, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[-4, -4, 0], [W + 6 + OUT, D + 4, 0], [W + 6 + OUT, -4, 0], [-4, D + 4, 0], [0, 0, N * T], [W, D, N * T]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const sc = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    const b = [flatDot(s.g, C, 1.1, "dot off"), flatDot(s.g, C, 1.1, "dot off")];
    sc.push({ k, s, b, z0: k * T, x: tween(REST[k]), last: NaN });
  }

  function draw(t, dx) {
    if (dx === t.last) return;
    t.last = dx;
    const x0 = DX[t.k] + dx, y0 = DY[t.k];
    const [o, i] = rings(x0, y0, x0 + W, y0 + D, 2.2, 0.9);
    put(t.s, prism(P, front, o, i, t.z0, t.z0 + T - 0.4));
    place(t.b[0], P(x0 + 4, y0 + D * 0.25, t.z0 + T - 0.4));
    place(t.b[1], P(x0 + 4, y0 + D * 0.75, t.z0 + T - 0.4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    sc.forEach((t) => { draw(t, tval(t.x, now)); if (!tdone(t.x, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each script's own rest top, nearest middle wins, top script first on ties
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    for (let k = N - 1; k >= 0; k--) {
      const [x, y] = unproj(C, sx, sy, k * T + T);
      const x0 = DX[k] + REST[k], y0 = DY[k];
      if (x < x0 - 2 || x > x0 + W + 2 || y < y0 - 2 || y > y0 + D + 2) continue;
      const d = Math.hypot(x - x0 - W / 2, y - y0 - D / 2) + (N - 1 - k) * 6;
      if (d < bd) { bd = d; best = k; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sc.forEach((t, k) => {
      const d = from < 0 ? 0 : Math.abs(k - from);
      const dx = a < 0 ? REST[k] : k === a ? OUT : Math.max(0, 5 - 2 * Math.abs(k - a));
      tset(t.x, dx, now, d * stag);
      t.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "script " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "clapper2",
  means: "A stack of bound scripts: the one under the pointer slides out of the pile and its neighbours shift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[169, 106], [231, 123], [153, 199], null],
  mount,
});
