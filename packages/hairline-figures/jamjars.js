/**
 * Jam jars: six jars of different sizes on a pantry shelf, a back board
 * behind them, each jar with a screw lid and a shoulder line. The pointer
 * picks a jar by where it stands: its lid unscrews, turning and lifting, and
 * the lids beside it loosen a little, staggered from it. At rest one lid is
 * half off, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the jar
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, ringAt, open, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = [8, 6.5, 9, 7, 8.5, 6.5], H = [22, 17, 27, 19, 24, 16], LH = 4, LIFT = 12, FAV = 3, Y = 12;
const xs = []; { let x = 4; for (const r of R) { xs.push(x + r); x += 2 * r + 4; } }
const X1 = xs[xs.length - 1] + R[R.length - 1] + 4;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-2, -6, -5], [X1 + 2, 28, -5], [X1 + 2, -6, 50], [-2, -6, 50], [-2, 28, -5]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-2, -6, X1 + 2, -3, 1, 0.5); put(solid(g), prism(P, front, r, i, -5, 50)); }
  { const [r, i] = rings(-2, -3, X1 + 2, 28, 2, 1); put(solid(g), prism(P, front, r, i, -5, 0)); }

  const jars = R.map((r, k) => {
    const x = xs[k], grp = mk("g", {}, g), body = solid(grp);
    put(body, prism(P, front, disc(x, Y, r), disc(x, Y, r - 1.2), 0, H[k]));
    mk("path", { class: "nf lo", d: open(ringAt(P, disc(x, Y, r, 32).filter(front), H[k] - 4)) }, body.g);
    const lid = solid(grp), mark = mk("path", { class: "nf lo" }, lid.g);
    return { k, x, r, h: H[k], lid, mark, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN };
  });

  function draw(j, lift) {
    if (lift === j.last) return;
    j.last = lift;
    const z0 = j.h + lift * 0.9, rr = j.r + 0.6;
    put(j.lid, prism(P, front, disc(j.x, Y, rr), disc(j.x, Y, rr - 1), z0, z0 + LH));
    // the knurl marks turn with the lift: the lid unscrews as it rises
    let d = "";
    for (let m = 0; m < 6; m++) {
      const a = (m / 6) * Math.PI * 2 + lift * 0.22, c = Math.cos(a - Math.PI / 4);
      if (c < 0.25) continue;
      const px = j.x + rr * Math.cos(a), py = Y + rr * Math.sin(a);
      d += seg(P(px, py, z0 + 1), P(px, py, z0 + LH - 1));
    }
    j.mark.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const j of jars) { draw(j, tval(j.z, now)); if (!tdone(j.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = jars.map((j) => P(j.x, Y, j.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    jars.forEach((j, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : dd === 2 ? 1 : 0;
      tset(j.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      j.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jamjars",
  means: "Six jam jars on a pantry shelf: the lid of the jar under the pointer unscrews and lifts, its neighbours loosen a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 152], [212, 180], [259, 208], null],
  mount,
});
