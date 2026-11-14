/**
 * Bookends: a run of books of mixed heights held between two L-shaped
 * bookends on a shelf. The pointer picks a book by where it stands: it slides
 * forward off the shelf's back, and the books beside it ease out a little,
 * staggered from it. At rest one book stands pulled out, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = [9, 7, 11, 8, 6, 10, 8], H = [36, 30, 40, 33, 28, 38, 31], D = 24, GAP = 1, OUT = 16, FAV = 2, END = 3;
const XS = []; { let x = END + 1; for (const w of W) { XS.push(x); x += w + GAP; } }
const X1 = XS[XS.length - 1] + W[W.length - 1] + 1 + END;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-8, -6, -5], [X1 + 8, -6, -5], [X1 + 8, D + OUT + 4, -5], [-8, D + OUT + 4, -5], [0, 0, 42], [X1, 0, 42]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.8) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };
  put(solid(g), box(g, -8, -6, X1 + 8, D + 6, -5, 0, 3, 1.6));
  // the bookends: a foot under the books and an upright plate
  put(solid(g), box(g, 0, 2, 22, D - 2, 0, 1.2, 1, 0.6));
  put(solid(g), box(g, 0, 2, END, D - 2, 0, 30, 1, 0.6));
  put(solid(g), box(g, X1 - 22, 2, X1, D - 2, 0, 1.2, 1, 0.6));
  const row = mk("g", {}, g);
  const items = W.map((w, k) => {
    const grp = mk("g", {}, row), s = solid(grp);
    const band = mk("path", { class: "nf lo" }, grp);
    return { k, x: XS[k], w, h: H[k], s, band, y: tween(k === FAV ? OUT * 0.55 : k === 5 ? 2 : 0), last: NaN };
  });
  const rg = mk("g", {}, g);
  put(solid(rg), box(rg, X1 - END, 2, X1, D - 2, 0, 30, 1, 0.6));

  function draw(it, y) {
    if (y === it.last) return;
    it.last = y;
    put(it.s, box(null, it.x, y, it.x + it.w, y + D, 0, it.h, 1.4, 0.9));
    // a spine band near the top, on the face toward the viewer
    const yy = y + D, z = it.h - 6;
    it.band.setAttribute("d", "M" + P(it.x + 1, yy, z).join(",") + "L" + P(it.x + it.w - 1, yy, z).join(","));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + it.w / 2, D / 2, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.55 : k === 5 ? 2 : 0) : dd === 0 ? OUT : dd === 1 ? 3 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "vol " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookends",
  means: "Books held between two bookends on a shelf: the book under the pointer slides forward, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[160, 128], [216, 160], [265, 187], null],
  mount,
});
