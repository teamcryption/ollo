/**
 * Modem: a low home router with three hinged antennas along its back edge
 * and a row of status lights on its front. The pointer picks an antenna by
 * where it stands along the edge: it swings upright, and its neighbours
 * swing part way, staggered from it. At rest the antennas lie back at
 * different angles, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, facing, mk, place, pointer, put, register, solid,
} = HL;

const L = 74, D = 42, H = 12, AL = 34, N = 3, FAV = 1, REST = [0.95, 0.3, 0.7];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [14, 5, H + AL + 3], [60, 5, H + AL + 3], [14, 5 - AL, H + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(0, 0, L, D, 7, 1.8);
  put(solid(g), prism(P, front, o, i, 0, H));
  mk("path", { d: "M" + P(6, D, 4).join(" ") + "L" + P(L - 6, D, 4).join(" "), class: "nf lo" }, g);
  for (let k = 0; k < 4; k++) place(mk("circle", { r: 1.6, class: "dot off" }, g), P(12 + k * 7, D, 8));

  const ring = circ(2.4, 16);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 14 + k * 23, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, ring.map((q) => ({ ...q, u: q.u + x, v: q.v + 5 })), circ(1.2, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + 5 })), H, H + 3));
    const rod = mk("path", { class: "sil" }, grp);
    items.push({ k, x, rod, a: tween(REST[k]), last: NaN, c: P(x, 5, H + AL / 2) });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (const [t, r] of [[0, 2], [1, 1.4]]) {
      const cy = 5 - (AL * t) * Math.sin(a), cz = H + 3 + (AL * t) * Math.cos(a);
      for (const q of ring) pts.push(P(it.x + q.u * r / 2.4, cy + q.v * r / 2.4 * Math.cos(a), cz + q.v * r / 2.4 * Math.sin(a)));
    }
    it.rod.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.c[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(items[best].c[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), to = a < 0 ? REST[k] : d === 0 ? -0.05 : d === 1 ? 0.45 : REST[k];
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.rod.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ant " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "routerstack",
  means: "A home modem with three hinged antennas: the antenna under the pointer swings upright, and its neighbours swing part way.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[186, 109], [233, 133], [280, 156], null],
  mount,
});
