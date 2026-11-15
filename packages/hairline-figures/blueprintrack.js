/**
 * Plan chest: a low architect's cabinet of five wide, shallow drawers for
 * flat drawings, standing on a plinth. The pointer picks a drawer on the
 * chest's face: it slides out, and its neighbours come out a little,
 * staggered from it. At rest one drawer stands half open, bright. The
 * slider is the stagger.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NR = 5, CW = 96, CH = 10, M = 5, BASE = 9, D = 56, IN = 0.9, OUT = 40;
const W = 2 * M + CW, H = BASE + NR * CH + M, FAV = 2;
const PROUD = [1.2, 3, 22, 1.6, 1.2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + OUT, BASE], [0, 0, H], [W, 0, H], [W, D + OUT, H - M]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  mk("path", { d: seg(P(1.5, D, BASE - 3), P(W - 1.5, D, BASE - 3)), class: "nf lo" }, g);

  const boxes = [];
  for (let r = 0; r < NR; r++) {
    const x0 = M + IN, x1 = M + CW - IN, z0 = BASE + r * CH + IN, z1 = BASE + (r + 1) * CH - IN;
    mk("path", { d: poly(rrect(x0 - 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    boxes.push({ r, x0, x1, z0, z1, rest: PROUD[r] });
  }
  for (const b of boxes) {
    b.el = solid(g);
    b.plate = mk("path", { class: "nf lo" }, b.el.g);
    b.pull = mk("path", { class: "nf" }, b.el.g);
    b.s = tween(b.rest);
    b.last = NaN;
  }

  function draw(b, s) {
    const y = D + s, xm = (b.x0 + b.x1) / 2, zm = (b.z0 + b.z1) / 2;
    const [r, i] = rings(b.x0, D, b.x1, y, 1.2, Math.min(0.9, s * 0.4));
    put(b.el, prism(P, front, r, i, b.z0, b.z1));
    b.plate.setAttribute("d", poly(rrect(b.x0 + 6, zm - 1.6, b.x0 + 18, zm + 1.6, 0.5, 2).map(onFace(y))));
    b.pull.setAttribute("d", poly(rrect(xm - 9, zm - 1.1, xm + 9, zm + 1.1, 1, 3).map(onFace(y))));
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

  /** The drawer under the point, read on the chest's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE || z > BASE + NR * CH) return -1;
    return clamp(Math.floor((z - BASE) / CH), 0, NR - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boxes.forEach((b, i) => {
      const dist = a >= 0 ? Math.abs(i - a) : 0;
      const s = a < 0 ? b.rest : dist === 0 ? OUT : dist === 1 ? 5 : 1.2;
      tset(b.s, s, now, from >= 0 ? Math.abs(i - from) * stag : 0);
      b.el.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : `drw ${NR - a}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "blueprintrack",
  means: "A plan chest of five wide flat drawers: the drawer under the pointer slides out, and its neighbours open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[186, 143], [186, 186], [186, 230], null],
  mount,
});
