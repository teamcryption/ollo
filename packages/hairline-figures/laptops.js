/**
 * Laptops: four laptops in a row on a long desk with two end panels, each a
 * thin base with a keyboard and a trackpad, its lid on a hinge at the back.
 * The pointer picks a laptop by where it stands: its lid opens fully and its
 * screen shows a few dim lines, and the lids beside it open partway,
 * staggered from it. At rest the lids stand at different angles, one open
 * and bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the laptop
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, facing, fillet, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 30, D = 22, STEP = 40, M = 9, L = 20, T = 1.3, BZ = 2, Y0 = 13, DY = 44, LEG = 30;
const X1 = 2 * M + (N - 1) * STEP + W;
const REST = [28, 104, 0, 64], FAV = 1, FALL = [112, 70, 38, 16];
const LID = fillet([[0, 0], [W, 0], [W, L], [0, L]], [0.6, 0.6, 2.2, 2.2], 3);
const SCR = fillet([[2.2, 2], [W - 2.2, 2], [W - 2.2, L - 2.2], [2.2, L - 2.2]], [1, 1, 1, 1], 2);
const LINES = [[5, 4, 14], [5, 7, 19], [5, 10, 11], [5, 13, 17]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, -LEG], [X1, DY, -LEG], [X1, 0, -LEG], [0, DY, -LEG], [0, 4, BZ + L + 2], [X1, 4, BZ + L + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the desk: two end panels, then the top over them
  for (const x of [7, X1 - 11]) { const [r, i] = rings(x, 5, x + 4, DY - 5, 1, 0.6); put(solid(g), prism(P, front, r, i, -LEG, -4)); }
  const [dr, di] = rings(0, 0, X1, DY, 3, 1.4);
  put(solid(g), prism(P, front, dr, di, -4, 0));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = M + k * STEP, grp = mk("g", {}, g);
    const [r, i] = rings(x0, Y0, x0 + W, Y0 + D, 2, 1);
    put(solid(grp), prism(P, front, r, i, 0, BZ));
    const keys = poly(ringAt(P, rrect(x0 + 3, Y0 + 3, x0 + W - 3, Y0 + 12, 1, 3), BZ));
    const pad = poly(ringAt(P, rrect(x0 + W / 2 - 5, Y0 + 14, x0 + W / 2 + 5, Y0 + 19.5, 1, 3), BZ));
    mk("path", { class: "nf lo", d: keys + pad }, grp);
    const lid = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, lid, face, a: tween(REST[k]), last: NaN });
  }

  // the lid: a thin plate turning about the hinge; o is the offset along its normal, 0 on the screen side
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
    const at = ([u, t], o) => P(it.x0 + u, Y0 + 1 + t * c - o * s, BZ + t * s + o * c);
    const inner = LID.map((q) => at(q, 0)), outer = LID.map((q) => at(q, T));
    it.lid.setAttribute("d", poly(hull(inner.concat(outer))));
    const screen = deg > 40;
    let d = poly(screen ? inner : outer);
    if (screen) d += poly(SCR.map((q) => at(q, 0)));
    if (deg > 95) for (const [u, t, w] of LINES) d += seg(at([u, L - t], 0), at([u + w, L - t], 0));
    it.face.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, Y0 + D / 2, BZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const deg = a < 0 ? REST[k] : FALL[Math.abs(k - a)];
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "laptop " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "laptops",
  means: "Four laptops on a desk: the lid under the pointer opens fully to a lit screen, and the lids beside it open partway.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[170, 141], [224, 168], [278, 195], null],
  mount,
});
