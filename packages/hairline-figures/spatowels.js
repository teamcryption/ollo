/**
 * Spa towels: a row of six rolled towels lying on a slatted shelf, each roll
 * showing the spiral of its wrap on its front end. The pointer picks a roll
 * by where it stands: it slides out toward the reader, and the rolls beside
 * it ease out a little, staggered from it. At rest the rolls sit unevenly
 * and one is half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the roll
 * whose resting front is nearest the pointer's x on screen. Paint order
 * follows depth, so a drawn roll goes over its neighbours.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, R = 7.2, STEP = 15.4, LEN = 34, OUT = 18, FAV = 3, X0 = 4;
const REST = [1.5, 3.4, 0.6, 9, 2.4, 0.9];
const X1 = X0 * 2 + (N - 1) * STEP + 2 * R;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, -4, -6], [X1, LEN + 6, -6], [X1, -4, -6], [0, LEN + OUT + 4, 0], [0, -4, 2 * R], [X1, -4, 2 * R]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the shelf: a board with its slats scored along the top, on two brackets
  for (const x of [10, X1 - 10]) { const [r, i] = rings(x - 2, -4, x + 2, LEN - 2, 1, 0.6); put(solid(g), prism(P, front, r, i, -16, -6)); }
  const [sr, si] = rings(0, -4, X1, LEN + 6, 2.5, 1.2);
  put(solid(g), prism(P, front, sr, si, -6, 0));
  mk("path", { d: [8, 18, 28].map((y) => seg(P(2, y, 0), P(X1 - 2, y, 0))).join(""), class: "nf lo" }, g);
  const rolls = mk("g", {}, g);

  const circle = (xc, y, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(xc + R * Math.cos(t), y, R + R * Math.sin(t)); });
  const items = REST.map((rest, k) => {
    const el = solid(rolls), wrap = mk("path", { class: "nf lo" }, el.g);
    return { k, xc: X0 + R + k * STEP, rest, el, wrap, y: tween(rest), last: NaN };
  });

  function draw(b, y) {
    if (y === b.last) return;
    b.last = y;
    const f = circle(b.xc, y + LEN);
    b.el.sil.setAttribute("d", poly(hull(circle(b.xc, y).concat(f))));
    b.el.cr.setAttribute("d", poly(f));
    const sp = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * 5 * Math.PI + 0.6, r = R * (0.16 + 0.74 * t); sp.push(P(b.xc + r * Math.cos(a), y + LEN, R + r * Math.sin(a))); }
    b.wrap.setAttribute("d", open(sp));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of items) { draw(b, tval(b.y, now)); if (!tdone(b.y, now)) moving = true; }
    const order = items.slice().sort((a, c) => a.xc + tval(a.y, now) * 1.4 - (c.xc + tval(c.y, now) * 1.4));
    const key = order.map((b) => b.k).join();
    if (key !== painted) { painted = key; for (const b of order) rolls.appendChild(b.el.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** The roll whose resting front is nearest the pointer's x on screen; -1 off the shelf. */
  const mids = items.map((b) => P(b.xc, LEN, R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((b, k) => {
      const d = Math.abs(k - a), y = a < 0 ? b.rest : d === 0 ? OUT : d === 1 ? 5 : d === 2 ? 2 : 0.6;
      tset(b.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roll " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spatowels",
  means: "Six rolled towels on a spa shelf: the roll under the pointer slides out toward you, and the rolls beside it ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[124, 138], [200, 170], [250, 201], null],
  mount,
});
