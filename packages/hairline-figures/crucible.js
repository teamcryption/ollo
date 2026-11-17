/**
 * Crucible: three porcelain crucibles on a fireclay tile, a pair of crucible
 * tongs lying in front. The pointer picks a crucible by where it stands: it
 * rises off the tile and tips toward the viewer as if poured, and the ones
 * beside it rise a little, staggered. At rest one crucible is lifted,
 * bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, RB = 8, RT = 13, H = 22, LIFT = 26, FAV = 0, CZ = 4;
const X1 = (N - 1) * STEP + 2 * (RT + 4), Y1 = 2 * RT + 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, -4, 0], [X1 + 4, Y1, 0], [X1 + 4, -4, 0], [-4, Y1, 0], [RT + 4, RT + 4, CZ + H + LIFT + 8], [X1 - RT - 4, RT + 4, CZ + H + LIFT + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, Y1, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  // the tongs: two long bowed arms crossing at a pivot, lying on the tile
  const ty = Y1 - 12, arm = (s) => [[8, ty + 5 * s], [40, ty + 2.5 * s], [70, ty - 1.5 * s], [X1 - 30, ty - 4 * s], [X1 - 14, ty - 1 * s]].map(([u, v]) => P(u, v, CZ + 0.6));
  mk("path", { d: open(arm(1)), class: "nf" }, g);
  mk("path", { d: open(arm(-1)), class: "nf" }, g);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = RT + 4 + k * STEP, y = RT + 4, grp = mk("g", {}, g);
    const cup = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, cup, rim, z: tween(k === FAV ? 0.7 : 0), last: NaN });
  }

  function ring(it, r, h, t) {
    const lift = t * LIFT, a = -t * 0.55, c = Math.cos(a), s = Math.sin(a);
    return circ(r, 32).map((q) => { const yy = q.v * c - h * s, zz = q.v * s + h * c; return P(it.x + q.u, it.y + yy, CZ + lift + zz); });
  }
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    it.cup.setAttribute("d", poly(hull(ring(it, RB, 0, t).concat(ring(it, RT, H, t)))));
    it.rim.setAttribute("d", poly(ring(it, RT - 1.5, H, t)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + H));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 0.7 : 0) : dd === 0 ? 1 : dd === 1 ? 0.4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cup.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crucible",
  means: "Three crucibles on a tile, tongs in front: the crucible under the pointer rises and tips to pour, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 130], [273, 190], [213, 160], null],
  mount,
});
