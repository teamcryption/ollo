/**
 * Soup pots: three pots of different sizes on a stove top, each with a lid
 * and a knob. The pointer picks a pot by where it stands: its lid tips open
 * on its back rim, and the lids beside it crack open a little, staggered
 * from it. At rest the middle lid sits ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), with a hinged lid.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SZ = 6, POTS = [[30, 18, 20], [80, 22, 26], [128, 16, 17]], FAV = 1, OPEN = 64;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -6, 0], [152, 52, 0], [152, -6, 0], [0, 52, 0], [58, 23, SZ + 26 + 50], [146, 23, SZ + 17 + 34]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, -6, 152, 52, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // burner rings on the stove top, behind the pots
  for (const [x, r] of POTS) mk("path", { d: poly(disc(x, 23, r + 4, 40).map((q) => P(q.u, q.v, SZ))), class: "nf lo" }, g);

  const items = POTS.map(([x, r, h], k) => {
    const grp = mk("g", {}, g), y = 23, z1 = SZ + h;
    const hd = (s) => { const [a, b] = rings(x - 3, s < 0 ? y - r - 4 : y + r - 1, x + 3, s < 0 ? y - r + 1 : y + r + 4, 1.5, 0.6); return prism(P, front, a, b, z1 - 6, z1 - 3.5); };
    put(solid(grp), hd(-1));
    put(solid(grp), prism(P, front, disc(x, y, r), disc(x, y, r - 1.6), SZ, z1));
    put(solid(grp), hd(1));
    const lid = mk("path", { class: "sil" }, grp), knob = mk("path", { class: "nf" }, grp);
    return { k, x, y, r, z1, lid, knob, a: tween(k === FAV ? 18 : 0), last: NaN };
  });

  // the lid hinges on its back rim (smallest x): sample (u, v) rotates up by deg
  function lidPts(it, deg, ring, dz) {
    const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
    return ring.map((q) => { const du = q.u - (it.x - it.r); return P(it.x - it.r + du * c - dz * s, q.v, it.z1 + du * s + dz * c); });
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const rim = disc(it.x, it.y, it.r + 1, 40);
    it.lid.setAttribute("d", poly(hull(lidPts(it, deg, rim, 0).concat(lidPts(it, deg, rim, 1.6), lidPts(it, deg, disc(it.x, it.y, it.r * 0.7, 32), 3.4)))));
    const kb = disc(it.x, it.y, 2.6, 16);
    it.knob.setAttribute("d", poly(hull(lidPts(it, deg, kb, 3.4).concat(lidPts(it, deg, kb, 6.4)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.z1 / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? 18 : 0) : dd === 0 ? OPEN : dd === 1 ? 10 : 0;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "souppots",
  means: "Three soup pots on a stove: the lid of the pot under the pointer tips open on its back rim, and the lids beside it crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 152], [206, 178], [272, 211], null],
  mount,
});
