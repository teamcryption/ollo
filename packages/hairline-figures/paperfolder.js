/**
 * Paper tray: three stacked letter trays on two back posts, each holding a
 * stack of sheets. The pointer picks a tier and it slides out towards the
 * reader with its paper; the tiers beside it follow a little, staggered by
 * distance. At rest the trays sit unevenly, the middle sheets bright. The
 * slider is how far a tray slides.
 *
 * The pattern: a discrete pick (tween per tier); the hit unprojects onto each
 * tier's rest top, so a sliding tray never moves its own hit area.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, tween, tset, tval, tdone,
  disposer, mk, put, register, solid, pointer,
} = HL;

const N = 3, H = 17, X0 = -30, X1 = 30, Y0 = -22, Y1 = 22;
const REST = [3, -2, 6], FAV = 1, FALL = [30, 10, 3];
const sh = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  const ext = [];
  for (const x of [X0, X1 + 36]) for (const y of [Y0, Y1]) for (const z of [0, N * H]) ext.push([x, y, z]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let amt = value;

  for (const y of [Y0 + 1, Y1 - 5]) {
    const [r, i] = rings(X0 + 1, y, X0 + 5, y + 4, 1.4, 0.6);
    put(solid(g), prism(P, front, r, i, 0, N * H - 2));
  }
  const TRAY = rings(X0, Y0, X1, Y1, 4, 1.6), PAPER = rings(X0 + 6, Y0 + 5, X1 - 5, Y1 - 5, 1.2, 0.9);
  const tiers = [];
  for (let i = 0; i < N; i++) {
    const z = i * H + 2, grp = mk("g", {}, g);
    const t = { i, z, tray: solid(grp), paper: solid(grp), tw: tween(REST[i]), drawn: NaN };
    tiers.push(t);
  }
  function draw(t, dx) {
    put(t.tray, prism(P, front, sh(TRAY[0], dx), sh(TRAY[1], dx), t.z, t.z + 3.5));
    put(t.paper, prism(P, front, sh(PAPER[0], dx), sh(PAPER[1], dx), t.z + 3.5, t.z + 8));
    t.drawn = dx;
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const t of tiers) {
      const v = tval(t.tw, now);
      if (Math.abs(v - t.drawn) > 1e-3) draw(t, v);
      if (!tdone(t.tw, now)) m = true;
    }
    return m;
  });
  bag.add(B.unregister);

  let a = -1;
  function retarget() {
    const now = performance.now();
    for (const t of tiers) {
      const d = Math.abs(t.i - a);
      tset(t.tw, a < 0 ? REST[t.i] : REST[t.i] + amt * FALL[Math.min(d, 2)], now, a < 0 ? 0 : d * 45);
      const on = a < 0 ? t.i === FAV : t.i === a;
      t.paper.sil.classList.toggle("hi", on);
    }
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  function pick(p) {
    for (let i = N - 1; i >= 0; i--) {
      const [x, y] = unproj(C, p[0], p[1], tiers[i].z + 8);
      if (x > X0 + REST[i] - 3 && x < X1 + REST[i] + 3 && y > Y0 - 3 && y < Y1 + 3) return i;
    }
    for (let i = 0; i < N; i++) {
      const [x, y] = unproj(C, p[0], p[1], tiers[i].z);
      if (x > X1 + REST[i] - 2 && x < X1 + REST[i] + 30 && y > Y0 && y < Y1) return i;
    }
    return -1;
  }
  bag.add(pointer(stage, {
    move: (p) => { const k = pick(p); if (k !== a) { a = k; retarget(); } },
    leave: () => { a = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  for (const t of tiers) draw(t, REST[t.i]);
  retarget();
  return {
    set: (v) => { amt = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "paperfolder",
  means: "Three stacked paper trays: the tier under the pointer slides out with its sheets, its neighbours following a little.",
  rules: [1, 2, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[186, 193], [186, 155], [186, 118], null],
  mount,
});
