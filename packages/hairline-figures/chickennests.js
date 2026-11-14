/**
 * Egg boxes nest: four wooden nest boxes in a row on a ledge, each filled
 * with straw and holding an egg. The pointer picks a box by where it
 * stands: its egg lifts out of the straw, and the eggs beside it rise a
 * little, staggered from it. At rest one egg is raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 42, W = 36, H = 24, LIFT = 26, FAV = 2, LZ = 4, ER = 8, EH = 21;
const X1 = (N - 1) * STEP + W;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-5, -5, 0], [X1 + 5, W + 5, 0], [X1 + 5, -5, 0], [-5, W + 5, 0], [W / 2, W / 2, LZ + H + LIFT + EH], [X1 - W / 2, W / 2, LZ + H + LIFT + EH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-5, -5, X1 + 5, W + 5, 4, 1.6);
  put(solid(g), prism(P, front, lr, li, 0, LZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cx = x0 + W / 2, cy = W / 2, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x0 + W, W, 3, 1.4);
    put(solid(grp), prism(P, front, br, bi, LZ, LZ + H));
    // the opening and the straw bed inside it
    const [or] = rings(x0 + 3, 3, x0 + W - 3, W - 3, 2, 1);
    mk("path", { d: poly(ringAt(P, or, LZ + H)), class: "nf lo" }, grp);
    const straw = [];
    for (let s = 0; s < 3; s++) {
      const a = P(x0 + 7 + s * 8, 8 + s * 6, LZ + H), b = P(x0 + 15 + s * 7, 12 + s * 5, LZ + H);
      straw.push("M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + "L" + b[0].toFixed(2) + " " + b[1].toFixed(2));
    }
    mk("path", { d: straw.join(""), class: "nf lo" }, grp);
    const egg = mk("path", { class: "sil" }, grp);
    items.push({ k, cx, cy, egg, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const base = LZ + H - 3 + lift, pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * Math.PI, z = base + EH * (1 - Math.cos(t)) / 2;
      const r = ER * Math.sin(t) * (1 - 0.18 * (1 - Math.cos(t)) / 2) + 0.01;
      pts.push(...ringAt(P, disc(it.cx, it.cy, r), z));
    }
    it.egg.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, it.cy, LZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.egg.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chickennests",
  means: "Four straw-filled nest boxes in a row: the egg under the pointer lifts out of its box, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[115, 144], [176, 174], [285, 228], null],
  mount,
});
