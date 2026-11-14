/**
 * Room keys: a reception key board with two rows of five pegs, each holding
 * a key and its fob tag on a split ring. The pointer picks a key on the
 * board's face: it swings out from its peg toward the reader, and the keys
 * around it sway out a little, staggered from it. At rest the keys hang a
 * touch unevenly and one is swung half out, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many on a face (lockers). The hit is read on the
 * board's face plane, which never moves; paint order follows each fob's
 * depth as it swings.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, proj, rad, rings, prism, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 5, NR = 2, CW = 18, M = 6, BD = 6, H = 70, ZH = [61, 31], OUT = 62, FAV = 7;
const W = 2 * M + NC * CW;
const REST = [4, 0, 9, 2, 0, 3, 0, 28, 6, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [W, BD, 0], [W, 0, 0], [0, 0, H], [W, 0, H], [W, BD + 26, 22], [0, BD + 26, 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the board: a slab with its frame line, and one peg per key
  const [br, bi] = rings(0, 0, W, BD, 2.5, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(rrect(3, 3, W - 3, H - 3, 2, 3).map((q) => P(q.u, BD, q.v))), class: "nf lo" }, g);
  const keys = [], cols = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const xh = M + CW * (c + 0.5), zh = ZH[r];
    cols.push(seg(P(xh, BD, zh - 1), P(xh, BD + 3, zh)));
    keys.push({ i: keys.length, r, c, xh, zh, rest: REST[keys.length] });
  }
  mk("path", { d: cols.join(""), class: "nf" }, g);
  const kg = mk("g", {}, g);
  for (const k of keys) {
    k.el = solid(kg); k.ring = mk("path", { class: "nf" }, k.el.g); k.key = mk("path", { class: "nf" }, k.el.g);
    k.a = tween(k.rest); k.last = NaN;
  }

  const tag = rrect(-6.5, 6.5, 1.5, 22, 2.4, 3), loop = (cu, cd, rr, n = 18) => Array.from({ length: n }, (_, i) => ({ u: cu + rr * Math.cos((i / n) * 2 * Math.PI), v: cd + rr * Math.sin((i / n) * 2 * Math.PI) }));
  function draw(k, deg) {
    if (deg === k.last) return;
    k.last = deg;
    const s = Math.sin(rad(deg)), co = Math.cos(rad(deg));
    // u along the board, d down the hang, n out of the key's own plane
    const at = (n) => (q) => P(k.xh + q.u, BD + 2.6 + q.v * s + n * co, k.zh - q.v * co + n * s);
    const fr = tag.map(at(1.6));
    k.el.sil.setAttribute("d", poly(hull(tag.map(at(0)).concat(fr))));
    k.el.cr.setAttribute("d", poly(fr));
    k.ring.setAttribute("d", poly(loop(0, 3.2, 2.6).map(at(0.8))));
    const kp = at(2);
    k.key.setAttribute("d", poly(loop(4.6, 8.2, 2.1, 14).map(kp)) + open([{ u: 4.6, v: 10.3 }, { u: 4.6, v: 20 }, { u: 6.4, v: 20 }, { u: 6.4, v: 18.2 }, { u: 4.6, v: 18.2 }].map(kp)) + seg(kp({ u: 4.6, v: 15.6 }), kp({ u: 6.2, v: 15.6 })));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.a, now)); if (!tdone(k.a, now)) moving = true; }
    const depth = (k) => k.xh + 20 * Math.sin(rad(tval(k.a, now))) + k.r * 0.1;
    const order = keys.slice().sort((a, b) => depth(a) - depth(b)), key = order.map((k) => k.i).join();
    if (key !== painted) { painted = key; for (const k of order) kg.appendChild(k.el.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** The key under the point, read on the board's face plane (y = BD), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + BD * s) / c, Y = x * s + BD * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M) return -1;
    const r = ZH.findIndex((zh) => z <= zh + 5 && z >= zh - 25);
    return r < 0 ? -1 : r * NC + clamp(Math.floor((x - M) / CW), 0, NC - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? keys[a] : null, fc = from >= 0 ? keys[from] : null;
    keys.forEach((k, i) => {
      const d = ac ? Math.abs(k.c - ac.c) + Math.abs(k.r - ac.r) : 0;
      const deg = a < 0 ? k.rest : d === 0 ? OUT : d === 1 ? 16 : d === 2 ? 6 : 1.5;
      tset(k.a, deg, now, fc ? (Math.abs(k.c - fc.c) + Math.abs(k.r - fc.r)) * stag : 0);
      k.el.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "roomkeys",
  means: "A reception key board with two rows of keys on fob tags: the key under the pointer swings out from its peg, and its neighbours sway.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[155, 115], [155, 173], [270, 231], null],
  mount,
});
