/**
 * Lifeboat: an open double-ended lifeboat, two oars out in their rowlocks,
 * thwarts across the open stern and a domed canopy over the bow, hinged
 * amidships. The pointer over the boat swings the canopy up and back on its
 * hinge, wider the nearer the bow. At rest the canopy sits just ajar, bright.
 * The slider is how far the canopy can open.
 *
 * The pattern: one part swinging to the pointer, on a spring.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, proj, rrect, ringAt, run, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const L = 92, W = 30, HZ = 20, HX = 40, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-6, -24, 0], [L, W + 24, 0], [L, -4, 0], [-6, W + 24, 6], [HX, W / 2, 72], [10, W / 2, 62]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const oar = (y1) => {
    const a = P(26, W / 2 + (y1 > 0 ? 6 : -6), HZ + 1), b = P(14, y1, 4), c = P(10, y1 + (y1 > 0 ? 6 : -6), 2);
    mk("path", { d: seg(a, b), class: "nf sil" }, g);
    const bl = [P(15, y1 - 2.5, 4), P(9, y1 + (y1 > 0 ? 7 : -7) - 2.5, 1.5), P(9, y1 + (y1 > 0 ? 7 : -7) + 2.5, 1.5), P(15, y1 + 2.5, 4)];
    mk("path", { d: poly(bl), class: "sil" }, g);
    void c;
  };
  oar(-24);
  const foot = rrect(12, 9, L - 12, W - 9, 6, 6), top = rrect(0, 0, L, W, 15, 10), inner = rrect(2, 2, L - 2, W - 2, 13, 10);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, HZ)))), crease: open(ringAt(P, run(inner, front), HZ)) });
  for (const x of [10, 24]) mk("path", { d: seg(P(x, 2.5, HZ - 2), P(x, W - 2.5, HZ - 2)), class: "nf lo" }, g);
  mk("path", { d: seg(P(HX, 1, HZ + 0.5), P(HX, W - 1, HZ + 0.5)), class: "nf" }, g);
  const can = mk("path", { class: "sil hi" }, g), ridge = mk("path", { class: "nf lo" }, g), lip = mk("path", { class: "nf lo" }, g);
  oar(W + 18);

  const hw = (x) => (x > L - 15 ? Math.sqrt(Math.max(0, 225 - (x - (L - 15)) ** 2)) : 15) - 1;
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), ca = Math.cos(a), sa = Math.sin(a);
    const R = (x, y, z) => { const dx = x - HX, dz = z - HZ; return P(HX + dx * ca - dz * sa, y, HZ + dx * sa + dz * ca); };
    const pts = [], rid = [], end = [];
    for (let x = HX + 1; x <= L - 1; x += 3) {
      const w = hw(x);
      for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI, p = R(x, W / 2 + w * Math.cos(t), HZ + 0.8 * w * Math.sin(t)); pts.push(p); if (x === HX + 1) end.push(p); if (i === 5) rid.push(p); }
    }
    can.setAttribute("d", poly(hull(pts)));
    ridge.setAttribute("d", open(rid));
    lip.setAttribute("d", open(end));
  }

  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const over = wx > -20 && wx < L + 20 && wy > -30 && wy < W + 30;
    ang.t = over ? REST + reach * clamp(0.4 + (0.6 * wx) / L, 0.4, 1) : REST;
    read.textContent = over ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "lifeboat",
  means: "An open lifeboat with oars out: the pointer over it swings the domed bow canopy up on its hinge, wider nearer the bow.",
  rules: [1, 3, 5, 8],
  range: [40, 95, 118],
  tour: [[205, 200], [276, 167], [305, 212], null],
  mount,
});
