/**
 * ATMs: a bank wall with three cash machines set in it, each a fascia with a
 * screen, a keypad, a card slot and a cash slot. The pointer picks a machine
 * on the wall's face: its cash slot pushes out a stack of notes, and the
 * machines beside it push a little, staggered from it. At rest one machine
 * holds its notes half out, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face (depositboxes); the hit is read on the
 * fascias' face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, AW = 30, GAP = 10, M = 10, D = 14, FD = 3, H = 76, Z0 = 12, Z1 = 64, OUT = 22;
const W = 2 * M + N * AW + (N - 1) * GAP, FAV = 1, REST = [2.5, 11, 1.2];
const CZ0 = 21, CZ1 = 24.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + FD + OUT, CZ0], [0, 0, H], [W, 0, H], [0, D, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);
  const Y = D + FD;

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  mk("path", { class: "nf lo", d: seg(P(1.5, D, 6), P(W - 1.5, D, 6)) }, g);

  const atms = [];
  for (let c = 0; c < N; c++) {
    const x0 = M + c * (AW + GAP), x1 = x0 + AW, xm = (x0 + x1) / 2;
    const [fr, fi] = rings(x0, D - 1, x1, Y, 1.6, 0.8);
    const fas = solid(g);
    put(fas, prism(P, front, fr, fi, Z0, Z1));
    let d = poly(rrect(x0 + 4, Z1 - 20, x1 - 4, Z1 - 5, 1.6, 3).map(onFace(Y)));
    // keypad: a pad of twelve keys, three by four
    const kx0 = x0 + 4, kz0 = 31, kw = 3.2, kh = 2.4;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++)
      d += poly(rrect(kx0 + i * (kw + 1), kz0 + j * (kh + 0.9), kx0 + i * (kw + 1) + kw, kz0 + j * (kh + 0.9) + kh, 0.6, 2).map(onFace(Y)));
    // card slot beside the keypad, cash slot below
    d += poly(rrect(x1 - 11, 38, x1 - 4, 40.4, 0.8, 2).map(onFace(Y)));
    d += poly(rrect(xm - 9, CZ0 - 0.8, xm + 9, CZ1 + 0.8, 1, 3).map(onFace(Y)));
    mk("path", { class: "nf lo", d }, fas.g);
    atms.push({ c, xm, x0, x1 });
  }
  // the notes, after every fascia: they only ever come out over the machines below and beside them
  for (const a of atms) {
    a.el = solid(g);
    a.edge = mk("path", { class: "nf lo" }, a.el.g);
    a.s = tween(REST[a.c]);
    a.last = NaN;
  }

  function draw(a, s) {
    const [r, i] = rings(a.xm - 7.5, Y - 1, a.xm + 7.5, Y + s, 0.8, Math.min(0.6, s * 0.3));
    put(a.el, prism(P, front, r, i, CZ0, CZ1));
    const yf = Y + s;
    a.edge.setAttribute("d", seg(P(a.xm - 7, yf, CZ0 + 1.1), P(a.xm + 7, yf, CZ0 + 1.1)) + seg(P(a.xm - 7, yf, CZ0 + 2.3), P(a.xm + 7, yf, CZ0 + 2.3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const a of atms) {
      const s = tval(a.s, now);
      if (s !== a.last) { draw(a, s); a.last = s; }
      if (!tdone(a.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The machine under the point, read on the fascias' face plane (y = D + FD), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + Y * s) / c, YY = x * s + Y * c, z = (YY * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M - GAP / 2 || x > W - M + GAP / 2 || z < Z0 - 8 || z > Z1 + 4) return -1;
    return clamp(Math.floor((x - M + GAP / 2) / (AW + GAP)), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    atms.forEach((m, k) => {
      const d = Math.abs(k - a);
      const s = a < 0 ? REST[k] : d === 0 ? OUT : d === 1 ? 6 : 2.4;
      tset(m.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      m.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "atm " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "atms",
  means: "A bank wall with three cash machines: the one under the pointer pushes a stack of notes out of its slot, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 60, 120],
  tour: [[139, 138], [204, 170], [269, 203], null],
  mount,
});
