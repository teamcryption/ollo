/**
 * Taxi: three cabs waiting nose to tail at a rank, each with a sign on its
 * roof. The pointer picks a cab by where it stands along the rank: its roof
 * sign pops up, bright, and the signs beside it rise a little, staggered
 * from it. At rest the middle cab's sign is up. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, CL = 46, CW = 24, GAP = 10, STEP = CL + GAP, LIFT = 16, FAV = 1;
const ZB = 5, ZT = 15, ZR = 25, SH = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  const X1 = N * STEP - GAP;
  fit(C, [[0, 0, 0], [X1, CW, 0], [X1, 0, 0], [0, CW, 0], [CL / 2, CW / 2, ZR + SH + LIFT], [X1 - CL / 2, CW / 2, ZR + SH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [br, bi] = rings(x, 0, x + CL, CW, 7, 1.4);
    put(solid(grp), prism(P, front, br, bi, ZB, ZT));
    // cabin: a tapered top
    const foot = rrect(x + 11, 1.5, x + 35, CW - 1.5, 4, 4), top = rrect(x + 15, 3.5, x + 31, CW - 3.5, 3, 4);
    const inner = rrect(x + 16.2, 4.7, x + 29.8, CW - 4.7, 2, 4);
    put(solid(grp), { sil: poly(hull(ringAt(P, foot, ZT).concat(ringAt(P, top, ZR)))), crease: open(ringAt(P, run(inner, front), ZR)) });
    // windows and wheels on the near side
    const side = (x0, x1, z0, z1, r) => poly(rrect(x0, z0, x1, z1, r, 3).map((q) => P(q.u, CW - 1.5 + ((q.v - ZT) / (ZR - ZT)) * -2, q.v)));
    mk("path", { d: side(x + 14, x + 22, ZT + 1.5, ZR - 2, 1.2) + side(x + 24, x + 32, ZT + 1.5, ZR - 2, 1.2), class: "nf lo" }, grp);
    for (const wx of [x + 10, x + CL - 10]) {
      const pts = [];
      for (let i = 0; i < 28; i++) { const t = (i / 28) * 2 * Math.PI; pts.push(P(wx + 5 * Math.cos(t), CW + 0.4, 5 + 5 * Math.sin(t))); }
      mk("path", { d: poly(pts), class: "sil" }, grp);
    }
    const sign = solid(grp);
    items.push({ k, x, sign, z: tween(k === FAV ? LIFT : 0), last: NaN });
  }
  items.forEach((it) => it.sign.sil.classList.add("sil"));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [sr, si] = rings(it.x + 16, CW / 2 - 7, it.x + 30, CW / 2 + 7, 2.5, 1);
    put(it.sign, prism(P, front, sr, si, ZR + lift, ZR + SH + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + CL / 2, CW / 2, ZT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sign.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "taxirank",
  means: "Three cabs at a rank: the roof sign of the cab under the pointer pops up, and the signs beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 135], [277, 212], [200, 148], null],
  mount,
});
