/**
 * Record player: a plinth with a platter and record, a tonearm on its post,
 * and a dust lid hinged along the back. The pointer over the deck opens the
 * lid and swings the arm onto the record, staggered. At rest the lid is ajar,
 * bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 110, D = 84, PZ = 14, LH = 16, AJ = 12;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, PZ + D], [W, 0, PZ + D]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let a, b;
  [a, b] = rings(0, 0, W, D, 6, 2); put(solid(g), prism(P, front, a, b, 0, PZ));
  put(solid(g), prism(P, front, disc(44, 44, 34), disc(44, 44, 32), PZ, PZ + 3));
  const rec = solid(g);
  put(rec, prism(P, front, disc(44, 44, 31), disc(44, 44, 12), PZ + 3, PZ + 4));
  mk("path", { d: poly(ringAt(P, disc(44, 44, 6, 20), PZ + 4)), class: "nf lo" }, g);
  [a, b] = rings(88, 12, 100, 24, 6, 1); put(solid(g), prism(P, front, a, b, PZ, PZ + 6));
  const arm = mk("path", { class: "nf" }, g), lid = mk("path", { class: "sil" }, g), lidc = mk("path", { class: "nf lo" }, g);
  const tA = tween(AJ), tR = tween(0);
  let lastA = NaN, lastR = NaN;

  function box(ang) {
    const c = Math.cos(rad(ang)), s = Math.sin(rad(ang)), pts = [];
    const q = (x, y, h) => P(x, y * c - h * s, PZ + y * s + h * c);
    for (const x of [0, W]) for (const y of [0, D]) for (const h of [0, LH]) pts.push(q(x, y, h));
    const cr = [q(2, D, LH), q(2, 2, LH), q(W - 2, 2, LH)];
    return [hull(pts), cr];
  }
  function draw(ang, r) {
    if (ang !== lastA) { lastA = ang; const [h, cr] = box(ang); lid.setAttribute("d", poly(h)); lidc.setAttribute("d", "M" + cr.map((p) => p.join(",")).join("L")); }
    if (r !== lastR) {
      lastR = r;
      const t = rad(100 + r * 42), ex = 94 + 58 * Math.cos(t), ey = 18 + 58 * Math.sin(t), z = PZ + 8;
      const pts = [];
      for (const [x, y] of [[94, 18], [ex, ey]]) for (const dz of [0, 2.4]) for (const [dx, dy] of [[-1.4, -1.4], [1.4, 1.4]]) pts.push(P(x + dx, y + dy, z + dz));
      arm.setAttribute("d", poly(hull(pts)));
    }
  }
  const B = register(stage, (_dt, now) => {
    draw(tval(tA, now), tval(tR, now));
    return !(tdone(tA, now) && tdone(tR, now));
  });
  bag.add(B.unregister);

  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    const now = performance.now();
    tset(tA, o ? 78 : AJ, now, o ? 0 : stag);
    tset(tR, o ? 1 : 0, now, o ? stag : 0);
    lid.classList.toggle("hi", !o);
    rec.sil.classList.toggle("hi", o);
    read.textContent = o ? "play" : "rest";
    B.wake();
  }
  set(false);
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, PZ);
    set(wx > -20 && wx < W + 20 && wy > -20 && wy < D + 20);
  }
  bag.add(pointer(stage, { move, leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "vinylshelf",
  means: "A record player: the pointer over the deck swings its dust lid open, then the tonearm onto the record.",
  rules: [1, 2, 5, 6],
  range: [0, 160, 400],
  tour: [[184, 165], [184, 213], [209, 270], null],
  mount,
});
