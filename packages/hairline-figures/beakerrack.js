/**
 * Pencil sharpener: an electric desk sharpener, a rounded block with a pencil
 * standing out of the hole in its near-left face and a shavings drawer in its
 * near-right face. The pointer on the pencil presses it in to sharpen; on the
 * drawer, the drawer slides out. At rest the pencil sits half in, bright, and
 * the drawer is left a little ajar. The slider is how far the drawer opens.
 *
 * The pattern: two parts, each a discrete choice; the hit is on the parts'
 * rest centres in screen space, so nothing moves out from under the pointer.
 */
const {
  Cam, clamp, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 30, Y1 = 26, TOP = 28, HX = 15, HZ = 16, PR = 3.4, PL = 44, INS = [6, 30], AJAR = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[0, 0, 0], [X1 + 20, 4, 0], [X1 + 20, Y1 - 4, 11], [0, Y1, TOP], [X1, 0, TOP], [0, Y1, 0],
    [HX - PR, Y1 + PL - INS[0], HZ - PR], [HX + PR, Y1 + PL - INS[0], HZ + PR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a ring in the x–z plane at depth y, as world points
  const ringXZ = (y, r, n, a0) => Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return [HX + r * Math.cos(a), y, HZ + r * Math.sin(a)];
  });

  // the body: one rounded block, the hole on its near-left face, a vent slot on top
  const [ring, inner] = rings(0, 0, X1, Y1, 5, 1.4);
  const body = solid(g);
  put(body, prism(P, front, ring, inner, 0, TOP));
  mk("path", { class: "nf lo", d: poly(ringXZ(Y1, PR + 1.8, 20, 0).map((p) => P(...p))) +
    poly(ringAt(P, rrect(7, 5, 23, 8, 1.4, 4), TOP)) }, body.g);

  // the drawer: only the part standing proud of the near-right face
  const drawer = solid(g), dOut = tween(AJAR);
  let dLast = NaN;
  function drawDrawer(o) {
    if (o === dLast) return;
    dLast = o;
    const [r, i] = rings(X1, 5, X1 + 1.2 + o, Y1 - 5, 1.4, 0.6);
    const pr = prism(P, front, r, i, 1.5, 11);
    pr.crease += seg(P(X1 + 1.2 + o, Y1 / 2 - 3, 7), P(X1 + 1.2 + o, Y1 / 2 + 3, 7));
    put(drawer, pr);
  }

  // the pencil: a hexagonal rod along y, out of the hole, a ferrule band near its end
  const pg = mk("g", {}, g);
  const pSil = mk("path", { class: "sil" }, pg), pCr = mk("path", { class: "nf lo" }, pg);
  const ins = tween(INS[0]);
  let pLast = NaN;
  const vis = (a) => 0.61 * Math.cos(a) + 0.5 * Math.sin(a) > -0.2;
  function drawPencil(d) {
    if (d === pLast) return;
    pLast = d;
    const yEnd = Y1 + PL - d, a0 = Math.PI / 6;
    const near = ringXZ(yEnd, PR, 6, a0), far = ringXZ(Y1, PR, 6, a0);
    pSil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    const band = [];
    for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; if (vis(a)) band.push(P(HX + PR * Math.cos(a), yEnd - 7, HZ + PR * Math.sin(a))); }
    pCr.setAttribute("d", poly(near.map((p) => P(...p))) + open(band));
  }

  const B = register(stage, (_dt, now) => {
    drawDrawer(tval(dOut, now));
    drawPencil(tval(ins, now));
    return !tdone(dOut, now) || !tdone(ins, now);
  });
  bag.add(B.unregister);

  // the hit: nearest part by its rest centre on screen
  const anchors = [P(HX, Y1 + (PL - INS[0]) * 0.6, HZ), P(X1 + 6, Y1 / 2, 6)];
  function hit([sx, sy]) {
    let best = -1, bd = 46;
    anchors.forEach(([ax, ay], k) => { const d = Math.hypot(sx - ax, sy - ay); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tset(ins, a === 0 ? INS[1] : INS[0], now, 0);
    tset(dOut, a === 1 ? clamp(reach, 4, 20) : AJAR, now, a === 1 ? 0 : 60);
    pSil.classList.toggle("hi", a <= 0);
    drawer.sil.classList.toggle("hi", a === 1);
    read.textContent = a < 0 ? "rest" : a === 0 ? "sharpen" : "drawer";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act === 1) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "beakerrack",
  means: "An electric pencil sharpener: the pencil under the pointer presses in to sharpen, or the shavings drawer slides out.",
  rules: [1, 4, 5, 8],
  range: [4, 12, 20],
  tour: [[103, 185], [280, 191], [140, 178], null],
  mount,
});
