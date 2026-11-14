/**
 * Property signs: three yard signs in a row, each an L-shaped post with a
 * panel hanging from its arm. The pointer picks a sign by where it stands:
 * its panel swings out on the arm, and the panels beside it sway a little,
 * staggered from it. At rest the middle panel hangs swung, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, fillet, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, ARM = 34, ZA = 58, PL = 24, BZ = 3, FAV = 1, SWING = 55;
const REST = [-8, 24, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const X1 = (N - 1) * STEP + ARM + 4;
  fit(C, [[-10, -14, 0], [X1 + 6, 14, 0], [X1 + 6, -14, 0], [-10, 14, 0], [0, 0, ZA + 6], [X1, PL, ZA - 4]], 200, 168);
  const P = proj(C), front = () => true;
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-10, -14, X1 + 6, 14, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [pr, pi] = rings(x - 2, -2, x + 2, 2, 1.6, 0.7);
    put(solid(grp), prism(P, front, pr, pi, BZ, ZA + 5));
    const [ar, ai] = rings(x - 2, -1.5, x + ARM, 1.5, 1.4, 0.6);
    put(solid(grp), prism(P, front, ar, ai, ZA, ZA + 3));
    // two short hangers from the arm to the panel
    const hang = mk("path", { class: "nf lo" }, grp);
    const panel = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, x0: x + 4, x1: x + ARM - 2, hang, panel, face, a: tween(REST[k]), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), Z0 = ZA - 3;
    const pt = (x, t, h) => [x, t * s + h * c, Z0 - t * c + h * s];
    const pts = [];
    for (const x of [it.x0, it.x1]) for (const t of [0, PL]) for (const h of [-0.9, 0.9]) pts.push(P(...pt(x, t, h)));
    const hl = hull(pts);
    it.panel.setAttribute("d", poly(fillet(hl, hl.map(() => 1.4))));
    it.face.setAttribute("d", poly(fillet([pt(it.x0 + 3, 3, 0.9), pt(it.x1 - 3, 3, 0.9), pt(it.x1 - 3, PL - 3, 0.9), pt(it.x0 + 3, PL - 3, 0.9)].map((p) => P(...p)), [1, 1, 1, 1])));
    let d = "";
    for (const x of [it.x0 + 3, it.x1 - 3]) { const a0 = P(x, 0, ZA), a1 = P(...pt(x, 0, 0)); d += "M" + a0.join(",") + "L" + a1.join(","); }
    it.hang.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, 0, ZA - PL / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? REST[k] : dd === 0 ? SWING : dd === 1 ? 18 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.panel.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "forsalesigns",
  means: "Three yard signs on L-posts: the panel under the pointer swings out on its arm, and the panels beside it sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 107], [203, 138], [264, 169], null],
  mount,
});
