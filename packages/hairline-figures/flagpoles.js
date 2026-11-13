/**
 * Flagpoles: a plaza slab with four poles of one height, each on a small
 * plinth with a ball finial, and a plain flag on each, a rectangle with one
 * fold line. The pointer picks a pole by where it stands: its flag runs up
 * to the top, and the flags beside it rise partway, staggered from it. At
 * rest the flags fly at uneven heights, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the pole
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fillet, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, SP = 26, H = 80, FW = 26, FH = 16, R = 1.3, TOPZ = H - FH - 3;
const REST = [30, 50, 20, 38], FAV = 1;
const ys = Array.from({ length: N }, (_, k) => (N - 1 - k) * SP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  const Y1 = (N - 1) * SP;
  fit(C, [[-12, -12, -4], [FW + 12, Y1 + 12, -4], [FW + 12, -12, -4], [-12, Y1 + 12, -4], [0, 0, H + 3], [0, Y1, H + 3], [FW, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-12, -12, FW + 12, Y1 + 12, 5, 1.6);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  mk("path", { class: "nf lo", d: seg(P(-12, Y1 / 2 - SP / 2, 0), P(FW + 12, Y1 / 2 - SP / 2, 0)) + seg(P(-12, Y1 / 2 + SP / 2, 0), P(FW + 12, Y1 / 2 + SP / 2, 0)) }, g);

  // far to near: the pole with the smallest y first, each pole before its own flag
  const order = ys.map((y, k) => k).sort((a, b) => ys[a] - ys[b]);
  const flags = [];
  for (const k of order) {
    const y = ys[k];
    const box = (h, r, z0, z1, b) => { const [a, i] = rings(-h, y - h, h, y + h, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
    box(4, 1.8, 0, 3, 0.8);
    box(R, R, 3, H, 0.4);
    box(2.2, 2.2, H, H + 3, 0.7);
    const grp = mk("g", {}, g);
    flags[k] = { k, y, sil: mk("path", { class: "sil" }, grp), fold: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN };
  }

  function draw(f, z) {
    if (z === f.last) return;
    f.last = z;
    const x0 = R + 0.3, x1 = R + FW, sag = 1.6;
    const pts = fillet([[x0, z], [x1, z - sag], [x1, z + FH - sag], [x0, z + FH]], [0.6, 1.2, 1.2, 0.6], 3);
    f.sil.setAttribute("d", poly(pts.map(([x, zz]) => P(x, f.y, zz))));
    const xm = (x0 + x1) / 2;
    f.fold.setAttribute("d", seg(P(xm, f.y, z - sag / 2 + 1), P(xm, f.y, z + FH - sag / 2 - 1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of flags) { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The pole whose resting middle is nearest the pointer's x on screen; -1 off the plaza. */
  const mids = ys.map((y) => P(FW / 2, y, H / 2));
  const top = P(0, 0, H + 6)[1], foot = P(FW + 12, Y1 + 12, 0)[1];
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && sy > top && sy < foot ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    flags.forEach((f, k) => {
      const d = Math.abs(k - a);
      const z = a < 0 ? REST[k] : d === 0 ? TOPZ : Math.max(REST[k], TOPZ - 8 - 10 * d);
      tset(f.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      f.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flagpoles",
  means: "Four flagpoles on a plaza: the flag under the pointer runs up to the top, and the flags beside it rise partway.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[146, 184], [218, 118], [254, 130], null],
  mount,
});
