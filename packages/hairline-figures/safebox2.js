/**
 * Key safe: a small wall key safe with four code dials and a key hook behind
 * a front lid hinged at the bottom. The lid swings down as the pointer nears.
 * At rest it is shut and its pull tab is bright.
 */
const { Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 34, D = 12, H = 44, OPEN = 1.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[0, 0, 0], [W, 0, H], [0, D + H, 0], [W, D + H, 0], [0, 0, H]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hb = (pts) => poly(hull(pts.map((p) => P(...p))));
  const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  mk("path", { class: "sil", d: hb(box(0, 0, 0, W, D, H)) }, g);
  let inner = hb([[3, D, 3], [W - 3, D, 3], [W - 3, D, H - 3], [3, D, H - 3]]);
  for (let k = 0; k < 4; k++) { const x = 7 + k * 6.7; inner += hb([[x - 2, D, 26], [x + 2, D, 26], [x + 2, D, 34], [x - 2, D, 34]]); }
  inner += hb(box(W / 2 - 1, D, 12, W / 2 + 1, D + 5, 14));
  mk("path", { class: "nf lo", d: inner }, g);
  const lid = mk("path", { class: "sil" }, g), tab = mk("path", { class: "sil hi" }, g);
  const la = tween(0);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = ([x, y, z]) => { const dy = y - D, dz = z - 1; return [x, D + dy * c + dz * s, 1 - dy * s + dz * c]; };
    lid.setAttribute("d", hb(box(1, D, 1, W - 1, D + 2.5, H - 1).map(T)));
    tab.setAttribute("d", hb(box(W / 2 - 5, D + 2.5, H - 7, W / 2 + 5, D + 5, H - 3).map(T)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(la, now)); return !tdone(la, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D, H / 2);
  function near(p) {
    const now = performance.now();
    const f = p ? clamp(1.4 - Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 90, 0, 1) : 0;
    tset(la, f * OPEN, now, lag);
    read.textContent = p && f > 0 ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  near(null);
  bag.add(pointer(stage, { move: (p) => near(p), leave: () => near(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "safebox2",
  means: "A wall key safe: the front lid swings down on its bottom hinge as the pointer comes near.",
  rules: [1, 2, 5, 6],
  range: [0, 0, 200],
  tour: [[250, 135], [216, 289], [110, 84], null],
  mount,
});
