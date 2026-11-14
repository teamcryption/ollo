/**
 * Mail cart: a wheeled cart carrying four mail bins in a row, a letter
 * standing in each. The pointer picks a bin by where it stands: its letter
 * rises out of the slot, the letters beside it rise a little, staggered
 * from it. At rest one letter stands half out, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BW = 26, GAP = 3, D = 30, DZ = 9, BZ = DZ + 18, LIFT = 36, FAV = 2;
const L = N * BW + (N + 1) * GAP;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-14, 0, 0], [L, 0, 0], [0, D, 0], [L, D, 0], [GAP + BW / 2, D / 2, BZ + LIFT + 14], [-14, D / 2, BZ + 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[6, 6], [L - 6, 6], [6, D - 6], [L - 6, D - 6]]) put(solid(g), prism(P, front, disc(x, y, 3.2), disc(x, y, 2.2), 0, DZ - 3));
  const [dr, di] = rings(0, 0, L, D, 4, 1.6);
  put(solid(g), prism(P, front, dr, di, DZ - 3, DZ));
  // the push handle, standing from the near-left end
  mk("path", { d: open([P(-2, 3, DZ), P(-12, 3, BZ + 14), P(-12, D - 3, BZ + 14), P(-2, D - 3, DZ)]), class: "nf sil" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = GAP + k * (BW + GAP), x1 = x0 + BW, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 2, x1, D - 2, 3, 1.4);
    put(solid(grp), prism(P, front, br, bi, DZ, BZ));
    mk("path", { d: seg(P(x0 + 3, D / 2, BZ), P(x1 - 3, D / 2, BZ)), class: "lo" }, grp);
    const s = solid(grp), flap = mk("path", { class: "nf lo" }, s.g);
    const rest = k === FAV ? LIFT * 0.3 : [3, 6, 0, 4][k];
    items.push({ k, x0: x0 + 2, x1: x1 - 2, s, flap, rest, z: tween(rest), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const zt = BZ + 3 + lift, yf = D / 2 + 1, xm = (it.x0 + it.x1) / 2;
    const [r, i] = rings(it.x0, D / 2 - 1, it.x1, yf, 0.8, 0.4);
    put(it.s, prism(P, front, r, i, BZ, zt));
    it.flap.setAttribute("d", open([P(it.x0 + 1, yf, zt - 1), P(xm, yf, zt - 9), P(it.x1 - 1, yf, zt - 1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D / 2, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 12 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailcart",
  means: "A mail cart of four bins in a row: the letter in the bin under the pointer rises out of its slot, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 147], [183, 168], [263, 208], null],
  mount,
});
