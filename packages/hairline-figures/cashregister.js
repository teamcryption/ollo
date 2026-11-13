/**
 * Cash register: a till with a keypad of twelve keys on its deck, a display
 * on a tower behind them, and a cash drawer in the front with its coin
 * trays. Over the keypad the keys near the pointer press in, each on its own
 * spring, the one under it deepest and bright. Down the front the drawer
 * slides out, the further the lower the pointer. At rest one key is held
 * half down, bright, and the drawer stands a little open. The slider is the
 * keys' reach, in key widths.
 *
 * The pattern: a continuous field (terrain) of keys, read on the plane of
 * their resting tops; the drawer is read on the front plane. Neither moves.
 */
const {
  Cam, clamp, facing, fit, lerp, poly, prism, proj, rings, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 66, D = 56, H = 24, KH = 4.4, KD = 3.8, NC = 3, NR = 4, PX = 11, PY = 10, KX = 5, KY = 12;
const OUT = 30, S0 = 4, NAMES = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "00", "+"];
const REST = { 9: 0.6, 4: 0.3, 2: 0.2 }, FAV = 9;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * PX, over = null, low = -1;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, D + OUT, 0], [0, D + OUT, 0], [62, 4, H + 16], [0, 0, H + KH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the body with the drawer's mouth on its front and a receipt cover on its deck, then the display tower
  const body = block(0, 0, W, D, 3, 1.4, 0, H);
  mk("path", {
    class: "nf lo",
    d: poly(rrect(5, 1.6, W - 5, 11.6, 1, 3).map((q) => P(q.u, D, q.v))) + poly(rrect(46, 24, 60, 46, 2, 3).map((q) => P(q.u, q.v, H))) + seg(P(49, 35, H), P(57, 35, H)),
  }, body.g);
  const tower = block(46, 4, 62, 14, 2, 1, H, H + 16);
  mk("path", { class: "nf lo", d: poly(rrect(48.5, H + 7.5, 59.5, H + 13.5, 1, 3).map((q) => P(q.u, 14, q.v))) }, tower.g);

  // keys far to near, row by row
  const keys = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const i = r * NC + c, x0 = KX + c * PX, y0 = KY + r * PY;
    const [ring, inner] = rings(x0, y0, x0 + PX - 1.9, y0 + PY - 1.9, 1.4, 0.7);
    const rest = (REST[i] || 0) * KD;
    keys.push({ i, c, r, cx: x0 + PX / 2, cy: y0 + PY / 2, ring, inner, el: solid(g), rest, sp: spring(rest, { eps: 0.02 }), drawn: NaN });
  }

  // the drawer: only the part outside the front is drawn, with its coin trays and a pull
  const drawer = solid(g), trays = mk("path", { class: "nf lo" }, drawer.g);
  const dr = { sp: spring(S0, { eps: 0.05 }), drawn: NaN };
  function drawDrawer() {
    const s = clamp(dr.sp.x, 0.5, OUT);
    if (s === dr.drawn) return;
    dr.drawn = s;
    const [o, i] = rings(6, D, W - 6, D + s, 1, Math.min(0.8, s * 0.3));
    put(drawer, prism(P, front, o, i, 2.2, 11));
    let d = seg(P(28, D + s, 7.4), P(36, D + s, 7.4));
    for (let k = 1; k < 5; k++) { const x = lerp(6, W - 6, k / 5); d += seg(P(x, D, 11), P(x, D + s - 1.2, 11)); }
    if (s > 6) d += seg(P(7.5, D + s * 0.55, 11), P(W - 7.5, D + s * 0.55, 11));
    trays.setAttribute("d", d);
  }
  function drawKey(key) {
    const d = clamp(key.sp.x, 0, KD);
    if (d === key.drawn) return;
    key.drawn = d;
    put(key.el, prism(P, front, key.ring, key.inner, H - d, H + KH - d));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const key of keys) { if (stepS(key.sp, dt)) m = true; drawKey(key); }
    if (stepS(dr.sp, dt)) m = true;
    drawDrawer();
    return m;
  });
  bag.add(B.unregister);

  /** The key under a point of the keys' resting top plane, or null off the keypad. */
  function keyAt([x, y]) {
    if (x < KX - 1 || x > KX + NC * PX || y < KY - 1 || y > KY + NR * PY) return null;
    return keys[clamp(Math.floor((y - KY) / PY), 0, NR - 1) * NC + clamp(Math.floor((x - KX) / PX), 0, NC - 1)];
  }

  function retarget() {
    const hit = over ? keyAt(over) : null;
    for (const key of keys) {
      key.sp.t = !hit ? key.rest : key === hit ? KD : KD * 0.8 * falloff(Math.hypot(key.cx - over[0], key.cy - over[1]) / RAD);
      key.el.sil.classList.toggle("hi", hit ? key === hit : low < 0 && key.i === FAV);
    }
    dr.sp.t = low < 0 ? S0 : lerp(S0 + 4, OUT, low);
    drawer.sil.classList.toggle("hi", low >= 0);
    read.textContent = hit ? "key " + NAMES[hit.i] : low >= 0 ? "drawer" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = unproj(C, p[0], p[1], H + KH);
      low = -1;
      if (!keyAt(over)) {
        over = null;
        // the front plane (y = D), which never moves: lower on it pulls the drawer further
        const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
        const x = ((p[0] - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (p[1] - C.oy) / C.S) / zf;
        if (x > 0 && x < W && z > -26 && z < H) low = clamp((H - 4 - z) / (H + 16), 0, 1);
      }
      retarget();
    },
    leave: () => { over = null; low = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * PX; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cashregister",
  means: "A cash register: keys near the pointer press in on springs, and down its front the cash drawer slides out further the lower the pointer.",
  rules: [1, 3, 5, 8],
  range: [1, 2, 3],
  tour: [[208, 100], [190, 133], [172, 214], null],
  mount,
});
