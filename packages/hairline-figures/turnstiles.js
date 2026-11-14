/**
 * Turnstiles: a row of four waist-high cabinets on a slab, an arm reaching
 * from each across the lane beside it. The pointer picks a lane by where it
 * stands: that arm swings back along the lane to let you through, and the
 * arms beside it give a little, staggered from it. At rest one lane stands
 * open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 42, CW = 12, CD = 44, CH = 30, AZ = 24, AL = 30, FAV = 1, SZ = 4;
const X1 = (N - 1) * STEP + CW;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -8, 0], [X1 + 8, CD + 8, 0], [X1 + 8, -8, 0], [-8, CD + 8, 0], [0, 0, SZ + CH + 2], [X1, 0, SZ + CH + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -8, X1 + 8, CD + 8, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const cabs = [], arms = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cg = mk("g", {}, g);
    const [r, i] = rings(x0, 0, x0 + CW, CD, 4, 1.4);
    put(solid(cg), prism(P, front, r, i, SZ, SZ + CH));
    // the card reader: a slim plate on the cabinet's top, near the lane
    const [pr, pi] = rings(x0 + 3, CD / 2 - 6, x0 + CW - 3, CD / 2 + 6, 2, 0.8);
    put(solid(cg), prism(P, front, pr, pi, SZ + CH, SZ + CH + 1.4));
    const dot = flatDot(cg, C, 2.2, "dot off");
    place(dot, P(x0 + CW / 2, CD / 2, SZ + CH + 1.4));
    cabs.push({ cg, dot });
    if (k < N - 1) {
      const ag = mk("g", {}, g);
      const hub = mk("path", { class: "nf" }, ag), arm = mk("path", { class: "sil" }, ag);
      const px = x0 + CW + 1.5, py = CD / 2 + 4;
      hub.setAttribute("d", poly(hull(ringAt(P, disc(px, py, 3), SZ + AZ - 3).concat(ringAt(P, disc(px, py, 3), SZ + AZ + 4)))));
      arms.push({ k, px, py, ag, arm, a: tween(k === FAV ? 80 : 6 * k), last: NaN });
    }
  }
  // paint order: arm k sits between cabinet k and k+1
  for (let k = 0; k < N - 1; k++) cabs[k].cg.after(arms[k].ag);

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const ex = it.px + AL * Math.cos(rad(deg)), ey = it.py + AL * Math.sin(rad(deg));
    const z = SZ + AZ, pts = [];
    for (const zz of [z, z + 3.2]) pts.push(...ringAt(P, disc(it.px, it.py, 2.2), zz), ...ringAt(P, disc(ex, ey, 2.2), zz));
    it.arm.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of arms) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = arms.map((it) => P(it.px + AL / 2, it.py - 6, SZ + AZ / 2));
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
    const on = a < 0 ? FAV : a;
    arms.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? 80 : 6 * k) : dd === 0 ? 90 : dd === 1 ? 14 : 0;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.arm.classList.toggle("hi", k === on);
    });
    cabs.forEach((c, k) => c.dot.setAttribute("class", k === on ? "dot m" : "dot off"));
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "turnstiles",
  means: "A row of turnstiles: the arm in the lane under the pointer swings back to let you through, and the arms beside it give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 135], [199, 163], [255, 191], null],
  mount,
});
