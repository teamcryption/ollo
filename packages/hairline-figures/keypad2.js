/**
 * Door keypad: a lock plate on the door with a lever handle and a keypad
 * under a hinged cover. The cover tilts up as the pointer nears the plate,
 * baring the keys. At rest it is shut and the status lamp is bright.
 */
const { Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 40, H = 70, HZ = 52, BZ = 18, OPEN = 2.0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, 0, H], [W, 0, H], [0, 40, HZ], [W, 40, HZ]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hb = (pts) => poly(hull(pts.map((p) => P(...p))));
  const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  mk("path", { class: "sil", d: hb(box(0, 0, 0, W, 4, H)) }, g);
  let keys = "";
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = 8 + c * 9, z = HZ - 8 - r * 8;
    keys += hb([[x, 4, z], [x + 6, 4, z], [x + 6, 4, z + 5], [x, 4, z + 5]]);
  }
  mk("path", { class: "nf lo", d: keys }, g);
  mk("path", { class: "sil hi", d: hb(box(W / 2 - 2, 4, H - 9, W / 2 + 2, 6, H - 5)) }, g);
  mk("path", { class: "sil", d: hb(box(6, 4, 7, 10, 10, 11)) + hb(box(6, 8, 7, 44, 11, 10)) }, g);
  const cover = mk("path", { class: "sil" }, g);
  const ca = tween(0);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = ([x, y, z]) => { const dy = y - 4, dz = z - HZ; return [x, 4 + dy * c - dz * s, HZ + dy * s + dz * c]; };
    cover.setAttribute("d", hb(box(2, 4, BZ, W - 2, 7, HZ).map(T)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ca, now)); return !tdone(ca, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, 4, 35);
  function near(p) {
    const now = performance.now();
    const f = p ? clamp(1.4 - Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 90, 0, 1) : 0;
    tset(ca, f * OPEN, now, lag);
    read.textContent = p && f > 0 ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  near(null);
  bag.add(pointer(stage, { move: (p) => near(p), leave: () => near(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keypad2",
  means: "A door keypad lock: the hinged cover tilts up off the keys as the pointer comes near the plate.",
  rules: [1, 2, 5, 6],
  range: [0, 0, 200],
  tour: [[244, 166], [228, 145], [117, 258], null],
  mount,
});
