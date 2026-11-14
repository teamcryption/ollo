/**
 * Cereal dispenser: three tall canisters on a hotel breakfast stand, each on
 * a funnel neck with a three-spoke twist knob, a bowl waiting under each.
 * The pointer picks a canister by where it stands: its knob turns a third of
 * a turn and the canister tips forward on its pivot to pour, and the
 * canisters beside it tip a little, staggered from it. At rest the middle
 * canister leans half tipped, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), parts that tilt.
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, ringAt, facing, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 36, R = 13, Y = 20, PZ = 34, H = 50, TIP = 26, FAV = 1, L = 2 * 18 + 2 * STEP;
const REST = [3, 12, 0];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [L, 46, 0], [L, 0, PZ + H + 8], [0, 0, PZ + H + 8], [0, 46, 0], [L, 46, 12], [L / 2, Y + 30, PZ + H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, 5, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, PZ + H + 6));
  const [sr, si] = rings(0, 0, L, 46, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, 8));

  const cans = [0, 1, 2].map((k) => {
    const x = 18 + k * STEP, grp = mk("g", {}, g);
    const neck = mk("path", { class: "sil" }, grp), body = mk("path", { class: "sil" }, grp), top = mk("path", { class: "nf lo" }, grp);
    const level = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "nf" }, grp);
    const bowl = mk("path", { class: "sil" }, grp), brim = mk("path", { class: "nf lo" }, grp);
    const bp = ringAt(P, disc(x, Y + 14, 8), 8).concat(ringAt(P, disc(x, Y + 14, 10), 15));
    bowl.setAttribute("d", poly(hull(bp)));
    brim.setAttribute("d", poly(ringAt(P, disc(x, Y + 14, 9), 15)));
    return { k, x, neck, body, top, level, knob, a: tween(REST[k]), last: NaN };
  });

  function draw(c, deg) {
    if (deg === c.last) return;
    c.last = deg;
    const t = (deg * Math.PI) / 180, cs = Math.cos(t), sn = Math.sin(t);
    const at = (ring, dz) => ring.map((q) => { const dy = q.v - Y; return P(q.u, Y + dy * cs + dz * sn, PZ - dy * sn + dz * cs); });
    c.neck.setAttribute("d", poly(hull(at(disc(c.x, Y, R - 1), 0).concat(at(disc(c.x, Y, 4), -12)))));
    c.body.setAttribute("d", poly(hull(at(disc(c.x, Y, R), 0).concat(at(disc(c.x, Y, R), H), at(disc(c.x, Y, R - 3), H + 3)))));
    c.top.setAttribute("d", poly(at(disc(c.x, Y, R - 1.5), H)));
    c.level.setAttribute("d", open(at(disc(c.x, Y, R - 0.6).filter(front), H * 0.62)));
    const turn = (deg / TIP) * (2 * Math.PI / 3), ky = Y + 7, kz = -7, spokes = [];
    for (let j = 0; j < 3; j++) {
      const u = turn + (j * 2 * Math.PI) / 3, dx = 7 * Math.cos(u), dz = 7 * Math.sin(u);
      const pt = (ddx, ddz) => { const dy = ky - Y; return P(c.x + ddx, Y + dy * cs + (kz + ddz) * sn, PZ - dy * sn + (kz + ddz) * cs); };
      spokes.push(seg(pt(0, 0), pt(dx, dz)));
    }
    c.knob.setAttribute("d", spokes.join(" "));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cans) { draw(c, tval(c.a, now)); if (!tdone(c.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cans.map((c) => P(c.x, Y, PZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 36 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cans.forEach((c, k) => {
      const d = Math.abs(k - a), v = a < 0 ? REST[k] : d === 0 ? TIP : 5;
      tset(c.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "cerealdispenser",
  means: "Three cereal canisters on a breakfast stand: the one under the pointer twists its knob and tips forward to pour into its bowl.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 117], [204, 142], [254, 167], null],
  mount,
});
