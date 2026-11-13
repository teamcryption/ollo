/**
 * Window blinds: a wall with a window opening, its sill and a headrail, and
 * eleven horizontal slats hung in front. The pointer's height on the wall's
 * face sets how far the slats tilt open, low closed, high open, and the slats
 * near it open a little further; the slat under the pointer is bright. Closed
 * slats hide the mullions behind them, open ones let them show. At rest the
 * slats stand a third open with a gentle swell, one slat bright. The slider is
 * the swell's reach.
 *
 * The pattern: a field of parts read on a fixed face plane (lockers), one
 * spring per slat for the continuous height.
 */
const {
  Cam, clamp, fit, fillet, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const W = 84, H = 104, D = 8, X0 = 12, X1 = W - 12, Z0 = 14, Z1 = H - 16, N = 11, HW = 4.6, FAV = 4;
const SP = (Z1 - 3 - Z0) / N, YM = D + 4;
const zc = (i) => Z1 - 4 - SP * (i + 0.5);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [W, D + 10, 0], [W, 0, 0], [0, D + 10, 0], [0, 0, H], [W, 0, H], [0, D + 10, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  // the opening and its mullions, painted on the face before the slats
  mk("path", { d: poly(rrect(X0, Z0, X1, Z1, 1.6, 3).map(onFace(D))), class: "nf lo" }, g);
  mk("path", { d: seg(P(W / 2, D, Z0), P(W / 2, D, Z1)) + seg(P(X0, D, (Z0 + Z1) / 2), P(X1, D, (Z0 + Z1) / 2)), class: "nf lo" }, g);
  const [sr, si] = rings(X0 - 5, D - 1, X1 + 5, D + 9, 1.4, 0.8);
  put(solid(g), prism(P, front, sr, si, Z0 - 4, Z0 - 1));
  // slats bottom to top: a higher slat sits nearer the eye
  const slats = [];
  for (let i = N - 1; i >= 0; i--) slats[i] = { el: mk("path", {}, g), s: spring(0), last: NaN };
  slats.forEach((sl) => g.appendChild(sl.el));
  const [hr, hi] = rings(X0 - 3, D, X1 + 3, D + 8, 1.2, 0.7);
  put(solid(g), prism(P, front, hr, hi, Z1 - 3, Z1 + 3));
  const wand = mk("path", { class: "nf lo", d: seg(P(X1, YM, Z1 - 3), P(X1, YM, Z1 - 40)) }, g);

  function draw(sl, i, t) {
    const a = t * Math.PI / 2, dy = Math.sin(a) * HW, dz = Math.cos(a) * HW, z = zc(i);
    const pts = [[X0 + 1, YM - dy, z - dz], [X1 - 1, YM - dy, z - dz], [X1 - 1, YM + dy, z + dz], [X0 + 1, YM + dy, z + dz]].map((p) => P(...p));
    sl.el.setAttribute("d", poly(fillet(pts, [1, 1, 1, 1], 2)));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    slats.forEach((sl, i) => {
      if (stepS(sl.s, dt)) moving = true;
      if (!(Math.abs(sl.s.x - sl.last) <= 1e-4)) { draw(sl, i, sl.s.x); sl.last = sl.s.x; }
    });
    return moving;
  });
  bag.add(B.unregister);

  /** The pointer on the wall's face plane (y = D), which never moves: [x, z]. */
  function onWall([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    return [x, z];
  }
  const fall = (d) => (d < 0.42 ? 1 - (d / 0.42) * 0.69 : Math.max(0.09, 0.31 - (d - 0.42) * 0.6));

  let act = -2, open = 0.34, hz = zc(FAV);
  function aim(a, o, z) {
    slats.forEach((sl, i) => {
      const d = Math.abs(zc(i) - z) / (SP * Math.max(1, reach));
      sl.s.t = clamp(o + (1 - o) * 0.45 * fall(d / 2), 0.05, 0.98);
      sl.el.classList.toggle("sil", true);
      sl.el.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    B.wake();
  }
  function move(p) {
    const [x, z] = onWall(p);
    if (x < X0 - 6 || x > X1 + 6 || z < Z0 || z > Z1) return leave();
    const a = clamp(Math.floor((Z1 - 4 - z) / SP), 0, N - 1);
    open = clamp((z - Z0) / (Z1 - Z0), 0, 1);
    act = a;
    aim(a, open * 0.85, z);
    read.textContent = "open " + Math.round(clamp(open * 0.85 + 0.15 * fall(0) * 0.45, 0, 1) * 100) + "%";
  }
  function leave() { act = -1; aim(-1, 0.22, hz); read.textContent = "rest"; }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; aim(act, act < 0 ? 0.22 : open * 0.85, act < 0 ? hz : zc(act)); }, destroy: bag.dispose };
}

hairline({
  name: "blinds",
  means: "Slat blinds over a window: the slats tilt open as the pointer rises, those near it a little further, the one under it bright.",
  rules: [1, 3, 5, 8],
  range: [1, 2, 4],
  tour: [[200, 212], [197, 165], [195, 118], null],
  mount,
});
