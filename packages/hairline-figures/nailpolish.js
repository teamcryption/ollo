/**
 * Nail polish rack: five square bottles with tall caps on a shelf. The
 * pointer picks a bottle by where it stands: it slides forward off the row,
 * its neighbours follow a little, staggered from it. At rest one bottle
 * stands pulled out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), sliding.
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 24, W = 9, BODY = 20, NECK = 3.5, CAP = 18, OUT = 30, FAV = 3;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const X1 = (N - 1) * STEP + 2 * W + 4;
  fit(C, [[-4, -4, 0], [X1, -4, 0], [X1, OUT + 2 * W + 4, 0], [-4, OUT + 2 * W + 4, 0], [W, W, 4 + BODY + NECK + CAP + 2], [X1 - W, W, 4 + BODY + NECK + CAP + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, -4, X1, OUT + 2 * W + 4, 4, 1.8);
  put(solid(g), prism(P, front, sr, si, 0, 4));
  const row = mk("g", {}, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, row);
    const body = solid(grp), neck = solid(grp), cap = solid(grp), lvl = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: 2 + W + k * STEP, grp, body, neck, cap, lvl, d: tween(k === FAV ? OUT * 0.7 : 0), last: NaN, lv: 0.45 + 0.4 * ((k * 7) % 5) / 4 });
  }

  function draw(it, d) {
    if (d === it.last) return false;
    it.last = d;
    const x = it.x, y = 2 + W + d, z0 = 4;
    const [br, bi] = rings(x - W, y - W, x + W, y + W, 3, 1.4);
    put(it.body, prism(P, front, br, bi, z0, z0 + BODY));
    put(it.neck, prism(P, front, disc(x, y, 4), disc(x, y, 3), z0 + BODY, z0 + BODY + NECK));
    put(it.cap, prism(P, front, disc(x, y, 5.5), disc(x, y, 4.3), z0 + BODY + NECK, z0 + BODY + NECK + CAP));
    const h = z0 + 2 + (BODY - 5) * it.lv;
    it.lvl.setAttribute("d", open([P(x + W - 0.4, y - W + 2, h), P(x + W - 0.4, y + W - 0.4, h), P(x - W + 2, y + W - 0.4, h)]));
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, changed = false;
    for (const it of items) { if (draw(it, tval(it.d, now))) changed = true; if (!tdone(it.d, now)) moving = true; }
    if (changed) items.slice().sort((a, b) => a.x + a.last - (b.x + b.last)).forEach((it) => row.appendChild(it.grp));
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 2 + W, 4 + BODY / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? OUT * 0.7 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no. " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "nailpolish",
  means: "Five polish bottles on a shelf: the bottle under the pointer slides forward off the row, its neighbours a little after.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[149, 129], [223, 166], [298, 203], null],
  mount,
});
