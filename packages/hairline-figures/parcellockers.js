/**
 * Parcel lockers: a pickup wall of hinged doors in three sizes, four
 * columns of small, medium and large bays. The pointer picks a bay on the
 * wall's face: its door swings wide on the left hinge and shows the parcel
 * waiting inside, and the doors around it come ajar a little, staggered
 * from it. At rest one door stands half open, bright, and two others sit
 * unevenly ajar. The slider is the stagger.
 *
 * Hit read on the wall's face plane (y = D), which never moves; tweens per door.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rad, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, CW = 24, M = 5, BASE = 7, D = 14, IN = 1, T = 0.9;
const ROWS = [20, 14, 10, 10];                       // bottom to top: large, medium, small, small
const ZB = ROWS.reduce((a, h) => a.concat(a[a.length - 1] + h), [BASE]);
const NR = ROWS.length, W = 2 * M + NC * CW, H = ZB[NR] + M;
const FAV = [2, 1], OPEN = 105;
const REST = (c, r) => (c === FAV[0] && r === FAV[1] ? 58 : c === 0 && r === 2 ? 9 : c === 3 && r === 0 ? 5 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + 24, BASE], [0, 0, H], [W, 0, H], [0, D + 14, H - M]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  mk("path", { d: seg(P(1.5, D, BASE - 3), P(W - 1.5, D, BASE - 3)), class: "nf lo" }, g);

  const bays = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = M + c * CW + IN, x1 = M + (c + 1) * CW - IN, z0 = ZB[r] + IN, z1 = ZB[r + 1] - IN;
    // the bay's mouth and the parcel's face inside it, painted before any door swings over them
    mk("path", { d: poly(rrect(x0, z0, x1, z1, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    const pw = Math.min(x1 - x0 - 5, (z1 - z0) * 1.6), pz = Math.min(z1 - z0 - 2.5, 12), px = x0 + 2.5;
    mk("path", { d: poly(rrect(px, z0 + 0.6, px + pw, z0 + 0.6 + pz, 0.6, 2).map(onFace(D))) +
      seg(P(px + pw / 2, D, z0 + 0.6 + pz), P(px + pw / 2, D, z0 + 0.6 + pz * 0.55)), class: "nf lo" }, g);
    bays.push({ c, r, x0, x1, z0, z1, rest: REST(c, r) });
  }
  // column by column from the left, bottom to top: an open door only ever falls over bays drawn before it
  for (const b of bays) {
    b.door = mk("path", { class: "sil" }, g);
    b.edge = mk("path", { class: "nf lo" }, g);
    b.s = tween(b.rest);
    b.last = NaN;
  }

  function draw(b, deg) {
    const a = rad(deg), w = b.x1 - b.x0, dx = Math.cos(a), dy = Math.sin(a);
    const fx = b.x0 + w * dx, fy = D + w * dy, nx = -dy * T, ny = dx * T;
    const pts = [];
    for (const z of [b.z0, b.z1]) {
      pts.push(P(b.x0, D, z), P(fx, fy, z), P(b.x0 + nx, D + ny, z), P(fx + nx, fy + ny, z));
    }
    const h = hull(pts);
    b.door.setAttribute("d", poly(fillet(h, h.map(() => 1), 2)));
    // the thickness line and the pull, near the free edge
    const ix = fx - 2.4 * dx + nx, iy = fy - 2.4 * dy + ny, zm = (b.z0 + b.z1) / 2;
    b.edge.setAttribute("d", seg(P(fx + nx, fy + ny, b.z0 + 0.8), P(fx + nx, fy + ny, b.z1 - 0.8)) +
      seg(P(ix, iy, zm - 2), P(ix, iy, zm + 2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bays) {
      const s = tval(b.s, now);
      if (s !== b.last) { draw(b, s); b.last = s; }
      if (!tdone(b.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The bay under the point, read on the wall's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE || z > ZB[NR]) return -1;
    let r = 0;
    while (r < NR - 1 && z > ZB[r + 1]) r++;
    return clamp(Math.floor((x - M) / CW), 0, NC - 1) * NR + r;
  }

  let act = -2;
  const favI = FAV[0] * NR + FAV[1];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? bays[a] : null, fc = from >= 0 ? bays[from] : null;
    bays.forEach((b, i) => {
      const dist = ac ? Math.abs(b.c - ac.c) + Math.abs(b.r - ac.r) : 0;
      const s = a < 0 ? b.rest : dist === 0 ? OPEN : dist === 1 ? 12 : dist === 2 ? 4 : 0;
      tset(b.s, s, now, fc ? (Math.abs(b.c - fc.c) + Math.abs(b.r - fc.r)) * stag : 0);
      b.door.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `bay ${ac.c + 1}·${ac.r + 1}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "parcellockers",
  means: "A pickup wall of parcel lockers in three sizes: the door under the pointer swings wide to show its parcel, and nearby doors come ajar.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 97], [189, 160], [267, 233], null],
  mount,
});
