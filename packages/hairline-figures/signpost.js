/**
 * Rent sign: a post on a footing with an arm, and a board hung from the arm
 * on two short chains. The pointer over the board swings it out on its
 * chains, toward the street. At rest it hangs a little forward, bright.
 * The slider is how far it swings.
 *
 * The pattern: one part answering (a hinge). Tween on the swing; the hit is
 * the board's rest box on screen, which never moves.
 */
const {
  Cam, fit, hull, poly, proj, rad, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 100, REST = 8;
const near = ([x, y, z]) => 0.61 * x + 0.61 * y + 0.5 * z;
/** a rounded slab in a local (u, v) plane, thickness t along w; T maps local to world */
function slab(P, T, u0, v0, u1, v1, r, t) {
  const ring = rrect(u0, v0, u1, v1, r, 3);
  const A = ring.map((q) => T(q.u, q.v, 0)), B = ring.map((q) => T(q.u, q.v, t));
  const um = (u0 + u1) / 2, vm = (v0 + v1) / 2, top = near(T(um, vm, t)) >= near(T(um, vm, 0));
  return { sil: poly(hull(A.concat(B).map((p) => P(...p)))), crease: poly((top ? B : A).map((p) => P(...p))), w: top ? t : 0 };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const sw = (u, s, w, th) => [u, s * Math.sin(th) + w * Math.cos(th), Z0 - s * Math.cos(th) + w * Math.sin(th)];
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-10, -10, 0], [10, 10, 0], [74, 0, Z0 + 6], [70, 0, Z0 - 48], sw(70, 48, 0, rad(80)), [0, 0, Z0 + 10]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  put(solid(g), slab(P, (u, v, w) => [u, v, w], -10, -10, 10, 10, 3, 3));
  put(solid(g), slab(P, (u, v, w) => [u, w - 3, v], -3, 3, 3, Z0 + 12, 1, 6));
  put(solid(g), slab(P, (u, v, w) => [u, w - 2.5, v], -4, Z0, 74, Z0 + 5, 1, 5));
  const chains = mk("path", { class: "nf" }, g);
  const board = solid(g);
  const face = mk("path", { class: "nf lo" }, board.g);
  const sw0 = tween(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), T = (u, v, w) => sw(u, v, w - 1, th);
    const s = slab(P, T, 12, 6, 68, 46, 2, 2);
    put(board, s);
    let d = "";
    for (const x of [18, 62]) d += seg(P(x, 0, Z0), P(...T(x, 6, 1)));
    chains.setAttribute("d", d);
    let f = poly(rrect(16, 10, 64, 42, 1.5, 2).map((q) => P(...T(q.u, q.v, s.w))));
    for (const [a, b, v] of [[22, 58, 20], [26, 54, 28], [30, 50, 35]]) f += seg(P(...T(a, v, s.w)), P(...T(b, v, s.w)));
    face.setAttribute("d", f);
  }

  const B = register(stage, (_dt, now) => { draw(tval(sw0, now)); return !tdone(sw0, now); });
  bag.add(B.unregister);

  const box = [[12, 6], [68, 6], [12, 46], [68, 46]].map(([u, v]) => P(...sw(u, v, 0, rad(REST))));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) - 6 && sx < Math.max(...xs) + 6 && sy > Math.min(...ys) - 10 && sy < Math.max(...ys) + 6;

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(sw0, a ? amp : REST, performance.now(), 0);
    board.sil.classList.add("hi");
    read.textContent = a ? Math.round(amp) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { tset(sw0, amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "signpost",
  means: "A rent sign hung from a post's arm: the pointer over the board swings it out on its chains.",
  rules: [1, 4, 5, 6],
  range: [30, 60, 80],
  tour: [[200, 160], [210, 170], [200, 180], null],
  mount,
});
