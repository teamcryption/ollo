/**
 * Looms: a table loom with a warp of threads stretched between two beams and
 * a reed, the beater, standing across them. The pointer slides the beater
 * along the warp: behind it the cloth is woven, pick by pick; in front of it
 * the bare threads run on to the far beam. At rest the beater sits halfway,
 * bright. The slider is where it rests.
 *
 * The pattern: one part following the pointer along a track (slide).
 */
const {
  Cam, fit, facing, poly, open, prism, proj, rings, seg, spring, stepS, clamp, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 124, W = 64, BZ = 4, TZ = 13, X0 = 12, X1 = L - 12, REST = 64, LO = 30, HI = 100;

function mount({ stage, svg, read }, value) {
  let rest = clamp(value, LO, HI), over = false;
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -6, 0], [L, W + 6, 0], [L, -6, 0], [0, W + 6, 0], [LO, -6, 30], [HI, W + 6, 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };
  put(solid(g), box(0, 0, L, W, 0, BZ, 5, 2));
  put(solid(g), box(1, 1, X0, W - 1, BZ, TZ + 3, 3, 1.4));
  const cloth = solid(g), weft = mk("path", { class: "nf lo" }, g);
  const reed = solid(g), dents = mk("path", { class: "nf lo" }, g);
  reed.sil.classList.add("hi");
  const warp = mk("path", { class: "nf" }, g);
  put(solid(g), box(X1, 1, L - 1, W - 1, BZ, TZ + 3, 3, 1.4));
  const ys = []; for (let y = 6; y <= W - 6; y += 4.4) ys.push(y);

  const sp = spring(rest);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    put(cloth, box(X0 - 2, 3, x - 2, W - 3, TZ - 1, TZ + 0.6, 1.2, 0.8));
    let w = "";
    for (let wx = x - 5; wx > X0 + 1; wx -= 5) w += seg(P(wx, 4, TZ + 0.6), P(wx, W - 4, TZ + 0.6));
    weft.setAttribute("d", w);
    put(reed, box(x - 2, -5, x + 2, W + 5, BZ + 2, TZ + 15, 1.5, 0.6));
    let d = "";
    for (let y = 2; y <= W - 2; y += 6) d += seg(P(x + 2, y, BZ + 4), P(x + 2, y, TZ + 13));
    dents.setAttribute("d", d);
    warp.setAttribute("d", ys.map((y) => seg(P(x + 2, y, TZ), P(X1, y, TZ + 1))).join(""));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { over = false; sp.t = rest; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], TZ);
    if (wy < -20 || wy > W + 20 || wx < -10 || wx > L + 10) return aim(null);
    over = true;
    sp.t = clamp(wx, LO, HI);
    read.textContent = "pick " + Math.round((sp.t - X0) / 5);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rest = clamp(v, LO, HI); if (!over) { sp.t = rest; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "looms",
  means: "A table loom: the beater slides along the warp after the pointer, with woven cloth behind it and bare threads ahead.",
  rules: [1, 3, 5, 6],
  range: [30, 64, 100],
  tour: [[156, 139], [239, 180], [200, 160], null],
  mount,
});
