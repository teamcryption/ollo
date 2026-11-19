/**
 * Dumper: a site dumper, the small four-wheeled kind, with a deep skip over
 * its front wheels and the driver's seat under a roll bar behind it. The
 * pointer's place across the frame tips the skip forward on its front hinge,
 * its back rising over the bonnet. At rest the skip sits cracked a few
 * degrees, bright. The slider is how far it tips.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 112, W = 50, Z0 = 12, ZB = 24, HX = 106, SL = 50, SH = 30, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.0);
  const sp = (y, d, h, a) => [HX - d * Math.cos(rad(a)) + h * Math.sin(rad(a)), y, ZB + d * Math.sin(rad(a)) + h * Math.cos(rad(a))];
  fit(C, [[0, 0, 0], [L + 10, W, 0], [0, W, 0], [L, 0, 0], [0, 4, ZB + 40], sp(0, SL + 4, SH, 100), sp(W, -8, SH, 100), sp(0, SL + 4, SH, 0)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y, r) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, r + r * Math.sin(t))); }
    return pts;
  };
  const wheels = (y) => { mk("path", { d: poly(wheel(22, y, 12)) }, g); mk("path", { d: poly(wheel(HX - 14, y, 15)) }, g); };
  wheels(3);
  const [chr, chi] = rings(4, 7, L - 4, W - 7, 4, 1.2);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB));
  const [ser, sei] = rings(10, 12, 32, W - 12, 4, 1.2);
  put(solid(g), prism(P, front, ser, sei, ZB, ZB + 9));
  mk("path", { d: seg(P(12, 14, ZB + 9), P(8, 14, ZB + 24)) + seg(P(12, W - 14, ZB + 9), P(8, W - 14, ZB + 24)), class: "nf lo" }, g);
  mk("path", { d: open([P(6, 6, ZB), P(4, 6, ZB + 40), P(4, W - 6, ZB + 40), P(6, W - 6, ZB)]), class: "nf" }, g);
  mk("path", { d: seg(P(40, W / 2, ZB), P(46, W / 2, ZB + 16)), class: "nf lo" }, g);
  const sw = [];
  for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; sw.push(P(44 + 2 * Math.sin(t), W / 2 + 7 * Math.cos(t), ZB + 17 + 6 * Math.sin(t))); }
  mk("path", { d: poly(sw), class: "nf" }, g);
  const skip = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  wheels(W - 3);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [0, W]) for (const [d, h] of [[0, 0], [SL, 0], [SL + 4, SH], [-8, SH]]) pts.push(P(...sp(y, d, h, a)));
    skip.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly([sp(4, SL, SH, a), sp(4, -4, SH, a), sp(W - 4, -4, SH, a), sp(W - 4, SL, SH, a)].map((p) => P(...p))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 220, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "dumper",
  means: "A site dumper with its skip hinged over the front wheels: the pointer tips the skip forward, its back rising high.",
  rules: [1, 3, 5, 6],
  range: [45, 80, 100],
  tour: [[211, 140], [253, 255], [112, 184], null],
  mount,
});
