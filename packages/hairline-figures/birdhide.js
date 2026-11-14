/**
 * Bird hide: a timber hide on stilts over a wetland, with a row of viewing
 * hatches along its long wall. The pointer picks a hatch by where it stands:
 * its flap swings up and out on the top hinge, and the flaps beside it crack
 * open a little, staggered from it. At rest one flap is propped half open,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, fillet, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 96, Y1 = 40, Z0 = 16, Z1 = 52, N = 3, HW = 10, HT = 43, HH = 12, FAV = 1, OPEN = 84;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-24, -18, 0], [X1 + 24, Y1 + 30, 0], [X1 + 24, -18, 0], [-24, Y1 + 30, 0], [-6, -6, Z1 + 12], [X1 + 6, Y1 + 6, Z1 + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the wetland: a low bank with a waterline inside it
  const [wr, wi] = rings(-24, -18, X1 + 24, Y1 + 30, 14, 2);
  put(solid(g), prism(P, front, wr, wi, 0, 2));
  // stilts, far to near
  for (const [x, y] of [[6, 6], [X1 - 6, 6], [6, Y1 - 6], [X1 - 6, Y1 - 6]]) put(solid(g), prism(P, front, disc(x, y, 2.4), disc(x, y, 1.6), 2, Z0));
  // the cabin and its roof slab
  const [br, bi] = rings(0, 0, X1, Y1, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  mk("path", { d: `M${P(0, Y1, Z0 + 12).join(",")}L${P(X1, Y1, Z0 + 12).join(",")}`.replace(/,/g, " "), class: "nf lo" }, g);
  const [rr, ri] = rings(-6, -6, X1 + 6, Y1 + 6, 4, 1.6);
  put(solid(g), prism(P, front, rr, ri, Z1, Z1 + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 20 + k * 28, grp = mk("g", {}, g);
    const slot = [P(x - HW, Y1, HT), P(x + HW, Y1, HT), P(x + HW, Y1, HT - HH), P(x - HW, Y1, HT - HH)];
    mk("path", { d: poly(fillet(slot, [1.2, 1.2, 1.2, 1.2])), class: "lo" }, grp);
    const flap = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, flap, edge, a: tween(k === FAV ? OPEN * 0.6 : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const t = (a * Math.PI) / 180, dy = HH * Math.sin(t), dz = HH * Math.cos(t), th = 1.4;
    const ex = (o) => [P(it.x - HW, Y1 + o, HT), P(it.x + HW, Y1 + o, HT), P(it.x + HW, Y1 + o + dy, HT - dz), P(it.x - HW, Y1 + o + dy, HT - dz)];
    it.flap.setAttribute("d", poly(fillet(ex(0.4), [1, 1, 1, 1])));
    const b0 = P(it.x - HW, Y1 + 0.4 + dy + th * Math.cos(t), HT - dz - th * Math.sin(t) * 0), b1 = P(it.x + HW, Y1 + 0.4 + dy + th * Math.cos(t), HT - dz);
    it.edge.setAttribute("d", a > 2 ? `M${b0[0]} ${b0[1]}L${b1[0]} ${b1[1]}` : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y1, HT - HH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? OPEN * 0.6 : 0) : dd === 0 ? OPEN : dd === 1 ? 34 : 0;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.flap.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hatch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "birdhide",
  means: "A bird hide on stilts over a wetland: the hatch under the pointer swings its flap up, and its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 139], [183, 159], [242, 198], null],
  mount,
});
