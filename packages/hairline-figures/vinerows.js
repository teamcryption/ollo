/**
 * Vine rows: five trellised rows of vines on a slab of ground, each row a
 * rounded canopy on short trunks with grape clusters along its near side.
 * The pointer picks a row by where it stands: its canopy grows up off the
 * trellis and its grapes ripen, the rows beside it rising a little,
 * staggered from it. At rest one row stands tall, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 28, W = 5, L = 112, H0 = 10, GROW = 16, FAV = 2;
const REST = [11, 13, 15, 12, 10];
const TR = [10, 32, 56, 80, 102];
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  const X1 = (N - 1) * STEP;
  fit(C, [[-W - 8, -6, 0], [X1 + W + 8, L + 6, 0], [X1 + W + 8, -6, 0], [-W - 8, L + 6, 0], [0, 0, H0 + 15 + GROW], [X1, L, H0 + 15 + GROW]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-W - 8, -6, X1 + W + 8, L + 6, 6, 2);
  put(solid(g), prism(P, front, gr, gi, -3, 0));

  const rows = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    for (const y of TR) put(solid(grp), prism(P, front, disc(x, y, 1.6), disc(x, y, 0.8), 0, H0 + 1));
    const can = solid(grp);
    const grapes = TR.slice(0, 4).map((y) => mk("ellipse", { rx: 1.7, ry: 1.7, class: "dot off" }, grp));
    rows.push({ k, x, can, grapes, z: tween(REST[k] + (k === FAV ? 4 : 0)), last: NaN });
  }
  const [cring, cin] = rings(-W, 2, W, L - 2, 4, 1.4);
  const shift = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx }));
  const rr = rows.map((r) => [shift(cring, r.x), shift(cin, r.x)]);

  function draw(r, h) {
    if (h === r.last) return;
    r.last = h;
    put(r.can, prism(P, front, rr[r.k][0], rr[r.k][1], H0, H0 + h));
    r.grapes.forEach((e, i) => {
      const [sx, sy] = P(r.x + W + 0.5, TR[i] + 11, H0 + 1.5);
      e.setAttribute("cx", sx.toFixed(2)); e.setAttribute("cy", sy.toFixed(2));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rows) { draw(r, tval(r.z, now)); if (!tdone(r.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    rows.forEach((r) => {
      for (const zt of [H0 + REST[r.k] / 2]) {
        const [wx, wy] = unproj(C, sx, sy, zt);
        if (wy < -4 || wy > L + 4) continue;
        const dd = Math.abs(wx - r.x);
        if (dd < W + 7 && dd < bd) { bd = dd; best = r.k; }
      }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rows.forEach((r) => {
      const dd = Math.abs(r.k - a);
      const h = a < 0 ? REST[r.k] + (r.k === FAV ? 4 : 0) : dd === 0 ? REST[r.k] + GROW : dd === 1 ? REST[r.k] + 4 : REST[r.k];
      tset(r.z, h, now, from < 0 ? 0 : Math.abs(r.k - from) * stag);
      r.can.sil.classList.toggle("hi", r.k === (a < 0 ? FAV : a));
      r.grapes.forEach((e) => e.setAttribute("class", r.k === a ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : "row " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "vinerows",
  means: "Five trellised vine rows: the row under the pointer grows its canopy up and ripens its grapes, the rows beside it rising a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 112], [200, 150], [200, 248], null],
  mount,
});
