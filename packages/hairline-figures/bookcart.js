/**
 * Library cart: a two-shelf cart on casters with a push handle at one end,
 * books standing on both shelves. The book under the pointer lifts out: on
 * the top shelf it rises clear, on the lower shelf it slides out toward the
 * reader. At rest one top-shelf book stands a little raised, bright. The
 * slider is how far a book comes out.
 *
 * The pattern: one of many in two rows (bookshelf); the pick is the book whose
 * resting middle on screen is nearest the pointer.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, D = 26, LO = 15, HI = 45, FAV = 4;
const SPEC = [[9, 24], [7, 21], [11, 26], [8, 22], [10, 25], [7, 20], [12, 20], [9, 17], [10, 21], [8, 18], [11, 19]];
const books = [];
{ let x = 3; SPEC.forEach(([w, h], k) => { if (k === 6) x = 4; const top = k < 6; books.push({ k, w, h, x0: x, top, z0: top ? HI : LO }); x += w + (top ? 2.2 : 3.5); }); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-3, 0, 0], [L + 3, D + 16, 0], [L + 3, 0, 0], [-3, D + 16, 0], [0, 0, HI + 26 + 16], [L, 0, HI + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => put(solid(g), prism(P, front, circ(2.6, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), null, 0, 4));
  wheel(-1.5, 1.5); wheel(-1.5, D - 1.5);
  box(-3, 0, 0, 3, 0.8, 0.4, 4, 66); box(-3, D - 3, 0, D, 0.8, 0.4, 4, 66);
  box(-3, 0, 0, D, 1, 0.5, 63, 66);
  box(0, 0, L, D, 2.5, 1.2, LO - 3, LO);
  const lowG = mk("g", {}, g);
  box(0, 0, L, D, 2.5, 1.2, HI - 3, HI);
  const topG = mk("g", {}, g);
  wheel(L + 1.5, 1.5); wheel(L + 1.5, D - 1.5);
  box(L, 0, L + 3, 3, 0.8, 0.4, 4, HI); box(L, D - 3, L + 3, D, 0.8, 0.4, 4, HI);

  for (const b of books) {
    b.el = solid(b.top ? topG : lowG);
    b.band = mk("path", { class: "nf lo" }, b.el.g);
    b.y = tween(0); b.z = tween(b.k === FAV ? 5 : 0); b.last = "";
  }
  function draw(b, y, z) {
    const key = y.toFixed(2) + "," + z.toFixed(2);
    if (key === b.last) return;
    b.last = key;
    const y0 = 4 + y, y1 = 22 + y, zb = b.z0 + z;
    const [o, i] = rings(b.x0, y0, b.x0 + b.w, y1, 1.2, 0.6);
    put(b.el, prism(P, front, o, i, zb, zb + b.h));
    const f = (zz) => seg(P(b.x0 + 0.8, y1, zb + zz), P(b.x0 + b.w - 0.8, y1, zb + zz));
    b.band.setAttribute("d", f(b.h - 5) + f(4));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of books) { draw(b, tval(b.y, now), tval(b.z, now)); if (!tdone(b.y, now) || !tdone(b.z, now)) moving = true; }
    const order = books.filter((b) => !b.top).sort((a, c) => a.x0 + tval(a.y, now) * 1.4 - (c.x0 + tval(c.y, now) * 1.4));
    const key = order.map((b) => b.k).join();
    if (key !== painted) { painted = key; for (const b of order) lowG.appendChild(b.el.g); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = books.map((b) => P(b.x0 + b.w / 2, 22, b.z0 + b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot((m[0] - sx) * 1.6, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    for (const b of books) {
      const on = b.k === a, mark = b.k === (a < 0 ? FAV : a);
      tset(b.y, on && !b.top ? 14 * reach : 0, now, 0);
      tset(b.z, on ? (b.top ? 16 * reach : 3) : a < 0 && b.k === FAV ? 5 : 0, now, 0);
      b.el.sil.classList.toggle("hi", mark);
    }
    read.textContent = a < 0 ? "rest" : "book " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookcart",
  means: "A two-shelf library cart full of books: the book under the pointer lifts out of its shelf.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.3],
  tour: [[135, 107], [205, 142], [187, 194], null],
  mount,
});
