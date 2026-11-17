/**
 * Tray table: the back of an aircraft seat with its fold-down tray, latched
 * ajar at rest. The pointer over the seat folds the tray down flat on its
 * hinge; leaving lets it swing back to ajar. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge (lid).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, rrect, clamp, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 10, H = 104, ZH = 52, TX0 = 9, TX1 = 75, TD = 36, TH = 2.6, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D + TD, ZH], [W, D + TD, ZH], [W, 0, H], [0, D, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, H));
  // the stowed tray's recess and the latch above it, on the seat's back face
  const rec = rrect(TX0 - 1, ZH - 1, TX1 + 1, ZH + TD + 1, 3, 4).map((q) => P(q.u, D, q.v));
  mk("path", { d: poly(rec), class: "nf lo" }, g);
  const [lr, li] = rings(W / 2 - 4, D, W / 2 + 4, D + 2.5, 1.2, 0.5);
  put(solid(g), prism(P, front, lr, li, ZH + TD + 4, ZH + TD + 8));
  const tg = mk("g", {}, g), tray = mk("path", { class: "sil" }, tg), face = mk("path", { class: "nf lo" }, tg);

  const ang = tween(REST);
  let last = NaN;
  function corner(x, d, t, a) {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    return P(x, D + d * s + t * c, ZH + d * c - t * s);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const x of [TX0, TX1]) for (const d of [0, TD]) for (const t of [0, TH]) pts.push(corner(x, d, t, a));
    const h = hull(pts);
    tray.setAttribute("d", poly(fillet(h, h.map(() => 1.6))));
    const t = a < 45 ? TH : 0;
    const f = rrect(TX0 + 2.5, 2.5, TX1 - 2.5, TD - 2.5, 3, 4).map((q) => corner(q.u, q.v, t, a));
    face.setAttribute("d", poly(f));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const mid = P(W / 2, D + 10, ZH);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? maxA : REST, performance.now(), 0);
    tray.classList.add("hi");
    read.textContent = on ? "down" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 90 && Math.abs(sy - mid[1]) < 120;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = clamp(v, 60, 96); if (act) { tset(ang, maxA, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "traytable",
  means: "A seat back with its tray table ajar: the pointer folds the tray down flat on its hinge, and leaving swings it back up.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 96],
  tour: [[205, 168], [170, 20], [230, 221], null],
  mount,
});
