/**
 * Clothes rack: seven shirts on hangers along a rail on two stands, each a
 * flat shirt with sleeves and a collar notch under a wire hanger. The pointer
 * picks a shirt by where it hangs: it swings out toward the reader on its
 * hook, and the shirts beside it slide apart along the rail, staggered from
 * it. At rest one shirt is swung out a little, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle), hanging.
 */
const {
  Cam, fillet, fit, facing, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 13, RZ = 86, SW = 34, SWING = 32, PART = 7, FAV = 4;
const X1 = (N - 1) * STEP + 24;
// a shirt in its own plane: w across (centred), d down from the hook
const SHIRT = fillet([
  [-6, 10], [-3, 12], [3, 12], [6, 10], [16, 14], [20, 26], [14, 28], [12, 22], [12, 60], [-12, 60], [-12, 22], [-14, 28], [-20, 26], [-16, 14],
], [1, 2, 2, 1, 3, 2, 2, 1, 2, 2, 1, 2, 2, 3]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-12, -14, 0], [X1 + 12, SW, 0], [X1 + 12, -14, 0], [-12, SW, 0], [-12, 0, RZ + 6], [X1 + 12, 0, RZ + 6], [X1, 36, RZ - 50]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // two stands and the rail
  for (const x of [-10, X1 + 6]) {
    const [fr, fi] = rings(x - 6, -14, x + 10, 14, 3, 1); put(solid(g), prism(P, front, fr, fi, 0, 3));
    const [pr, pi] = rings(x, -1.5, x + 3, 1.5, 1, 0.4); put(solid(g), prism(P, front, pr, pi, 3, RZ + 2));
  }
  const [rr, ri] = rings(-10, -1.4, X1 + 9, 1.4, 1.2, 0.5);
  const railEl = solid(g);
  put(railEl, prism(P, front, rr, ri, RZ, RZ + 2.4));

  const shirts = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const hanger = mk("path", { class: "nf" }, grp), placket = mk("path", { class: "nf lo" }, grp);
    shirts.push({ k, x: 12 + k * STEP, grp, back, face, hanger, placket, a: tween(k === FAV ? SWING * 0.45 : 0), dx: tween(0), last: "" });
  }
  g.appendChild(railEl.g);

  function draw(s, a, dx) {
    const key = a.toFixed(2) + "," + dx.toFixed(2);
    if (key === s.last) return;
    s.last = key;
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), x = s.x + dx;
    // the shirt hangs in the plane x = const and swings about the rail (the x axis) toward +y
    const w = (u, d, off = 0) => P(x + off, u * ca + d * sa, RZ - 4 - (d * ca - u * sa * 0));
    s.face.setAttribute("d", poly(SHIRT.map(([u, d]) => w(u, d))));
    s.back.setAttribute("d", poly(SHIRT.map(([u, d]) => w(u, d, -1))));
    s.hanger.setAttribute("d", open([P(x, 0, RZ + 3), P(x, 0, RZ + 1), w(-15, 12), w(15, 12), P(x, 0, RZ + 1)]));
    s.placket.setAttribute("d", seg(w(0, 13), w(0, 58)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of shirts) { draw(s, tval(s.a, now), tval(s.dx, now)); if (!tdone(s.a, now) || !tdone(s.dx, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = shirts.map((s) => P(s.x, 0, RZ - 34));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 12 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    shirts.forEach((s, k) => {
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(s.a, a < 0 ? (k === FAV ? SWING * 0.45 : 0) : k === a ? SWING : 0, now, delay);
      tset(s.dx, a < 0 ? 0 : k < a ? -PART * Math.max(0, 1 - (a - k - 1) * 0.5) : k > a ? PART * Math.max(0, 1 - (k - a - 1) * 0.5) : 0, now, delay);
      s.face.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "shirt " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "clothesrack",
  means: "Seven shirts on a rail: the one under the pointer swings out toward you, and the shirts beside it slide apart.",
  rules: [1, 2, 5, 10],
  range: [0, 40, 80],
  tour: [[164, 123], [212, 147], [261, 172], null],
  mount,
});
