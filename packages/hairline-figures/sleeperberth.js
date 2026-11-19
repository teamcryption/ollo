/**
 * Sleeper berth: one side of a sleeper compartment, the wall, a lower berth
 * with its pillow, and an upper berth hinged to the wall on two straps. The
 * pointer over the compartment folds the upper bunk down on a spring, from
 * stowed against the wall to flat; the straps follow its outer edge. At rest
 * the bunk is folded up, bright. The slider is how far it comes down.
 *
 * The pattern: one part following the pointer; the hit is the rest pose's box.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 80, D = 24, WZ = 66, LZ = 14, ZH = 34, T = 3.2, REST = 74, AZ = ZH + 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  const box = [[0, -3, 0], [L, D, 0], [L, -3, 0], [0, D, 0], [0, -3, WZ], [L, -3, WZ], [L, D, ZH + T]];
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the compartment wall, with the strap anchors
  const wall = solid(g);
  const [wr, wi] = rings(0, -3, L, 0, 1.4, 0.6);
  put(wall, prism(P, front, wr, wi, 0, WZ));
  // the lower berth, its mattress line and a pillow at the head
  const low = solid(g);
  const [lr, li] = rings(0, 0, L, D, 3, 1.4);
  put(low, prism(P, front, lr, li, 0, LZ));
  mk("path", { class: "nf lo", d: seg(P(1.5, D, LZ - 4), P(L - 1.5, D, LZ - 4)) }, low.g);
  const [pr, pi] = rings(3, 3, 17, D - 3, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, LZ, LZ + 4));

  // the upper berth: a rounded slab turning about the hinge along the wall
  const bunk = solid(g), mat = mk("path", { class: "nf lo" }, bunk.g);
  const straps = mk("path", { class: "nf lo" }, g);
  const ring = rrect(0, 0, L, D, 3, 6), inner = rrect(2, 2, L - 2, D - 2, 2, 6);
  const W = (u, v, t, c, s) => P(u, v * c + (T - t) * s, ZH + v * s + t * c);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const pts = [];
    for (const q of ring) pts.push(W(q.u, q.v, 0, c, s), W(q.u, q.v, T, c, s));
    bunk.sil.setAttribute("d", poly(hull(pts)));
    const tf = Math.tan(rad(a)) < 0.8 ? T : 0;
    mat.setAttribute("d", poly(inner.map((q) => W(q.u, q.v, tf, c, s))));
    let d = "";
    for (const u of [5, L - 5]) d += seg(P(u, 0, AZ), W(u, D - 1, T, c, s));
    straps.setAttribute("d", d);
  }
  mk("path", { class: "nf", d: [5, L - 5].map((u) => poly(rrect(u - 1.4, AZ - 1.4, u + 1.4, AZ + 1.4, 1, 3).map((q) => P(q.u, 0, q.v)))).join("") }, g);

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt);
    draw(clamp(ang.x, 0, 85));
    return m;
  });
  bag.add(B.unregister);

  // the hit: the rest pose's screen box
  const pts = box.map((p) => P(...p));
  const Lx = Math.min(...pts.map((p) => p[0])), Rx = Math.max(...pts.map((p) => p[0]));
  const Ty = Math.min(...pts.map((p) => p[1])), By = Math.max(...pts.map((p) => p[1]));
  const hit = ([sx, sy]) => sx >= Lx && sx <= Rx && sy >= Ty && sy <= By;
  function setPointer(on) {
    ang.t = on ? clamp(REST * (1 - reach), 0, REST) : REST;
    read.textContent = on ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  bunk.sil.classList.add("hi");
  setPointer(false);
  bag.add(pointer(stage, { move: (p) => setPointer(hit(p)), leave: () => setPointer(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "sleeperberth",
  means: "A sleeper compartment: the upper berth, stowed against the wall, folds down flat on its straps when the pointer comes in.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[197, 151], [130, 215], [240, 245], null],
  mount,
});
