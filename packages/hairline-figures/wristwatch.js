/**
 * Watch box: a case with three watches on cushions and a lid hinged at the
 * back. The pointer picks a watch by where it stands: the lid swings open
 * and that watch's face lights. At rest the lid stands ajar, bright.
 * The slider is how far the lid opens.
 */
const { Cam, fit, hull, poly, proj, rings, prism, facing, circ, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const L = 72, Dp = 30, H = 14, T = 5, XS = [13, 36, 59];
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (q, a) => { const c = Math.cos(a), s = Math.sin(a), dz = q[2] - H; return [q[0], q[1] * c - dz * s, H + q[1] * s + dz * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[0, -T - 2, 0], [L, Dp, 0], [0, -T, H + Dp], [L, 0, H + Dp]], 200, 165);
  const P = proj(C), front = facing(C);
  const hp = (pts) => poly(hull(pts.map((q) => P(...q))));
  const g = mk("g", {}, svg);
  const lid = mk("path", { class: "sil" }, g);
  const base = mk("g", {}, g);
  const [or, oi] = rings(0, 0, L, Dp, 4, 2);
  put(solid(base), prism(P, front, or, oi, 0, H));
  const faces = XS.map((x) => {
    const [cr, ci] = rings(x - 9, 4, x + 9, Dp - 4, 4, 1.5);
    put(solid(base), prism(P, front, cr, ci, H, H + 3));
    mk("path", { d: hp(box(x - 3.5, 5, H + 3, x + 3.5, Dp - 5, H + 3.8)), class: "nf lo" }, base);
    const f = solid(base);
    put(f, prism(P, front, disc(x, Dp / 2, 6.5), disc(x, Dp / 2, 5.5), H + 3.8, H + 6));
    mk("path", { d: poly([P(x, Dp / 2, H + 6), P(x - 3, Dp / 2 - 2, H + 6)]), class: "nf" }, base);
    return f.sil;
  });
  const lidA = tween(42);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.setAttribute("d", hp(box(0, 0, H, L, Dp, H + T).map((q) => rot(q, rad(a)))));
    if (a > 90) g.insertBefore(lid, base); else g.appendChild(lid);
  }
  const B = register(stage, (_dt, now) => { draw(tval(lidA, now)); return !tdone(lidA, now); });
  bag.add(B.unregister);
  const mids = XS.map((x) => P(x, Dp / 2, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lidA, a < 0 ? 42 : 60 + open, performance.now(), 0);
    lid.classList.toggle("hi", a < 0);
    faces.forEach((f, k) => f.classList.toggle("hi", k === a));
    read.textContent = a < 0 ? "rest" : "watch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act >= 0) { tset(lidA, 60 + open, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "wristwatch",
  means: "A watch box with three watches on cushions: pointing at a watch swings the lid open and lights that watch's face.",
  rules: [1, 4, 5, 6],
  range: [30, 50, 60],
  tour: [[116, 149], [163, 173], [211, 197], null],
  mount,
});
