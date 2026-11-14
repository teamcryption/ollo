/**
 * Lunch trays: four cafeteria trays laid along a counter, each moulded with
 * a main well and two small ones, an apple in one. The pointer picks a tray
 * by where it is along the row: that tray lifts off the counter, its
 * neighbours rise a little after it. At rest the trays sit a touch out of
 * line, the one with the apple bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest rest
 * centre along screen x.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 27, W = 23, D = 34, T = 2.4, LIFT = 22, BUMP = 6;
const OFF = [1, -3, 2, -1], REST = [1, 0, 3, 0.5], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[0, -4, 0], [X1, D + 3, 0], [X1, -4, 0], [0, D + 3, 0], [0, -4, LIFT + 9], [X1, -4, LIFT + 9]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the counter: a long low plate the trays rest on
  const [cr, ci] = rings(-6, -8, X1 + 6, D + 7, 6, 1.4);
  put(solid(g), prism(P, front, cr, ci, -5, 0));

  const trays = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, y0 = OFF[k];
    const grp = mk("g", {}, g);
    const body = solid(grp);
    const wells = mk("path", { class: "nf lo" }, grp);
    const apple = k === FAV ? solid(grp) : null;
    trays.push({ k, x0, y0, body, wells, apple, z: tween(REST[k]), last: NaN });
  }

  function draw(t, z) {
    if (z === t.last) return;
    t.last = z;
    const { x0, y0 } = t;
    const [r, i] = rings(x0, y0, x0 + W, y0 + D, 4, 1.2);
    put(t.body, prism(P, front, r, i, z, z + T));
    const zt = z + T;
    t.wells.setAttribute("d",
      poly(ringAt(P, rrect(x0 + 2.5, y0 + 14, x0 + W - 2.5, y0 + D - 2.5, 3, 4), zt)) +
      poly(ringAt(P, rrect(x0 + 2.5, y0 + 2.5, x0 + W / 2 - 0.8, y0 + 12, 2.5, 4), zt)) +
      poly(ringAt(P, rrect(x0 + W / 2 + 0.8, y0 + 2.5, x0 + W - 2.5, y0 + 12, 2.5, 4), zt)));
    if (t.apple) {
      const cx = x0 + W * 0.74, cy = y0 + 7.2;
      const [ar, ai] = rings(cx - 3.4, cy - 3.4, cx + 3.4, cy + 3.4, 3.4, 1);
      put(t.apple, prism(P, front, ar, ai, zt, zt + 5.5));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    trays.forEach((t) => { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest tray by its rest centre along screen x, inside the row's band
  const centres = trays.map((t) => P(t.x0 + W / 2, t.y0 + D / 2, REST[t.k]));
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    centres.forEach((c, k) => { const d = Math.abs(sx - c[0]); if (d < bd && Math.abs(sy - c[1]) < 70) { bd = d; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    trays.forEach((t, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(BUMP - 2 * Math.abs(k - a), 0, BUMP);
      tset(t.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      t.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lunchtrays",
  means: "Four cafeteria trays on a counter: the tray under the pointer lifts off, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 167], [218, 207], [265, 231], null],
  mount,
});
