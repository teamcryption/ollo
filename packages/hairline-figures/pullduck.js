/**
 * Pull-along duck: a wooden duck on a wheeled board, a pull cord at its
 * front. Over it, the duck flaps: both wings swing up off its sides on their
 * hinges and the head dips forward, the way the toy does when pulled. At rest
 * the wings lie folded and the beak is bright. The slider is how far the
 * wings open.
 *
 * The pattern: one object, one gesture (a tween on the hover).
 */
const {
  Cam, circ, fit, fillet, hull, open, poly, proj, unproj, tset, tval, tdone, tween, rad,
  disposer, mk, pointer, register,
} = HL;

const WING = [[14, 0], [10, 7], [2, 12], [-8, 15], [-20, 17], [-16, 8], [-14, 0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-36, -24, 0], [42, 24, 0], [42, -24, 0], [-36, 24, 0], [10, 0, 58], [-10, -30, 50], [-10, 30, 50]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const R = circ(1, 28);
  const ell = (cx, cy, cz, a, b, c, zmin, xf) => {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = -Math.PI / 2 + (i / 10) * Math.PI, z = Math.max(zmin, cz + c * Math.sin(t)), s = Math.cos(t);
      for (const q of R) pts.push(xf(cx + a * s * q.u, cy + b * s * q.v, z));
    }
    return hull(pts);
  };
  const id = (x, y, z) => P(x, y, z);
  const wheel = (x, y) => {
    const pts = [];
    for (const dy of [-1.5, 1.5]) for (const q of R) pts.push(P(x + 6 * q.u, y + dy, 6 + 6 * q.v));
    mk("path", { d: poly(hull(pts)), class: "sil" }, g);
    mk("path", { d: poly(R.map((q) => P(x + 2 * q.u, y + Math.sign(y) * 1.6, 6 + 2 * q.v))), class: "nf lo" }, g);
  };
  wheel(-20, -16); wheel(22, -16);
  const farWing = mk("path", { class: "sil" }, g);
  // the board
  const board = [[-30, -14], [32, -14], [32, 14], [-30, 14]];
  const bpts = [];
  for (const z of [6, 10]) for (const [x, y] of board) bpts.push(P(x, y, z));
  mk("path", { d: poly(fillet(hull(bpts), Array(6).fill(3))), class: "sil" }, g);
  mk("path", { d: poly(fillet(board.map(([x, y]) => P(x, y, 10)), [3, 3, 3, 3])), class: "nf lo" }, g);
  wheel(-20, 16); wheel(22, 16);
  mk("path", { d: open([P(32, 0, 8), P(40, 4, 4), P(44, 14, 1), P(46, 24, 0.5)]), class: "nf lo" }, g);
  // body, tail up at the back
  const body = ell(0, 0, 21, 26, 13, 11, 10, id).concat([P(-32, 0, 36), P(-30, -3, 33), P(-30, 3, 33)]);
  mk("path", { d: poly(hull(body)), class: "sil" }, g);
  const head = mk("path", { class: "sil" }, g), beak = mk("path", { class: "sil" }, g), eye = mk("path", { class: "nf lo" }, g);
  const nearWing = mk("path", { class: "sil" }, g);

  const st = { w: tween(-58), h: tween(0) };
  let last = "";
  function wing(el, side, a) {
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    const pts = WING.map(([s, t]) => P(s - 2, side * (10 + t * ca), 25 + t * sa));
    el.setAttribute("d", poly(fillet(pts, Array(pts.length).fill(2.5))));
    return pts;
  }
  function draw(w, h) {
    const key = w.toFixed(2) + h.toFixed(2);
    if (key === last) return;
    last = key;
    wing(farWing, -1, w);
    wing(nearWing, 1, w);
    const ch = Math.cos(rad(h)), sh = Math.sin(rad(h));
    const xf = (x, y, z) => { const dx = x - 16, dz = z - 26; return P(16 + dx * ch + dz * sh, y, 26 - dx * sh + dz * ch); };
    head.setAttribute("d", poly(hull(ell(20, 0, 40, 9, 8, 9, 0, xf).concat(ell(18, 0, 28, 7, 7, 6, 0, xf)))));
    beak.setAttribute("d", poly(hull(ell(31, 0, 38, 6, 4, 2.2, 0, xf))));
    eye.setAttribute("d", poly(circ(1.4, 12).map((q) => xf(23 + q.u, 7.6, 43 + q.v))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(st.w, now), tval(st.h, now)); return !tdone(st.w, now) || !tdone(st.h, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tset(st.w, v ? -58 + 150 * reach : -58, now, 0);
    tset(st.h, v ? 26 * reach : 0, now, v ? 60 : 0);
    farWing.classList.toggle("hi", v); nearWing.classList.toggle("hi", v); beak.classList.toggle("hi", !v);
    read.textContent = v ? "flap " + Math.round(92 * reach) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(x > -50 && x < 56 && Math.abs(y) < 40); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const o = on; on = null; setOn(o); }, destroy: bag.dispose };
}

hairline({
  name: "pullduck",
  means: "A wooden pull-along duck on wheels: over it, both wings swing up off its sides and its head dips, as when it is pulled.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[194, 144], [230, 190], [160, 175], null],
  mount,
});
