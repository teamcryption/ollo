/**
 * Masher: a potato masher above a mound of mash on a board. The pointer
 * presses it: the lower the pointer, the deeper the grid plate plunges and
 * the flatter the mound spreads. At rest it hangs raised, its handle bright.
 * The slider is how deep a full press goes.
 *
 * The pattern: one part sliding on one axis (plunge).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LIFT = 30, PZ = 9, ROD = 44, HL2 = 17;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, PZ + LIFT + ROD + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -30, 30, 30, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const mound = mk("path", { class: "sil" }, g), mtop = mk("path", { class: "nf lo" }, g);

  const m = mk("g", {}, g);
  const cyl = (x, y, r, z0, z1, n = 24) => hull(ringAt(P, disc(x, y, r, n), z0).concat(ringAt(P, disc(x, y, r, n), z1)));
  mk("path", { d: poly(cyl(0, 0, 17, PZ, PZ + 2.2, 48)), class: "sil" }, m);
  let holes = "";
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
    if (i * i + j * j > 5) continue;
    holes += poly(ringAt(P, disc(i * 5.6, j * 5.6, 1.6, 12), PZ + 2.2));
  }
  mk("path", { d: holes, class: "nf lo" }, m);
  const rod = (x) => mk("path", { d: poly(cyl(x, 0, 1.4, PZ + 2, PZ + ROD, 10)) }, m);
  rod(-11);
  const hp = [];
  for (let i = 0; i <= 1; i++) for (let a = 0; a < 24; a++) {
    const t = (a / 24) * Math.PI * 2;
    hp.push(P(-HL2 + i * 2 * HL2, 3.4 * Math.cos(t), PZ + ROD + 3.4 * Math.sin(t)));
  }
  rod(11);
  const handle = mk("path", { d: poly(hull(hp)), class: "sil" }, m);
  mk("path", { d: poly(hull([P(-HL2, 0, PZ + ROD + 3.4), P(HL2, 0, PZ + ROD + 3.4)].concat([P(HL2, 0, PZ + ROD + 3.6), P(-HL2, 0, PZ + ROD + 3.6)]))), class: "nf lo" }, m);
  const unit = P(0, 0, 0)[1] - P(0, 0, 1)[1];

  const sp = spring(0);
  let last = NaN;
  function draw(press) {
    if (press === last) return;
    last = press;
    const z = PZ + LIFT * (1 - press);
    m.setAttribute("transform", "translate(0 " + (-(z - PZ) * unit).toFixed(2) + ")");
    const h = 9 - 6 * press, r = 14 + 6 * press, pts = [];
    for (const [f, zz] of [[1, 0], [0.85, 0.5], [0.6, 0.85], [0.3, 1]]) pts.push(...ringAt(P, disc(1, 0, r * f, 24), 3 + h * zz));
    mound.setAttribute("d", poly(hull(pts)));
    mtop.setAttribute("d", poly(ringAt(P, disc(1, 0, r * 0.3, 16), 3 + h)));
  }
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function aim(t) {
    sp.t = t;
    handle.classList.toggle("hi", t === 0);
    read.textContent = t === 0 ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  aim(0);
  bag.add(pointer(stage, { move: ([, sy]) => aim(clamp((sy - 70) / 170, 0.05, 1) * depth), leave: () => aim(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; }, destroy: bag.dispose };
}

hairline({
  name: "potatomasher",
  means: "A potato masher over a mound of mash: the lower the pointer, the deeper the plate presses and the flatter the mash spreads.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 150], [200, 206], [200, 250], null],
  mount,
});
