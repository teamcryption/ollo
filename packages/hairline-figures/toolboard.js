/**
 * Tool pegboard: a perforated board on the garage wall with hand tools
 * hanging from its pegs, a screwdriver, a chisel, a file, an awl, a punch.
 * The pointer picks a tool by where it stands: it slides up off its peg and
 * out toward you, and the tools beside it stir, staggered from it. At rest
 * one tool is half off its peg, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 130, H = 86, TY = 7, OUT = 16, UP = 8, FAV = 2;
// [handle radius, handle length, shaft radius, shaft length]
const TOOLS = [[4.2, 22, 1.4, 30], [3.6, 18, 2.4, 22], [3.2, 16, 2.8, 36], [3, 14, 1, 26], [3.8, 16, 1.8, 18]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -4, 0], [W, -4, 0], [W, TY + OUT + 5, 0], [0, TY + OUT + 5, 0], [0, -4, H], [W, -4, H], [W, TY + OUT + 5, H + UP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the board, a thin slab on the wall, with its holes and a foot rail
  const [br, bi] = rings(0, -4, W, 0, 1.6, 0.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  for (let i = 0; i < 12; i++) for (let j = 0; j < 8; j++) {
    const [sx, sy] = P(8 + i * 10.4, 0, 8 + j * 10.2);
    mk("circle", { cx: sx, cy: sy, r: 0.9, class: "dot off" }, g);
  }
  const [rr, ri] = rings(-3, -4, W + 3, 6, 2, 1);
  put(solid(g), prism(P, front, rr, ri, 0, 4));

  const items = TOOLS.map(([hr, hl, sr, sl], k) => {
    const x = 16 + k * 24.5, top = H - 10, grp = mk("g", {}, g);
    // the peg: a short rod out of the board
    put(solid(grp), prism(P, front, [...disc(x, 2, 1.1, 12)].map((q) => q), disc(x, 2, 0.6, 12), top + 1, top + 2.6));
    const shaft = solid(grp), handle = solid(grp);
    return { k, x, hr, hl, sr, sl, top, shaft, handle, t: tween(k === FAV ? 0.55 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const y = TY + OUT * t, z1 = it.top + UP * t, z0 = z1 - it.hl, y2 = y;
    put(it.handle, prism(P, front, disc(it.x, y, it.hr), disc(it.x, y, it.hr - 1.2), z0, z1));
    put(it.shaft, prism(P, front, disc(it.x, y2, it.sr, 16), disc(it.x, y2, Math.max(0.3, it.sr - 0.6), 16), z0 - it.sl, z0));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, TY, it.top - 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.55 : 0) : dd === 0 ? 1 : dd === 1 ? 0.18 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.handle.sil.classList.toggle("hi", on);
      it.shaft.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "peg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toolboard",
  means: "Hand tools on a garage pegboard: the tool under the pointer slides up off its peg and out, its neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 122], [206, 152], [267, 183], null],
  mount,
});
