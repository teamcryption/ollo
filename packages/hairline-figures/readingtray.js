/**
 * Reading tray: a low tray with a front ledge and a hinged board. The pointer
 * over the tray tilts the board up to reading height; leaving lays it back to
 * a slight lean. The board is the bright mark. The slider is the tilt.
 */
const { Cam, fit, proj, facing, rings, prism, put, solid, mk, hull, poly, seg, tween, tset, tval, tdone, register, pointer, disposer, unproj, clamp, rad } = HL;

const W = 90, D = 74, HX = 62, HZ = 6, L = 60, REST = 18, OPEN = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [D, W, 0], [0, W, 0], [D, 0, 0], [HX - L * Math.cos(rad(80)), 0, HZ + L], [HX - L * Math.cos(rad(80)), W, HZ + L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, D, W, 6, 2);
  put(solid(g), prism(P, front, r0, i0, 0, 4));
  const strut = mk("path", { class: "nf lo" }, g);
  const board = solid(g);
  board.sil.classList.add("hi");
  const [r1, i1] = rings(HX + 1, 2, HX + 9, W - 2, 3, 1.2);
  put(solid(g), prism(P, front, r1, i1, 4, 12));
  const tw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), nx = s * 2.5, nz = c * 2.5;
    const bot = [[HX, 4, HZ], [HX - L * c, 4, HZ + L * s], [HX - L * c, W - 4, HZ + L * s], [HX, W - 4, HZ]];
    const A = bot.map((p) => P(...p)), Bt = bot.map((p) => P(p[0] + nx, p[1], p[2] + nz));
    board.sil.setAttribute("d", poly(hull(A.concat(Bt))));
    board.cr.setAttribute("d", poly(Bt));
    const mx = HX - L * 0.55 * c, mz = HZ + L * 0.55 * s;
    strut.setAttribute("d", seg(P(14, 10, 4), P(mx, 10, mz)) + seg(P(14, W - 10, 4), P(mx, W - 10, mz)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? clamp(REST + (OPEN - REST) * amt, REST, 80) : REST, performance.now(), 0);
    read.textContent = a ? "tilt" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  B.wake();
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(x > -30 && x < D + 10 && y > -10 && y < W + 10); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = false; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "readingtray",
  means: "A reading tray with a hinged board: the pointer over it tilts the board up to reading height, leaving lays it back.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.25],
  tour: [[185, 215], [204, 172], [222, 200], null],
  mount,
});
