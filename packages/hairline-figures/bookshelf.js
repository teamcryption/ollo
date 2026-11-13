/**
 * Bookshelf: a row of eleven books of different heights and widths on a
 * shelf board between two bookends, each with bands near the top and foot of
 * its spine. The pointer picks a book by where it stands: it slides out
 * toward the reader and lifts, and the books beside it ease out a little,
 * staggered from it. At rest one book is half pulled, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the book
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = [8, 6, 9, 7, 10, 6, 8, 7, 9, 6, 8], HT = [52, 46, 56, 44, 50, 54, 42, 48, 55, 45, 51];
const D = 30, GAP = 0.8, OUT = 18, LIFT = 4, FAV = 4, END = 4;
const xs = []; { let x = END + 1; for (const w of W) { xs.push(x); x += w + GAP; } }
const X1 = xs[xs.length - 1] + W[W.length - 1] + 1 + END;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, -2, -4], [X1, D + OUT + 2, -4], [X1, -2, -4], [0, D + OUT, -4], [0, 0, 60], [X1, 0, 60]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, -2, X1, D + 6, 2, 1);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const end = (x0, x1) => { const [r, i] = rings(x0, 0, x1, D, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 0, 40)); };
  end(0, END);

  const books = W.map((w, k) => {
    const el = solid(g), bands = mk("path", { class: "nf lo" }, el.g);
    return { k, w, h: HT[k], x0: xs[k], el, bands, y: tween(k === FAV ? 9 : 0), z: tween(0), last: "" };
  });
  const endR = solid(g);
  { const [r, i] = rings(X1 - END, 0, X1, D, 1.2, 0.6); put(endR, prism(P, front, r, i, 0, 40)); }

  function draw(b, y, z) {
    const key = y.toFixed(2) + "," + z.toFixed(2);
    if (key === b.last) return false;
    b.last = key;
    const [r, i] = rings(b.x0, y, b.x0 + b.w, y + D, 1.2, 0.7);
    put(b.el, prism(P, front, r, i, z, z + b.h));
    const f = (zz) => seg(P(b.x0 + 0.8, y + D, z + zz), P(b.x0 + b.w - 0.8, y + D, z + zz));
    b.bands.setAttribute("d", f(b.h - 6) + f(b.h - 9) + f(7));
    return true;
  }

  // paint far to near: a book pulled toward the reader goes after its neighbours, so does the right bookend
  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of books) { draw(b, tval(b.y, now), tval(b.z, now)); if (!tdone(b.y, now) || !tdone(b.z, now)) moving = true; }
    const order = books.slice().sort((a, c) => a.x0 + tval(a.y, now) * 1.4 - (c.x0 + tval(c.y, now) * 1.4));
    const key = order.map((b) => b.k).join();
    if (key !== painted) { painted = key; for (const b of order) g.appendChild(b.el.g); g.appendChild(endR.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** The book whose resting middle is nearest the pointer's x on screen; -1 off the shelf. */
  const mids = books.map((b) => P(b.x0 + b.w / 2, D, b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    const m = mids[best];
    return bd < 14 && Math.abs(m[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    books.forEach((b, k) => {
      const d = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? 9 : 0) : d === 0 ? OUT : d === 1 ? 5 : d === 2 ? 2 : 0;
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(b.y, y, now, delay); tset(b.z, a === k ? LIFT : 0, now, delay);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "book " + String(a + 1).padStart(2, "0");
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookshelf",
  means: "Eleven books on a shelf: the one under the pointer slides out and lifts, and its neighbours ease out in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[135, 155], [190, 180], [250, 210], null],
  mount,
});
