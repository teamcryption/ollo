/**
 * Scrubs lockers: a row of tall staff lockers, each with a door below and a
 * bin of folded scrubs above it. The pointer picks a locker by where it
 * stands: its bin slides out toward the viewer, and the bins beside it ease
 * out a little, staggered from it. At rest one bin is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, W = 30, D = 26, H = 74, BZ0 = 44, BZ1 = 58, OUT = 30, FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[0, 0, 0], [X1, 0, 0], [0, D + OUT + 2, 0], [X1, D + OUT + 2, 0], [0, 0, H], [X1, D, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg), gd = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP;
    const [r, i] = rings(x, 0, x + W, D, 3, 1.4);
    put(solid(g), prism(P, front, r, i, 0, H));
    // the door: a rounded panel line on the front face, and a latch dot
    const door = [[x + 4, BZ0 - 4], [x + W - 4, BZ0 - 4], [x + W - 4, 5], [x + 4, 5]].map(([u, z]) => P(u, D, z));
    mk("path", { d: poly(door), class: "nf lo" }, g);
    const latch = mk("circle", { r: 1.6, class: "dot off" }, g), lp = P(x + W - 8, D, BZ0 * 0.45);
    latch.setAttribute("cx", lp[0]); latch.setAttribute("cy", lp[1]);
    const bin = solid(gd), fold = mk("path", { class: "nf lo" }, bin.g);
    items.push({ k, x, bin, fold, o: tween(k === FAV ? OUT * 0.55 : 0), last: NaN });
  }

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const [r, i] = rings(it.x + 3, D - 2, it.x + W - 3, D + 2 + o, 1.5, 1);
    put(it.bin, prism(P, front, r, i, BZ0, BZ1));
    // a folded stack of scrubs inside the bin, shown once it is out
    if (o > 6) {
      const f = rrect(it.x + 7, D + 1, it.x + W - 7, D + o - 1, 1.5, 3);
      it.fold.setAttribute("d", poly(ringAt(P, f, BZ1 + 0.01)));
    } else it.fold.setAttribute("d", "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 8 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bin.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scrubsrack",
  means: "A row of staff lockers: the bin of folded scrubs under the pointer slides out, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 109], [222, 159], [305, 191], null],
  mount,
});
