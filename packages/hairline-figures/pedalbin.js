/**
 * Pedal bin: three round pedal bins along a floor, each a drum with a pedal
 * at its foot and a lid hinged at the back. The pointer picks a bin by where
 * it stands: its lid tilts open, and the lids beside it crack open,
 * staggered from it. At rest one lid is ajar, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row, each lid tilting on a hinge.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, R = 16, STEP = 42, H = 46, OPEN = 78, FAV = 0;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -10, 0], [X1 + 4, -10, 0], [X1 + 4, 2 * R + 4, 0], [-4, 2 * R + 4, 0], [R, 2 * R + 6, H + 2 * R + 4], [X1 - R, 2 * R + 6, H + 2 * R + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    // pedal at the foot, then the drum and its rolled rim
    const ped = [[x - 6, y - R - 8, 2], [x + 6, y - R - 8, 2], [x + 6, y - R + 2, 5], [x - 6, y - R + 2, 5]];
    const pd = [];
    for (const [a, b, c] of ped) pd.push(P(a, b, c), P(a, b, c - 2.5));
    mk("path", { d: poly(hull(pd)), class: "nf" }, grp);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 2), 0, H));
    mk("path", { d: poly(ringAt(P, disc(x, y, R - 1.5), H - 6)), class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), dome = mk("path", { class: "nf lo" }, grp);
    const rest = k === FAV ? 34 : k === 2 ? 6 : 0;
    items.push({ k, x, y, grp, lid, dome, rest, a: tween(rest), last: NaN });
  }

  // lid point: disc point (u, v) at height h above the rim, tilted a degrees about the back hinge
  const lp = (it, a, u, v, h) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), dy = v - R;
    return P(it.x + u, it.y + R + dy * c - h * s, H + h * c - dy * s);
  };
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [], top = [];
    for (const q of circ(R + 0.8, 32)) { pts.push(lp(it, a, q.u, q.v, 0), lp(it, a, q.u, q.v, 3)); }
    for (const q of circ(R * 0.55, 24)) { pts.push(lp(it, a, q.u, q.v, 7)); top.push(lp(it, a, q.u, q.v, 7)); }
    it.lid.setAttribute("d", poly(hull(pts)));
    it.dome.setAttribute("d", poly(top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? it.rest : dd === 0 ? OPEN : dd === 1 ? 26 : 8;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "pedalbin",
  means: "Three pedal bins on a floor: the lid under the pointer tilts open on its back hinge, and its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[195, 125], [153, 86], [237, 180], null],
  mount,
});
