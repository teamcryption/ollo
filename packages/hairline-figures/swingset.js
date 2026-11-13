/**
 * Swing set: a playground frame, two A-shaped ends joined by a top bar, with
 * three seats hung on pairs of chains over a rubber pad. The pointer picks a
 * swing by where it hangs: its seat swings forward toward the reader, and
 * the swings beside it swing a little, staggered from it. At rest the seats
 * hang at different angles, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is each swing's
 * rest centre on screen, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NS = 3, SP = 26, X1 = (NS + 1) * SP, H = 58, D = 24, LC = 40, SW = 7, ST = 3.2;
const REST = [-10, 14, 28], FAV = 2, UP = 48;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-8, -D - 8, -3], [X1 + 8, D + 14, -3], [X1 + 8, -D - 8, -3], [-8, D + 14, -3], [0, 0, H + 3], [X1, 0, H + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [po, pi] = rings(-8, -D - 8, X1 + 8, D + 14, 8, 2.4);
  put(solid(g), prism(P, front, po, pi, -3, 0));
  const leg = (xe, ye) => mk("path", { class: "sil", d: poly(hull(ringAt(P, disc(xe, ye, 1.8), 0).concat(ringAt(P, disc(xe, ye * 0.08, 1.6), H)))) }, g);
  leg(0, -D); leg(X1, -D); leg(0, D);
  // the top bar: a round rail along x
  const bar = [];
  for (const xe of [-3, X1 + 3]) for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; bar.push(P(xe, 2.2 * Math.cos(t), H + 2.2 * Math.sin(t))); }
  mk("path", { class: "sil", d: poly(hull(bar)) }, g);

  const swings = [];
  const [SR, SI] = rings(-SW, -ST, SW, ST, 1.6, 0.8);
  for (let k = 0; k < NS; k++) {
    const sx = (k + 1) * SP, grp = mk("g", {}, g);
    const chains = mk("path", { class: "nf" }, grp);
    swings.push({ k, sx, chains, seat: solid(grp), t: tween(REST[k]), last: NaN });
  }
  leg(X1, D);

  function draw(s, deg) {
    if (deg === s.last) return;
    s.last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), n = Math.sin(a);
    const cy = LC * n, cz = H - LC * c;
    const at = (q, h) => P(s.sx + q.u, cy + q.v * c - h * n, cz + q.v * n + h * c);
    s.chains.setAttribute("d", seg(P(s.sx - SW + 1, 0, H - 1), at({ u: -SW + 1, v: 0 }, 0)) + seg(P(s.sx + SW - 1, 0, H - 1), at({ u: SW - 1, v: 0 }, 0)));
    const sil = poly(hull(SR.map((q) => at(q, -1.8)).concat(SR.map((q) => at(q, 0)))));
    put(s.seat, { sil, crease: open(run(SI, front).map((q) => at(q, 0))) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of swings) { draw(s, tval(s.t, now)); if (!tdone(s.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = swings.map((s) => P(s.sx, 0, H - LC / 2));
  const half = (P(SP, 0, 0)[0] - P(0, 0, 0)[0]) / 2;
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < half && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    swings.forEach((s, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? UP : dd === 1 ? 16 : 5;
      tset(s.t, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.seat.sil.classList.toggle("hi", on);
      s.chains.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "swing " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "swingset",
  means: "A playground swing set with three swings: the swing under the pointer swings forward, and its neighbours swing a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[167, 116], [204, 134], [241, 153], null],
  mount,
});
