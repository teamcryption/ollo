/**
 * Rosin: three round rosin tins in a row, each lid hinged at its far edge
 * over an amber cake. The pointer picks a tin by where it stands: its lid
 * swings open and the lids beside it crack a little, staggered from it. At
 * rest one lid stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a hinge instead of a lift.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, R = 24, STEP = 58, H = 7, LT = 4, OPEN = 105, FAV = 1;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const X1 = (N - 1) * STEP;
  fit(C, [[-R - 4, -R - 4, 0], [X1 + R + 4, R + 4, 0], [-2 * R, 0, H + 2 * R], [X1 - 2 * R, 0, H + 2 * R], [X1 + R, -R, 0], [-R, R, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const lid = mk("g", {}, grp);
    const body = mk("g", {}, grp);
    put(solid(body), prism(P, front, disc(x, 0, R), disc(x, 0, R - 2), 0, H));
    mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, 0, R - 5, 32), H - 1)) }, body);
    mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x + 3, 2, 6, 20), H - 1)) }, body);
    const ls = mk("path", { class: "sil" }, lid), lc = mk("path", { class: "nf lo" }, lid);
    items.push({ k, x, grp, lid, body, ls, lc, a: tween(k === FAV ? 50 : 0), last: NaN, behind: null });
  }

  function lidPts(x, deg, rr, dz) {
    const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), hx = x - R;
    return disc(x, 0, rr, 40).map((q) => { const dx = q.u - hx; return P(hx + dx * c - dz * s, q.v, H + dx * s + dz * c); });
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const pts = lidPts(it.x, deg, R + 0.6, 0).concat(lidPts(it.x, deg, R + 0.6, LT));
    it.ls.setAttribute("d", poly(hull(pts)));
    it.lc.setAttribute("d", poly(lidPts(it.x, deg, R - 2, LT)));
    const behind = deg > 40;
    if (behind !== it.behind) { it.behind = behind; if (behind) it.lid.after(it.body); else it.body.after(it.lid); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 50 : 0) : dd === 0 ? OPEN : dd === 1 ? 18 : 0;
      tset(it.a, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ls.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mutebox",
  means: "Three rosin tins in a row: the lid under the pointer swings open on its hinge, and its neighbours crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[116, 150], [200, 192], [284, 234], null],
  mount,
});
