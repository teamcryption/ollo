/**
 * Key rack: a hotel key board under its cornice, four hooks across and three
 * high, each holding a heavy tag and a key in front of it, the
 * tag dotted with its floor and room. The pointer picks a hook on the board's
 * face: its key swings out on its hook and lifts, the keys around it swing a
 * little, staggered from it. At rest the keys hang unevenly and one is half
 * swung out, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face (lockers). Tweens per key; the hit is
 * read on the board's face plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, place, put, register, solid,
} = HL;

const NC = 4, NR = 3, CW = 21, RH = 26, M = 6, BD = 4, PEG = 3.4, T = 1.4;
const W = 2 * M + NC * CW, H = 2 * M + NR * RH, FAV = [2, 1], SWING = 52;
const REST = [[3, 0, 5], [0, 4, 2], [6, 34, 0], [2, 0, 4]];
const SHANK = [[-1.7, 3.8], [-0.3, 3.8], [-0.3, 13.4], [-2.8, 13.4], [-2.8, 12], [-1.7, 12], [-1.7, 11.2], [-3.2, 11.2], [-3.2, 9.8], [-1.7, 9.8]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-3, -1, 0], [W + 3, BD + 5, 0], [-3, -1, H + 3], [W + 3, -1, H + 3], [M, BD + PEG + 15, M + 8], [W - M, BD + PEG + 15, M + 8]], 200, 164);
  const P = proj(C), front = facing(C);
  const onFace = (q) => P(q.u, BD, q.v);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, BD, 2, 0.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [cr, ci] = rings(-3, -1, W + 3, BD + 5, 2, 1);
  put(solid(g), prism(P, front, cr, ci, H, H + 3));
  let d = poly(rrect(M - 2.5, M - 2.5, W - M + 2.5, H - M + 1, 2, 3).map(onFace));

  const keys = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const hx = M + c * CW + CW / 2, zh = M + (r + 1) * RH - 4;
    d += seg(P(hx, BD, zh), P(hx, BD + PEG + 0.6, zh));
    keys.push({ c, r, hx, zh, rest: REST[c][r] });
  }
  mk("path", { class: "nf lo", d }, g);
  // bottom row first, left to right: a key swung out only ever covers keys below it or to its left
  for (const k of keys) {
    k.g = mk("g", {}, g);
    k.tag = solid(k.g);
    k.dots = [];
    for (let i = 0; i <= k.r; i++) k.dots.push([1.5, 7 + i * 2]);
    for (let i = 0; i <= k.c; i++) k.dots.push([3, 7 + i * 2]);
    k.dots = k.dots.map(([u, v]) => ({ u, v, el: mk("circle", { r: 0.9, class: "dot off" }, k.g) }));
    k.bow = mk("path", {}, k.g);
    k.shank = mk("path", {}, k.g);
    k.a = tween(k.rest);
    k.last = NaN;
  }

  const tagR = rrect(-4.4, 0.2, 4.4, 15.2, 1.8, 3), bowC = circ(2.2, 16);
  function draw(k, deg) {
    const ph = (deg * Math.PI) / 180, s = Math.sin(ph), c = Math.cos(ph), lift = 3 * clamp((deg - 20) / 32, 0, 1);
    const at = (u, v, n) => P(k.hx + u, BD + PEG + v * s + n * c, k.zh + lift - v * c + n * s);
    const back = tagR.map((q) => at(q.u, q.v, 0)), face = tagR.map((q) => at(q.u, q.v, T));
    k.tag.sil.setAttribute("d", poly(hull(back.concat(face))));
    k.tag.cr.setAttribute("d", open(face.concat([face[0]])));
    for (const p of k.dots) place(p.el, at(p.u, p.v, T));
    k.bow.setAttribute("d", poly(bowC.map((q) => at(q.u - 1, q.v + 1.8, T + 0.6))));
    k.shank.setAttribute("d", poly(SHANK.map(([u, v]) => at(u, v, T + 0.6))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) {
      const v = tval(k.a, now);
      if (v !== k.last) { draw(k, v); k.last = v; }
      if (!tdone(k.a, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The hook under the point, read on the board's face plane (y = BD), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + BD * s) / c, Y = x * s + BD * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < M || z > H - M) return -1;
    return clamp(Math.floor((z - M) / RH), 0, NR - 1) * NC + clamp(Math.floor((x - M) / CW), 0, NC - 1);
  }

  let act = -2;
  const favI = FAV[1] * NC + FAV[0];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ak = a >= 0 ? keys[a] : null, fk = from >= 0 ? keys[from] : null;
    keys.forEach((k, i) => {
      const dist = ak ? Math.abs(k.c - ak.c) + Math.abs(k.r - ak.r) : 0;
      const deg = a < 0 ? k.rest : dist === 0 ? SWING : dist === 1 ? 16 : dist === 2 ? 6 : 2;
      tset(k.a, deg, now, fk ? (Math.abs(k.c - fk.c) + Math.abs(k.r - fk.r)) * stag : 0);
      k.tag.sil.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `room ${ak.r + 1}·${ak.c + 1}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyrack",
  means: "A hotel key board of twelve hooks: the key under the pointer swings out on its hook and lifts, the keys around it swing a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[155, 89], [222, 174], [256, 241], null],
  mount,
});
