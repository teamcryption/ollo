/**
 * Safe-deposit boxes: a bank vault wall of twelve boxes, four across and
 * three high, each front with a small card plate and the two keyholes of a
 * bank key and a guest key. The pointer picks a box on the wall's face: it
 * slides out of the wall, and the boxes around it come out a little,
 * staggered from it. Only the part of a box outside the face is drawn, so
 * the gaps of the grid never show through. At rest one box stands half
 * drawn, bright, and a few sit unevenly proud of the wall. The slider is
 * the stagger.
 *
 * The pattern: one of many on a face (lockers). Tweens per box; the hit is
 * read on the wall's face plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, CW = 26, CH = 15, M = 6, BASE = 8, D = 16, IN = 1.1, OUT = 30;
const W = 2 * M + NC * CW, H = BASE + NR * CH + M, FAV = [1, 1];
const PROUD = [[1.2, 2.6, 1.2], [1.2, 16, 1.6], [1.2, 1.2, 2.2], [3, 1.2, 1.2]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + OUT, BASE], [0, 0, H], [W, 0, H], [0, D + OUT, H - M]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  // the wall: a slab with its plinth line and the frame of the box field on its face
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  mk("path", { d: seg(P(1.5, D, BASE - 3), P(W - 1.5, D, BASE - 3)), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(M - 2, BASE - 1.4, W - M + 2, BASE + NR * CH + 1.4, 1.4, 3).map(onFace(D))), class: "nf lo" }, g);

  const boxes = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = M + c * CW + IN, x1 = M + (c + 1) * CW - IN, z0 = BASE + r * CH + IN, z1 = BASE + (r + 1) * CH - IN;
    // the box's mouth in the wall, painted before any box comes out over it
    mk("path", { d: poly(rrect(x0 - 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    boxes.push({ c, r, x0, x1, z0, z1, rest: PROUD[c][r] });
  }
  // left to right, bottom to top: a box is only ever hidden by one to its right or above it
  for (const b of boxes) {
    b.el = solid(g);
    b.plate = mk("path", { class: "nf lo" }, b.el.g);
    b.keys = mk("path", { class: "nf" }, b.el.g);
    b.s = tween(b.rest);
    b.last = NaN;
  }

  const hole = circ(1.1, 12);
  function draw(b, s) {
    const y = D + s, xm = (b.x0 + b.x1) / 2, zm = (b.z0 + b.z1) / 2 - 1;
    const [r, i] = rings(b.x0, D, b.x1, y, 1.2, Math.min(0.9, s * 0.4));
    put(b.el, prism(P, front, r, i, b.z0, b.z1));
    b.plate.setAttribute("d", poly(rrect(xm - 5, b.z1 - 4.4, xm + 5, b.z1 - 1.8, 0.6, 2).map(onFace(y))));
    let k = "";
    for (const cx of [xm - 6, xm + 6]) {
      k += poly(hole.map((q) => P(cx + q.u, y, zm + 0.6 + q.v)));
      k += seg(P(cx, y, zm - 0.2), P(cx, y, zm - 2.6));
    }
    b.keys.setAttribute("d", k);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) {
      const s = tval(b.s, now);
      if (s !== b.last) { draw(b, s); b.last = s; }
      if (!tdone(b.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The box under the point, read on the wall's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE || z > BASE + NR * CH) return -1;
    return clamp(Math.floor((x - M) / CW), 0, NC - 1) * NR + clamp(Math.floor((z - BASE) / CH), 0, NR - 1);
  }

  let act = -2;
  const favI = FAV[0] * NR + FAV[1];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? boxes[a] : null, fc = from >= 0 ? boxes[from] : null;
    boxes.forEach((b, i) => {
      const dist = ac ? Math.abs(b.c - ac.c) + Math.abs(b.r - ac.r) : 0;
      const s = a < 0 ? b.rest : dist === 0 ? OUT : dist === 1 ? 7 : dist === 2 ? 2.6 : 1.2;
      tset(b.s, s, now, fc ? (Math.abs(b.c - fc.c) + Math.abs(b.r - fc.r)) * stag : 0);
      b.el.sil.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `box ${ac.c + 1}·${NR - ac.r}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "depositboxes",
  means: "A vault wall of twelve safe-deposit boxes: the box under the pointer slides out of the wall, and the boxes around it come out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[143, 105], [235, 166], [281, 239], null],
  mount,
});
