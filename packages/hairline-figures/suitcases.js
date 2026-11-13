/**
 * Suitcases: five hard-shell cases standing in a row, cabin to large, each
 * with ribbed shells, two wheels and a telescopic handle. The pointer picks a
 * case by where it stands: its handle runs up and the case rolls forward a
 * little, and the handles beside it rise less, staggered from it. At rest one
 * handle is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the case
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const CASES = [[22, 13, 40], [28, 16, 52], [24, 14, 46], [32, 18, 60], [22, 13, 38]]; // width, depth, height
const GAPX = 7, UP = 26, ROLL = 8, FAV = 1;
const xs = []; { let x = 0; for (const [w] of CASES) { xs.push(x); x += w + GAPX; } }
const X1 = xs[xs.length - 1] + CASES[CASES.length - 1][0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-4, -4, 0], [X1 + 4, 30 + ROLL, 0], [X1 + 4, -4, 0], [-4, 30 + ROLL, 0], [0, 0, 60 + UP + 4], [X1, 0, 60 + UP + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const cases = CASES.map(([w, d, h], k) => {
    const grp = mk("g", {}, g);
    const rods = mk("path", { class: "nf" }, grp), grip = solid(grp), body = solid(grp);
    const ribs = mk("path", { class: "nf lo" }, body.g);
    const wheels = [0, 1].map(() => mk("circle", { r: 1.8, class: "dot m" }, grp));
    return { k, w, d, h, x0: xs[k], grp, rods, grip, body, ribs, wheels, up: tween(k === FAV ? UP : 3), y: tween(0), last: "" };
  });

  function draw(c, up, y) {
    const key = up.toFixed(2) + "," + y.toFixed(2);
    if (key === c.last) return;
    c.last = key;
    const y0 = y, y1 = y + c.d, x0 = c.x0, x1 = c.x0 + c.w, z0 = 3;
    // the handle: two rods from the back of the top, a grip across them
    const ym = y0 + 2.5, hx0 = x0 + c.w * 0.3, hx1 = x1 - c.w * 0.3;
    c.rods.setAttribute("d", seg(P(hx0, ym, z0 + c.h - 1), P(hx0, ym, z0 + c.h + up)) + seg(P(hx1, ym, z0 + c.h - 1), P(hx1, ym, z0 + c.h + up)));
    const [gr, gi] = rings(hx0 - 1.5, ym - 1.6, hx1 + 1.5, ym + 1.6, 1.4, 0.5);
    put(c.grip, prism(P, front, gr, gi, z0 + c.h + up, z0 + c.h + up + 3));
    const [r, i] = rings(x0, y0, x1, y1, 4, 1.6);
    put(c.body, prism(P, front, r, i, z0, z0 + c.h));
    // ribs down the front shell, and the wheels under its front corners
    let d = "";
    for (const t of [0.3, 0.5, 0.7]) d += seg(P(x0 + c.w * t, y1, z0 + 5), P(x0 + c.w * t, y1, z0 + c.h - 5));
    c.ribs.setAttribute("d", d);
    place(c.wheels[0], P(x0 + 3, y1 - 2, 1.4)); place(c.wheels[1], P(x1 - 3, y1 - 2, 1.4));
  }

  // a case rolled toward the reader paints after its neighbours
  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cases) { draw(c, tval(c.up, now), tval(c.y, now)); if (!tdone(c.up, now) || !tdone(c.y, now)) moving = true; }
    const order = cases.slice().sort((a, b) => a.x0 + tval(a.y, now) * 2.2 - (b.x0 + tval(b.y, now) * 2.2));
    const key = order.map((c) => c.k).join();
    if (key !== painted) { painted = key; for (const c of order) g.appendChild(c.grp); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cases.map((c) => P(c.x0 + c.w / 2, c.d, c.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cases.forEach((c, k) => {
      const dd = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.up, a < 0 ? (k === FAV ? UP : 3) : dd === 0 ? UP : dd === 1 ? 11 : 3, now, delay);
      tset(c.y, a === k ? ROLL : 0, now, delay);
      c.grip.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      c.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "case " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "suitcases",
  means: "Five suitcases in a row: the one under the pointer runs its handle up and rolls forward, and its neighbours follow.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[130, 170], [200, 190], [265, 215], null],
  mount,
});
