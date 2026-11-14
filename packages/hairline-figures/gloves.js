/**
 * Gloves: a boutique rack, a rail on two posts over a low plinth, with five
 * mittens clipped along it. The pointer picks a mitten by where it hangs: it
 * swings out toward the reader on its clip, and its neighbours sway a little,
 * staggered from it. At rest one mitten hangs half turned out, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, open, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 26, ZT = 60, SW = 55, FAV = 3, REST = [6, 2, 9, 32, 4];
const X1 = (N - 1) * STEP;
// a mitten, in its own plane: u across, w down from the clip
const MIT = fillet([[-8, 3], [8, 3], [8, 13], [12, 16], [12, 23], [8, 25], [8, 38], [-8, 38]], [3, 3, 2, 3, 3, 2, 2, 2], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -14, 0], [X1 + 14, 16, 0], [X1 + 14, -14, 0], [-14, 16, 0], [0, 0, ZT + 4], [X1, 40, ZT - 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-14, -14, X1 + 14, 16, 6, 2, 0, 5);
  box(-12, -3, -6, 3, 3, 1, 5, ZT + 3);
  box(X1 + 6, -3, X1 + 12, 3, 3, 1, 5, ZT + 3);
  box(-12, -2, X1 + 12, 2, 2, 0.8, ZT - 1, ZT + 3);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const plate = mk("path", { class: "sil" }, grp), cuff = mk("path", { class: "nf lo" }, grp);
    const clip = mk("path", { class: "" }, grp);
    items.push({ k, x, grp, plate, cuff, clip, a: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const s = Math.sin(rad(deg)), c = Math.cos(rad(deg));
    const W = (u, w) => P(it.x + u, w * s, ZT - 1 - w * c);
    it.plate.setAttribute("d", poly(MIT.map(([u, w]) => W(u, w))));
    it.cuff.setAttribute("d", open([W(-8, 30), W(8, 30)]) + open([W(-8, 32.5), W(8, 32.5)]).replace("M", " M"));
    it.clip.setAttribute("d", poly([W(-3, -1), W(3, -1), W(3, 6), W(-3, 6)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, ZT - 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? REST[k] : dd === 0 ? SW : dd === 1 ? 14 : 3;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.plate.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gloves",
  means: "Five mittens clipped along a boutique rack: the one under the pointer swings out on its clip, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 103], [201, 141], [277, 179], null],
  mount,
});
