/**
 * Linen cupboard: a tall cupboard with three open shelves, a stack of folded
 * towels on each. The pointer picks a shelf by its rest height and that
 * stack slides out towards the reader; the stacks beside it ease out a
 * little, staggered from it. At rest the middle stack stands proud, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 40, H = 138, ROWS = [10, 52, 94], SH = 34, OUT = 20, FAV = 1, TH = 6.5;
const SHIFT = [[0, 0], [3, 1], [-2, -1], [1, 0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT, 0], [W, D + OUT, 0], [0, 0, H], [W, 0, H], [0, D + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const quad = (x0, z0, x1, z1, y) => [P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)];
  for (const z of ROWS) mk("path", { d: poly(quad(7, z - 2, W - 7, z + SH, D)), class: "nf lo" }, g);
  mk("path", { d: poly(quad(7, 2, W - 7, 6, D)), class: "nf lo" }, g);

  const items = ROWS.map((z, k) => {
    const grp = mk("g", {}, g), towels = [];
    const n = k === 1 ? 4 : 3;
    for (let t = 0; t < n; t++) {
      const s = solid(grp);
      towels.push({ s, z0: z + t * TH, sx: SHIFT[(t + k) % 4][0], sy: SHIFT[(t + k) % 4][1], w: t % 2 ? 2 : 0 });
    }
    return { k, z, grp, towels, y: tween(k === FAV ? OUT * 0.55 : 0), last: NaN };
  });

  function draw(it, y) {
    if (y === it.last) return;
    it.last = y;
    for (const t of it.towels) {
      const [r, i] = rings(14 + t.sx + t.w, 8 + y + t.sy, W - 14 + t.sx - t.w, D - 1 + y + t.sy, 3, 1.4);
      put(t.s, prism(P, front, r, i, t.z0, t.z0 + TH - 0.6));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(W / 2, D, it.z + SH / 2));
  const lx = P(0, D, 0)[0] - 20, rx = P(W, D, 0)[0] + 30;
  function hit([sx, sy]) {
    if (sx < lx || sx > rx) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy + (sx - m[0]) * 0.5); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const lit = a < 0 ? FAV : a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 4 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.towels.forEach((t) => t.s.sil.classList.toggle("hi", k === lit));
    });
    g.appendChild(items[lit].grp);
    read.textContent = a < 0 ? "rest" : "shelf " + (3 - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bedlinen",
  means: "A linen cupboard with three shelves of folded towels: the stack under the pointer slides out, its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[189, 118], [189, 173], [189, 228], null],
  mount,
});
