/**
 * Sorting cubbies: a mail rack of twelve open cubbies, four across and three
 * high, each holding a letter or a parcel whose front stands proud of the
 * rack. The pointer picks a cubby on the rack's face: its piece slides out
 * toward the reader, and the pieces around it come out a little, staggered
 * from it. At rest the pieces stand unevenly out, one letter half pulled,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many on a face (depositboxes); the hit is read on the
 * rack's face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, CW = 24, CH = 18, M = 3, D = 18, OUT = 22;
const W = 2 * M + NC * CW, H = 2 * M + NR * CH + 4, FAV = [1, 1];
const PARCEL = [[0, 2], [2, 0], [3, 1]];
const PROUD = [[1.6, 3, 1.2], [2.2, 10, 1.4], [1.2, 1.6, 3.4], [2.8, 1.2, 1.8]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + OUT, M], [0, 0, H], [W, 0, H], [0, D, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 2.4, 1.2);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const items = [];
  let mouths = "";
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = M + c * CW + 1, x1 = M + (c + 1) * CW - 1, z0 = M + 4 + r * CH, z1 = z0 + CH - 2;
    mouths += poly(rrect(x0, z0, x1, z1, 1.2, 3).map(onFace(D)));
    const parcel = PARCEL.some(([pc, pr]) => pc === c && pr === r);
    items.push({ c, r, x0: x0 + (parcel ? 3 : 2), x1: x1 - (parcel ? 3 : 2), z0: z0 + 0.6, z1: z0 + (parcel ? 10 : 2.2), parcel, rest: PROUD[c][r] });
  }
  mk("path", { class: "nf lo", d: mouths + seg(P(1.4, D, M + 1.6), P(W - 1.4, D, M + 1.6)) }, g);
  // left to right, bottom to top: a piece is only ever hidden by one to its right or above it
  for (const it of items) {
    it.el = solid(g);
    it.mark = mk("path", { class: "nf lo" }, it.el.g);
    it.s = tween(it.rest);
    it.last = NaN;
  }

  function draw(it, s) {
    const yf = D + s, xm = (it.x0 + it.x1) / 2;
    const [r, i] = rings(it.x0, D, it.x1, yf, 0.8, Math.min(0.6, s * 0.3));
    put(it.el, prism(P, front, r, i, it.z0, it.z1));
    let d;
    if (it.parcel) d = seg(P(xm, D, it.z1), P(xm, yf, it.z1)) + seg(P(xm, yf, it.z0), P(xm, yf, it.z1));
    else { const v = Math.min(6, s * 0.6); d = seg(P(it.x0 + 0.8, yf, it.z1), P(xm, yf - v, it.z1)) + seg(P(xm, yf - v, it.z1), P(it.x1 - 0.8, yf, it.z1)); }
    it.mark.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) {
      const s = tval(it.s, now);
      if (s !== it.last) { draw(it, s); it.last = s; }
      if (!tdone(it.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The cubby under the point, read on the rack's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < M + 2 || z > M + 4 + NR * CH) return -1;
    return clamp(Math.floor((x - M) / CW), 0, NC - 1) * NR + clamp(Math.floor((z - M - 4) / CH), 0, NR - 1);
  }

  let act = -2;
  const favI = FAV[0] * NR + FAV[1];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? items[a] : null, fc = from >= 0 ? items[from] : null;
    items.forEach((it, i) => {
      const dist = ac ? Math.abs(it.c - ac.c) + Math.abs(it.r - ac.r) : 0;
      const s = a < 0 ? it.rest : dist === 0 ? OUT : dist === 1 ? 7 : dist === 2 ? 3 : 1.2;
      tset(it.s, s, now, fc ? (Math.abs(it.c - fc.c) + Math.abs(it.r - fc.r)) * stag : 0);
      it.el.sil.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `cubby ${ac.c + 1}·${NR - ac.r}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sortingcubbies",
  means: "A mail sorting rack of twelve cubbies: the letter in the cubby under the pointer slides out toward you, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 184], [183, 157], [268, 159], null],
  mount,
});
