/**
 * Police car: a three-box sedan on four wheels, a glassy cabin, a push bar
 * at the nose and a long light bar across the roof. The pointer over the car
 * raises the light bar on its mast and turns it round, on two springs, so
 * it sweeps from across the roof to along it. At rest the bar sits low and
 * across, bright. The slider is how high it rises and how far it turns.
 *
 * The pattern: one part answering, hit on the rest pose's screen box.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 9, WW = 6, ROOF = 37, BX = -4, HL2 = 20, HW = 5;
const WHEELS = [[-28, -18], [28, -18], [-28, 18], [28, 18]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-48, -24, 0], [52, 24, 0], [52, -24, 0], [-48, 24, 0], [BX - 21, -21, ROOF + 26], [BX + 21, 21, ROOF + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  const hub = ([u, v]) => poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((i) => P(u + 3.5 * Math.cos(i * 0.785), v + Math.sign(v) * (WW / 2 + 0.2), WR + 3.5 * Math.sin(i * 0.785)))));
  const wheelSet = (w) => { mk("path", { d: wheel(w), class: "sil" }, g); mk("path", { d: hub(w), class: "nf lo" }, g); };
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, o, i, z0, z1)); return s; };
  WHEELS.filter((w) => w[1] < 0).forEach(wheelSet);
  box(-46, -18, 46, 18, 6, 1.6, 8, 22);
  // cabin: wide foot, short roof
  const foot = rrect(-26, -17, 18, 17, 5, 6), top = rrect(-18, -14, 8, 14, 4, 6);
  const at = (ring, z) => ring.map((q) => P(q.u, q.v, z));
  mk("path", { d: poly(hull(at(foot, 22).concat(at(top, ROOF)))), class: "sil" }, g);
  mk("path", { d: poly([P(-22, 17, 23), P(-6, 17, 23), P(-6, 14.5, 36), P(-16, 14.5, 36)]) + poly([P(-2, 17, 23), P(14, 17, 23), P(6, 14.5, 36), P(-2, 14.5, 36)]), class: "nf lo" }, g);
  // a stripe down the near flank
  mk("path", { d: seg(P(-44, 18, 15), P(44, 18, 15)), class: "nf lo" }, g);
  box(46, -12, 51, 12, 2, 0.8, 8, 20);
  WHEELS.filter((w) => w[1] > 0).forEach(wheelSet);
  // mast and light bar, drawn on top of the roof
  const mast = mk("path", { class: "nf" }, g);
  const bar = solid(g), domes = mk("path", { class: "nf lo" }, g);
  bar.sil.setAttribute("class", "sil hi");
  const base = rrect(-HW, -HL2, HW, HL2, 3, 6), inner = rrect(-HW + 1.2, -HL2 + 1.2, HW - 1.2, HL2 - 1.2, 2, 6);
  const sh = spring(0), sa = spring(0);
  let lastH = NaN, lastA = NaN, over = false;

  function draw() {
    const h = Math.max(0, sh.x), a = sa.x;
    if (Math.abs(h - lastH) < 0.01 && Math.abs(a - lastA) < 0.0005) return;
    lastH = h; lastA = a;
    const c = Math.cos(a), s = Math.sin(a);
    const turn = (ring) => ring.map((q) => ({ u: BX + q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
    const z0 = ROOF + 1 + h, z1 = z0 + 5;
    put(bar, prism(P, front, turn(base), turn(inner), z0, z1));
    let d = "";
    for (const k of [-1, 1]) for (const t of [0.35, 0.75]) {
      const v = k * HL2 * t, p0 = [BX - 4 * s * 0 + (-HW) * c - v * s, (-HW) * s + v * c], p1 = [BX + HW * c - v * s, HW * s + v * c];
      d += seg(P(p0[0], p0[1], z1), P(p1[0], p1[1], z1));
    }
    domes.setAttribute("d", d);
    mast.setAttribute("d", seg(P(BX, 0, ROOF), P(BX, 0, z0)) + seg(P(BX - 1.5, 0, ROOF), P(BX - 1.5, 0, z0)));
  }

  const B = register(stage, (dt) => { const m1 = stepS(sh, dt), m2 = stepS(sa, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  const bb = [[-48, -24, 0], [52, 24, 0], [52, -24, 0], [-48, 24, 0], [BX, -HL2, ROOF + 6], [BX, HL2, ROOF + 6]].map((q) => P(...q));
  const xs = bb.map((q) => q[0]), ys = bb.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    sh.t = over ? 6 + 14 * reach : 0;
    sa.t = over ? rad(40 + 50 * reach) : 0;
    read.textContent = over ? "turn " + Math.round((sa.t * 180) / Math.PI) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { over = sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "policecar",
  means: "A police sedan with a light bar on the roof: the pointer over it raises the bar on its mast and turns it round to sweep.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[189, 125], [152, 156], [248, 262], null],
  mount,
});
