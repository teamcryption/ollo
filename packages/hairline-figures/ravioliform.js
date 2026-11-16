/**
 * Ravioli press: three hinged ravioli plates in a row, each a base with four
 * pockets and a ridged lid hinged at its back edge. The pointer picks a plate
 * by where it stands: its lid swings open to show the pockets, and the lids
 * beside it open a crack, staggered from it. At rest one lid stands ajar,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a hinge per item.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 58, W = 46, D = 46, H = 7, T = 3, FAV = 1, OPEN = 1.42;
const REST = [0.14, 0.72, 0.3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[0, 0, 0], [X1, D, 0], [X1, 0, 0], [0, D, 0], [0, 0, H + W + 2], [X1 - W, D, H + W + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const [r, i] = rings(x0, 0, x0 + W, D, 4, 1.6);
    put(solid(grp), prism(P, front, r, i, 0, H));
    let d = "";
    for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const u = x0 + 6 + a * 19, v = 6 + b * 19;
      d += poly([P(u, v, H), P(u + 15, v, H), P(u + 15, v + 15, H), P(u, v + 15, H)]);
    }
    mk("path", { d, class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), ridge = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, lid, ridge, th: tween(REST[k]), last: NaN });
  }

  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const L = (u, v, w) => P(it.x0 + u * c - w * s, v, H + u * s + w * c);
    const pts = [];
    for (const u of [0, W]) for (const v of [0, D]) for (const w of [0, T]) pts.push(L(u, v, w));
    it.lid.setAttribute("d", poly(hull(pts)));
    it.ridge.setAttribute("d", poly([L(0, 0, T), L(W, 0, T), L(W, D, T), L(0, D, T)]) + seg(L(W / 2, 0, T), L(W / 2, D, T)) + seg(L(0, D / 2, T), L(W, D / 2, T)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.th, now)); if (!tdone(it.th, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D / 2, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), th = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 0.22 : 0;
      tset(it.th, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ravioliform",
  means: "Three ravioli presses in a row: the lid under the pointer swings open on its hinge to show the pockets.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 161], [200, 198], [274, 235], null],
  mount,
});
