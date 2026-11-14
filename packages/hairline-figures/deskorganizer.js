/**
 * Desk organiser: a low tray with four cups of different heights, each cup
 * holding pens. The pointer picks a cup by where it stands: its pens lift
 * out, and the pens of the cups beside it rise a little, staggered from it.
 * At rest one cup's pens stand raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, W = 13, D = 26, LIFT = 26, FAV = 2, TZ = 4;
const HS = [30, 20, 38, 24];
const X1 = (N - 1) * STEP + 2 * W + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 8, 0], [X1 + 4, -4, 0], [-4, D + 8, 0], [STEP * 2 + W + 3, D / 2, TZ + 38 + 20 + LIFT], [W + 3, D / 2, TZ + 30 + 20 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, X1 + 4, D + 8, 5, 1.6);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const cups = [];
  for (let k = 0; k < N; k++) {
    const x0 = 3 + k * STEP, x1 = x0 + 2 * W, y0 = 2, y1 = y0 + D, h = HS[k], grp = mk("g", {}, g);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const [cr, ci] = rings(x0, y0, x1, y1, 4, 1.6);
    put(solid(grp), prism(P, front, cr, ci, TZ, TZ + h));
    const pens = [];
    const spots = [[cx - 5, cy - 6, 20], [cx + 4, cy - 1, 24], [cx - 2, cy + 7, 17]];
    for (const [px, py, len] of spots) {
      const s = solid(grp), [pr, pi] = rings(px - 1.6, py - 1.6, px + 1.6, py + 1.6, 1.6, 0.5);
      pens.push({ s, pr, pi, len });
    }
    cups.push({ k, cx, cy, h, pens, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const base = TZ + c.h - 6 + lift;
    for (const p of c.pens) put(p.s, prism(P, front, p.pr, p.pi, Math.max(TZ + c.h, base), base + p.len));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cups) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cups.map((c) => P(c.cx, c.cy, TZ + c.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cups.forEach((c, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const p of c.pens) p.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskorganizer",
  means: "A desk organiser of four cups: the pens in the cup under the pointer lift out, and the cups beside it raise theirs a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 142], [179, 174], [264, 216], null],
  mount,
});
