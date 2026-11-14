/**
 * Alarm bell: a round gong on a square box, fixed to a wall panel. The
 * gong swings on its mount to face the pointer, left or right, on a
 * spring, clamped so it never leaves the box. At rest it is turned a
 * little and bright. The slider is how far it may swing.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 90, H = 110, BX = 45, BZ = 62, BD = 18, R = 30, D = 16, REST = 0.45, MIDA = 0.65;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-6, -8, 0], [W + 6, -8, 0], [W + 6, 50, 0], [-6, 50, 0], [0, -6, H], [W, -6, H], [BX + R, BD + D + 6, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-6, -8, W + 6, 50, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [wr, wi] = rings(0, -6, W, 0, 2, 1);
  put(solid(g), prism(P, front, wr, wi, 4, H));
  const [br, bi] = rings(BX - 22, 0, BX + 22, BD, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, BZ - 26, BZ + 22));
  const bell = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), nub = mk("path", { class: "nf" }, g);

  function ringAround(o, d, r, n = 32) {
    const u = [d[1], -d[0], 0], ul = Math.hypot(u[0], u[1]) || 1;
    u[0] /= ul; u[1] /= ul;
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, c = Math.cos(t) * r, s = Math.sin(t) * r;
      out.push(P(o[0] + u[0] * c, o[1] + u[1] * c, o[2] + s));
    }
    return out;
  }

  const a = spring(REST);
  let last = NaN;
  function draw(force) {
    if (!force && a.x === last) return;
    last = a.x;
    const d = [Math.sin(a.x), Math.cos(a.x), 0], o = [BX, BD, BZ], pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = (i / 8) * (Math.PI / 2), s = D * Math.sin(t) + 2;
      pts.push(...ringAround([o[0] + d[0] * s, o[1] + d[1] * s, o[2]], d, R * Math.cos(t) + 0.5));
    }
    bell.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAround([o[0] + d[0] * 5, o[1] + d[1] * 5, o[2]], d, R - 1.5)));
    nub.setAttribute("d", poly(hull(ringAround([o[0] + d[0] * (D + 2), o[1] + d[1] * (D + 2), o[2]], d, 4, 16).concat(ringAround([o[0] + d[0] * (D + 5), o[1] + d[1] * (D + 5), o[2]], d, 4, 16)))));
  }

  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(false); return m; });
  bag.add(B.unregister);
  draw(true);
  bell.classList.add("hi");
  read.textContent = "rest";

  const mid = P(BX, BD, BZ);
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const lim = 0.2 + reach * 0.4;
      const off = clamp((sx - mid[0]) / 160, -lim, lim);
      a.t = MIDA + off;
      read.textContent = "swing " + Math.round((off * 180) / Math.PI) + "°";
      B.wake();
    },
    leave: () => { a.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "sirenpole",
  means: "An alarm bell on a wall box: the round gong swings on its mount to face the pointer, left or right, clamped to the box.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[120, 160], [200, 170], [290, 180], null],
  mount,
});
