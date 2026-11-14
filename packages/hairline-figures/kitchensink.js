/**
 * Kitchen sink: a cabinet with a counter, a basin sunk in it with its drain,
 * a stack of plates beside it and a swivel tap at the back. The pointer over
 * the counter turns the spout to face it, clamped to the basin's width, and
 * water runs from the tip while it is there. At rest the spout stands turned
 * aside over the counter, bright, and dry. The slider is how far the spout may swing.
 *
 * The pattern: a part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect, run, seg, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X1 = 124, Y1 = 72, ZC = 34, ZT = 38, TX = 50, TY = 9, ZS = 64, L = 31, REST = 4, FLOOR = ZT - 12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, x, y) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [TX, TY, ZS + 4], [-2, -2, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(2, 2, X1 - 2, Y1 - 2, 3, 1.5);
  put(solid(g), prism(P, front, cr, ci, 0, ZC));
  const [tr, ti] = rings(-2, -2, X1 + 2, Y1 + 2, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, ZC, ZT));
  // the basin: its rim on the counter, the far wall falling to its floor, the drain
  const rim = rrect(24, 22, 84, 62, 8, 6), fl = rrect(28, 26, 80, 58, 6, 6);
  mk("path", { d: poly(ringAt(P, rim, ZT)), class: "nf" }, g);
  mk("path", { d: open(ringAt(P, run(fl, (q) => !front(q)), FLOOR)), class: "nf lo" }, g);
  mk("path", { d: seg(P(24, 22, ZT), P(28, 26, FLOOR)) + seg(P(84, 22, ZT), P(80, 26, FLOOR)) + seg(P(24, 62, ZT), P(28, 58, FLOOR)), class: "nf lo" }, g);
  const drain = flatDot(g, C, 2.2, "dot off");
  place(drain, P(54, 42, FLOOR));
  // plates stacked to the right of the basin
  for (let k = 0; k < 3; k++) {
    const z = ZT + k * 2.4;
    put(solid(g), prism(P, front, disc(104, 44, 13 - k * 0.6), disc(104, 44, 9 - k * 0.6), z, z + 1.6));
  }
  // the tap: a column at the back, a lever, and the spout that swings
  put(solid(g), prism(P, front, disc(TX, TY, 5, 24), disc(TX, TY, 3.6, 24), ZT, ZS));
  put(solid(g), prism(P, front, disc(TX + 8, TY - 1, 2, 12), disc(TX + 8, TY - 1, 1.2, 12), ZT, ZT + 9));
  const water = mk("path", { class: "nf" }, g);
  const spout = solid(g), tip = solid(g);
  spout.sil.classList.add("hi");
  const [sr, si] = rings(-2.8, -2.8, L, 2.8, 2.8, 1);
  const ang = spring(REST);
  let wet = false, last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const t = rad(a), x = TX + (L - 2) * Math.cos(t), y = TY + (L - 2) * Math.sin(t);
    put(spout, prism(P, front, turn(sr, t, TX, TY), turn(si, t, TX, TY), ZS - 4, ZS));
    put(tip, prism(P, front, disc(x, y, 2.6, 16), disc(x, y, 1.6, 16), ZS - 9, ZS - 3));
    water.setAttribute("d", wet ? seg(P(x - 0.8, y, ZS - 9.5), P(x - 0.8, y, FLOOR)) + seg(P(x + 0.8, y, ZS - 9.5), P(x + 0.8, y, FLOOR)) + poly(ringAt(P, disc(x, y, 5, 20), FLOOR)) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(ang.x);

  function aim(p) {
    if (!p) { ang.t = REST; wet = false; read.textContent = "rest"; last = NaN; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], ZT);
    if (wx < -20 || wx > X1 + 20 || wy < -20 || wy > Y1 + 30) return aim(null);
    const span = lerp(25, 60, reach / 90);
    const a = clamp((Math.atan2(wy - TY, wx - TX) * 180) / Math.PI, 90 - span, 90 + span);
    if (!wet) last = NaN;
    wet = true;
    ang.t = a;
    read.textContent = Math.round(a - 90) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "kitchensink",
  means: "A kitchen sink with a swivel tap: the spout turns to face the pointer over the counter, and water runs into the basin.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[150, 113], [133, 132], [210, 170], null],
  mount,
});
