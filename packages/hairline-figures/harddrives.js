/**
 * Hard drives: a five-bay drive enclosure standing on its feet, each bay a
 * tall sled with a pull latch and an activity light on its front. The
 * pointer picks a bay on the enclosure's face: its drive slides out toward
 * the reader, and the drives beside it ease out a little, staggered from it.
 * At rest one drive stands half drawn, bright, and the others sit unevenly
 * proud of the face. The slider is the stagger.
 *
 * The pattern: one of many on a face; tweens per sled, the hit read on the
 * face plane (y = D), which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, BW = 13, M = 6, BASE = 6, BH = 40, TOP = 7, D = 40, IN = 1, OUT = 30, FAV = 1;
const W = 2 * M + N * BW, H = BASE + BH + TOP;
const PROUD = [1.4, 14, 0.8, 2.6, 1.2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, -3], [W, D, -3], [W, 0, -3], [0, D + OUT, BASE], [0, 0, H], [W, 0, H], [0, D + OUT, BASE + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  for (const fx of [5, W - 5]) put(solid(g), prism(P, front, rings(fx - 3, 3, fx + 3, D - 3, 1.5, 0.6)[0], null, -3, 0));
  const [er, ei] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, er, ei, 0, H));
  // a vent grille across the top of the face, and the frame of the bay field
  mk("path", { d: [0, 1, 2].map((k) => seg(P(M + 4, D, BASE + BH + 2 + k * 1.6), P(W - M - 4, D, BASE + BH + 2 + k * 1.6))).join(""), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(M - 1.6, BASE - 1.4, W - M + 1.6, BASE + BH + 1.4, 1.4, 3).map(onFace(D))), class: "nf lo" }, g);

  const bays = [];
  for (let i = 0; i < N; i++) {
    const x0 = M + i * BW + IN, x1 = M + (i + 1) * BW - IN, z0 = BASE + IN, z1 = BASE + BH - IN;
    mk("path", { d: poly(rrect(x0 - 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    bays.push({ i, x0, x1, z0, z1, rest: PROUD[i] });
  }
  // left to right: a sled is only ever hidden by one to its right
  for (const b of bays) {
    b.el = solid(g);
    b.latch = mk("path", { class: "nf lo" }, b.el.g);
    b.led = mk("path", { class: "nf" }, b.el.g);
    b.s = tween(b.rest);
    b.last = NaN;
  }

  const lamp = circ(0.9, 10);
  function draw(b, s) {
    const y = D + s, xm = (b.x0 + b.x1) / 2;
    const [r, i] = rings(b.x0, D, b.x1, y, 1.2, Math.min(0.9, s * 0.4));
    put(b.el, prism(P, front, r, i, b.z0, b.z1));
    b.latch.setAttribute("d", poly(rrect(xm - 3, b.z0 + 3, xm + 3, b.z0 + 13, 1.2, 3).map(onFace(y))) + seg(P(xm - 3.6, y, b.z1 - 9), P(xm + 3.6, y, b.z1 - 9)));
    b.led.setAttribute("d", poly(lamp.map((q) => P(xm + q.u, y, b.z1 - 4 + q.v))));
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

  /** The bay under the point, read on the face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE - 2 || z > BASE + BH + 2) return -1;
    return clamp(Math.floor((x - M) / BW), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bays.forEach((b, i) => {
      const dist = Math.abs(i - a);
      const s = a < 0 ? b.rest : dist === 0 ? OUT : dist === 1 ? 5 : 1.4;
      tset(b.s, s, now, from >= 0 ? Math.abs(i - from) * stag : 0);
      b.el.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : `bay ${a + 1}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "harddrives",
  means: "A five-bay drive enclosure: the drive under the pointer slides out of its bay toward you, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 151], [191, 172], [233, 193], null],
  mount,
});
