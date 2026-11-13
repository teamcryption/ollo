/**
 * Filing cabinet: a steel cabinet of four drawers, each with a cup pull and
 * a label slot on its front and hanging files inside. The pointer's height
 * says which drawer: the drawer at that height slides open, the drawers near
 * it come ajar, the farther the less, each on its own spring, and the one
 * under it is bright. At rest one drawer stands half open on its files and
 * the one under it is ajar. The slider is the reach, in drawers.
 *
 * The pattern: a field along one axis (terrain). The height is read on the
 * cabinet's face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 50, D = 54, DH = 21, GAP = 2.2, Z0 = 5, OUT = 32, IN = 2.4;
const H = Z0 + N * (DH + GAP) + 4;
const REST = [5, 18, 0, 0], FAV = 1;
// 1 at the pointer, .31 at 42% of the reach, .09 beyond it
const fall = (u) => (u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 - ((u - 0.42) / 0.58) * 0.22 : 0.09);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[0, 0, 0], [W, D + OUT, 0], [W, 0, 0], [0, D + OUT, 0], [0, 0, H], [W, 0, H]], 200, 164);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  // the cabinet's body, its plinth, and the mouth of its open front, behind the drawers
  const [cr, ci] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, cr, null, 0, H));
  mk("path", { d: seg(P(1.5, D, Z0 - 2), P(W - 1.5, D, Z0 - 2)), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(1.4, Z0 - 0.6, W - 1.4, H - 2.4, 1.2, 2).map(onFace(D))), class: "nf lo" }, g);

  const drawers = [];
  for (let k = 0; k < N; k++) {
    const z0 = Z0 + k * (DH + GAP), el = solid(g);
    const files = mk("path", { class: "nf lo" }, el.g), pull = mk("path", { class: "nf" }, el.g), label = mk("path", { class: "nf lo" }, el.g);
    drawers.push({ k, z0, el, files, pull, label, sp: spring(REST[k], { eps: 0.05 }), drawn: NaN });
  }
  // the cabinet's side, top and lock, painted over the drawers' insides
  mk("path", { d: poly([P(W, 0, 0), P(W, D, 0), P(W, D, H), P(W, 0, H)]), class: "sil" }, g);
  const [tr, ti] = rings(-0.6, -0.6, W + 0.6, D + 0.6, 3.2, 1.6);
  put(solid(g), prism(P, front, tr, ti, H - 0.01, H + 1.4));
  mk("path", { d: poly(rrect(W / 2 - 1.6, H - 3.6, W / 2 + 1.6, H - 0.8, 1.4, 3).map(onFace(D))), class: "nf" }, g);

  function draw(b) {
    const s = Math.max(0, b.sp.x);
    if (s === b.drawn) return;
    b.drawn = s;
    const zt = b.z0 + DH, y = D + s, xm = W / 2;
    const [r, i] = rings(IN, s, W - IN, y, 1.6, 1);
    put(b.el, prism(P, front, r, i, b.z0, zt));
    // hanging files: the tops of the folders, where the drawer has left the cabinet
    let f = "";
    for (let fy = y - 5; fy > D + 1.5; fy -= 3.6) f += seg(P(IN + 4, fy, zt), P(W - IN - 4, fy, zt));
    b.files.setAttribute("d", f);
    b.pull.setAttribute("d", poly(rrect(xm - 9, zt - 11.5, xm + 9, zt - 8, 1.6, 3).map(onFace(y))));
    b.label.setAttribute("d", poly(rrect(xm - 7, zt - 6, xm + 7, zt - 2.6, 0.8, 2).map(onFace(y))));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of drawers) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  /** The height on the cabinet's face (y = D) under the point; null off the face. */
  function height([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    return x < -OUT || x > W + 6 || z < 0 || z > H ? null : z;
  }

  function retarget() {
    let mark = FAV;
    if (over == null) drawers.forEach((b) => (b.sp.t = REST[b.k]));
    else {
      drawers.forEach((b) => (b.sp.t = clamp(OUT * fall(Math.abs(b.z0 + DH / 2 - over) / (reach * (DH + GAP))), 0, OUT)));
      mark = clamp(Math.floor((over - Z0) / (DH + GAP)), 0, N - 1);
    }
    drawers.forEach((b) => b.el.sil.classList.toggle("hi", b.k === mark));
    read.textContent = over == null ? "rest" : "drawer " + (N - mark);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = height(p); retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over != null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "filingcabinet",
  means: "A four-drawer filing cabinet: the drawer at the pointer's height slides open on its files, the ones near it come ajar.",
  rules: [1, 3, 5, 6],
  range: [1.2, 2, 3],
  tour: [[186, 108], [186, 189], [186, 237], null],
  mount,
});
