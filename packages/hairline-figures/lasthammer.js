/**
 * Cobbler last: a shoe last standing on its iron post and block, a sole laid
 * on it, and the cobbler's hammer held over it. The pointer is the hand: the
 * nearer it comes to the last, the lower the hammer swings, on one spring
 * about its grip, until the head meets the sole. At rest the hammer is
 * raised, its head bright. The slider is how high it can rise.
 *
 * The pattern: a continuous aim on one angle; the hit is on the floor's
 * plane, which never moves.
 */
const {
  Cam, clamp, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GX = 44, GZ = 52, LEN = 38, TOPZ = 40, REST = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let high = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-20, -14, 0], [24, 18, 0], [GX + 6, 0, GZ], [GX - LEN * 0.4, 0, GZ + LEN * 0.95], [-6, 0, TOPZ + 20]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  const [b0, b1] = rings(-20, -14, 24, 18, 4, 1.4);
  put(solid(g), prism(P, front, b0, b1, 0, 12));
  put(solid(g), prism(P, front, rings(-1, -2, 5, 4, 2, 0.8)[0], null, 12, TOPZ - 8));
  // the last: a foot-shaped block, toe toward -x
  const [l0, l1] = rings(-16, -6, 22, 8, 7, 1.2);
  put(solid(g), prism(P, front, l0, l1, TOPZ - 8, TOPZ));
  mk("path", { class: "nf lo", d: poly(HL.ringAt(P, rings(-15, -5, 21, 7, 6, 1)[0], TOPZ)) }, g);
  put(solid(g), prism(P, front, rings(9, -5, 21, 7, 5, 1)[0], rings(9, -5, 21, 7, 5, 1)[1], TOPZ, TOPZ + 12));
  const ham = mk("g", {}, g), handle = mk("path", { class: "sil" }, ham), head = mk("path", { class: "sil" }, ham);
  const sp = spring(REST);
  let drawn = NaN;
  const box = (cx, cz, hx, hy, hz, a, ux, uz) => {
    const pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      const lx = sx * hx, lz = sz * hz;
      pts.push(P(cx + lx * ux - lz * uz, sy * hy, cz + lx * uz + lz * ux));
    }
    return pts;
  };

  function draw(deg) {
    if (Math.abs(deg - drawn) < 1e-3) return;
    drawn = deg;
    const a = (deg * Math.PI) / 180, ux = -Math.cos(a), uz = Math.sin(a);
    const hx = GX + ux * LEN, hz = GZ + uz * LEN;
    handle.setAttribute("d", poly(hull(box(GX + ux * LEN * 0.5, GZ + uz * LEN * 0.5, LEN * 0.5, 2, 1.6, a, ux, uz))));
    // the head stands across the handle's end: its long side along the swing's normal
    head.setAttribute("d", poly(hull(box(hx, hz, 4, 4.5, 9, a, ux, uz))));
  }

  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);

  function set(d) {
    const on = d !== null;
    sp.t = on ? clamp((d / 70) * high, 6, high) : REST;
    head.classList.toggle("hi", true);
    read.textContent = on ? Math.round(sp.t) + "°" : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x - 4, y);
      set(d < 90 ? d : null);
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { high = v; }, destroy: bag.dispose };
}

hairline({
  name: "lasthammer",
  means: "A cobbler's shoe last with a hammer over it: the nearer the pointer comes, the lower the hammer swings onto the sole.",
  rules: [1, 3, 5, 8],
  range: [40, 64, 80],
  tour: [[300, 240], [166, 239], [93, 229], null],
  mount,
});
