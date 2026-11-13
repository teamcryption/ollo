/**
 * Wine rack: a square box frame with a criss-cross of slats on its face,
 * nine bottles lying in the diamond cells with their shoulders and necks
 * toward the reader, each neck closed by a cork. The pointer picks a bottle
 * on the rack's face: it slides out toward the reader, and the bottles
 * around it ease out a little, staggered from it. At rest the bottles sit
 * unevenly, one half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face (lockers); the hit is read on a fixed
 * plane just in front of the face, through the resting bottle ends.
 */
const {
  Cam, clamp, fit, hull, open, poly, prism, proj, rings, rrect, seg, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 72, D = 26, M = 4, Q = W - 2 * M, S3 = Q / 3, R = 6.4, OUT = 22, FAV = [1, 2];
const REST = [[4, 6.5, 3], [3, 5, 13], [6.5, 2.5, 4.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  const cells = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const u = (i - 1) * S3, v = Q + (j - 1) * S3;
    cells.push({ i, j, cx: M + (u + v) / 2, cz: M + (v - u) / 2 });
  }
  const ext = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, W], [W, 0, W], [W, D, W], [0, D, W]];
  for (const c of cells) ext.push([c.cx - R, D + OUT + 14, c.cz - R]);
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const ringY = (cx, cz, r, y, n = 28) => {
    const out = [];
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; out.push(P(cx + r * Math.cos(a), y, cz + r * Math.sin(a))); }
    return out;
  };

  const g = mk("g", {}, svg);
  // the frame: a box with its opening rimmed on the face, and the slats crossing it
  const [fr, fi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, fr, fi, 0, W));
  const onFace = (x, z) => P(x, D, z);
  let lat = poly(rrect(M, M, W - M, W - M, 1.6, 3).map((q) => onFace(q.u, q.v)));
  for (const c of [-1.5, -0.5, 0.5, 1.5].map((t) => t * S3)) {
    const x0 = Math.max(0, c), x1 = Math.min(Q, Q + c);
    lat += seg(onFace(M + x0, M + x0 - c), onFace(M + x1, M + x1 - c));
    const w = Q + c, a0 = Math.max(0, w - Q), a1 = Math.min(Q, w);
    lat += seg(onFace(M + a0, M + w - a0), onFace(M + a1, M + w - a1));
  }
  mk("path", { d: lat, class: "nf lo" }, g);

  // left to right, bottom to top: a bottle reaching out runs down-left, over the ones before it
  cells.sort((a, b) => a.cx + a.cz - (b.cx + b.cz));
  for (const c of cells) {
    const grp = mk("g", {}, g);
    c.body = mk("path", { class: "sil" }, grp);
    c.cr = mk("path", { class: "nf lo" }, grp);
    c.neck = mk("path", { class: "sil" }, grp);
    c.cork = mk("path", { class: "nf lo" }, grp);
    c.rest = REST[c.i][c.j];
    c.s = tween(c.rest);
    c.last = NaN;
  }

  function draw(c, s) {
    if (s === c.last) return;
    c.last = s;
    const yb = D + s, ys = yb + 5;
    c.body.setAttribute("d", poly(hull(ringY(c.cx, c.cz, R, D).concat(ringY(c.cx, c.cz, R, yb), ringY(c.cx, c.cz, 2.3, ys)))));
    c.cr.setAttribute("d", poly(ringY(c.cx, c.cz, R - 0.6, yb + 0.9)));
    c.neck.setAttribute("d", poly(hull(ringY(c.cx, c.cz, 1.9, ys, 16).concat(ringY(c.cx, c.cz, 1.9, ys + 6, 16), ringY(c.cx, c.cz, 2.4, ys + 6.4, 16), ringY(c.cx, c.cz, 2.4, ys + 8.4, 16)))));
    c.cork.setAttribute("d", poly(ringY(c.cx, c.cz, 1.3, ys + 8.4, 16)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cells) { draw(c, tval(c.s, now)); if (!tdone(c.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The cell under the point, read on the plane y = D + 8, through the resting bottle ends; it never moves. */
  const YH = D + 8;
  function hit([sx, sy]) {
    const co = Math.cos(C.az), si = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + YH * si) / co, Y = x * si + YH * co, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    const X = x - M, Z = z - M, u = X - Z, v = X + Z;
    if (X < 0 || X > Q || Z < 0 || Z > Q) return null;
    const i = Math.floor(u / S3 + 1.5), j = Math.floor((v - Q) / S3 + 1.5);
    if (i < 0 || i > 2 || j < 0 || j > 2) return null;
    return cells.find((c) => c.i === i && c.j === j);
  }

  let act;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a || act;
    act = a;
    for (const c of cells) {
      const d = a ? Math.abs(c.i - a.i) + Math.abs(c.j - a.j) : 0;
      const s = !a ? c.rest : d === 0 ? OUT : d === 1 ? 10 : d === 2 ? clamp(c.rest + 2, 5, 8) : c.rest;
      tset(c.s, s, now, from ? (Math.abs(c.i - from.i) + Math.abs(c.j - from.j)) * stag : 0);
      const on = a ? c === a : c.i === FAV[0] && c.j === FAV[1];
      c.body.classList.toggle("hi", on); c.neck.classList.toggle("hi", on);
    }
    read.textContent = a ? `bottle ${a.i + 1}·${a.j + 1}` : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "winerack",
  means: "A criss-cross wine rack of nine bottles: the bottle under the pointer slides out toward you, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 156], [195, 177], [188, 244], null],
  mount,
});
