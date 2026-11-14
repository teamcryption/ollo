/**
 * Balconies: a block's facade with three floors of three balconies, each a
 * slab with a glass rail before a door. The pointer picks a balcony by where
 * it sits on the wall: its slab slides out from the facade, and the ones
 * beside it ease out a little, staggered. At rest one balcony stands out, bright.
 * The slider is the stagger.
 *
 * The pattern: grid on a face plane (depositboxes).
 */
const {
  Cam, fit, fillet, poly, prism, proj, rings, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 3, ROWS = 3, CW = 40, FH = 28, BW = 28, W = COLS * CW + 8, H = ROWS * FH + 34, FAV = 4;
const REST = [7, 5, 9, 6, 15, 5, 8, 6, 7], OUT = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, -10, 0], [W, -10, 0], [0, OUT + 2, 0], [W, OUT + 2, 0], [0, -10, H], [W, -10, H], [W, OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, -10, W, 0, 2, 1);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const quad = (x0, x1, z0, z1, r) => poly(fillet([P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)], [r, r, r, r]));
  // the street door
  mk("path", { d: quad(W / 2 - 9, W / 2 + 9, 0, 22, 2), class: "nf lo" }, g);

  const items = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const k = r * COLS + c, x0 = 4 + c * CW + (CW - BW) / 2, x1 = x0 + BW, zf = 30 + r * FH;
    mk("path", { d: quad(x0 + 7, x1 - 7, zf + 2, zf + 21, 1.5), class: "nf lo" }, g);
    items.push({ k, r, c, x0, x1, zf, zt: zf, d: tween(REST[k]), last: NaN });
  }
  // lower floors first, then left to right: the near ones cover the far
  for (const it of items) {
    it.grp = mk("g", {}, g);
    it.slab = solid(it.grp); it.rail = solid(it.grp);
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const [sr, si] = rings(it.x0, 0, it.x1, d, 1.5, 0.6);
    put(it.slab, prism(P, front, sr, si, it.zf, it.zf + 2.2));
    const [rr, ri] = rings(it.x0, d - 1.4, it.x1, d, 0.6, 0.3);
    put(it.rail, prism(P, front, rr, ri, it.zf + 2.2, it.zf + 12));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, 0, it.zf + 9));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 1.3); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, at = items[a];
    act = a;
    items.forEach((it, k) => {
      const dd = at ? Math.abs(it.r - at.r) + Math.abs(it.c - at.c) : 0;
      const d = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 9 : 5;
      const f = items[from];
      tset(it.d, d, now, f ? (Math.abs(it.r - f.r) + Math.abs(it.c - f.c)) * stag : 0);
      const on = k === (a < 0 ? FAV : a);
      it.slab.sil.classList.toggle("hi", on); it.rail.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "flat " + (at.r + 1) + "·" + (at.c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "balconies",
  means: "A facade of nine balconies: the one under the pointer slides out from the wall, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[241, 180], [154, 170], [199, 110], null],
  mount,
});
