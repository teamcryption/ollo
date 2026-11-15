/**
 * Sand timer: an hourglass hung on a pivot between two uprights of a
 * stand. The pointer's place across the floor tilts the glass on its pins,
 * following on a spring; at rest it leans a little, its sand bright in the
 * lower bulb. The slider is how far the glass may swing.
 *
 * The pattern: one part turning to the pointer (aim).
 */
const { Cam, circ, rrect, fit, hull, poly, open, seg, proj, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const ZC = 54, HH = 45, R2 = Math.SQRT1_2, REST = -12;
// u runs across the screen, w into depth; the glass turns in the u-z plane round the axis along w
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  const toW = (u, w, z, th) => {
    const c = Math.cos(th), s = Math.sin(th), dz = z - ZC;
    const u2 = u * c - dz * s, z2 = ZC + u * s + dz * c;
    return [(u2 + w) * R2, (w - u2) * R2, z2];
  };
  const disc = (r, z, n = 28) => circ(r, n).map((q) => [q.u, q.v, z]);
  const box = (u0, w0, u1, w1, r, z) => rrect(u0, w0, u1, w1, r, 4).map((q) => [q.u, q.v, z]);
  const ext = [];
  for (const th of [rad(-45), rad(45)]) for (const z of [ZC - HH, ZC + HH]) for (const p of box(-30, -30, 30, 30, 6, z)) ext.push(toW(p[0], p[1], p[2], th));
  for (const p of box(-40, -46, 40, 46, 8, 0)) ext.push(toW(p[0], p[1], p[2], 0));
  fit(C, ext, 200, 166);
  const P = proj(C);
  const scr = (pts, th) => pts.map((p) => P(...toW(p[0], p[1], p[2], th)));
  const g = mk("g", {}, svg);

  // the stand: a base plate and two uprights carrying the pins
  const base = mk("path", { class: "sil" }, g), baseCr = mk("path", { class: "nf lo" }, g);
  base.setAttribute("d", poly(hull(scr(box(-40, -46, 40, 46, 8, 0).concat(box(-40, -46, 40, 46, 8, 5)), 0))));
  baseCr.setAttribute("d", poly(scr(box(-38, -44, 38, 44, 7, 5), 0)));
  const upright = (w0, w1) => {
    const el = mk("path", { class: "sil" }, g);
    el.setAttribute("d", poly(hull(scr(box(-5, w0, 5, w1, 2, 5).concat(box(-5, w0, 5, w1, 2, ZC + 6)), 0))));
  };
  upright(-46, -40);

  // the glass: two plates, three posts, two bulbs and the sand
  const layer = (cls) => mk("path", { class: cls }, g);
  const botPlate = layer("sil"), botCr = layer("nf lo"), backPost = layer("sil");
  const lowBulb = layer("nf sil"), sand = layer("nf sil hi"), upBulb = layer("nf sil"), upSand = layer("nf lo"), stream = layer("dash nf");
  const postL = layer("sil"), postR = layer("sil"), topPlate = layer("sil"), topCr = layer("nf lo");
  upright(40, 46);
  const pin = mk("path", { class: "nf" }, g);

  const B0 = ZC - HH, T0 = ZC + HH, PL = 6;
  const prof = [[0, 14], [6, 21], [15, 23], [26, 18], [36, 7], [HH - PL, 3]];
  const lowPts = [], upPts = [];
  for (const [dz, r] of prof) { lowPts.push(...disc(r, B0 + PL + dz)); upPts.push(...disc(r, T0 - PL - dz)); }
  const sandPts = disc(19, B0 + PL + 1).concat(disc(22, B0 + PL + 12), disc(3, B0 + PL + 22, 12));
  const upSandPts = disc(4, ZC + 3, 12).concat(disc(13, ZC + 13), disc(14, ZC + 15));
  const post = (u, w) => disc(2.4, B0 + PL, 12).map((p) => [p[0] + u, p[1] + w, p[2]]).concat(disc(2.4, T0 - PL, 12).map((p) => [p[0] + u, p[1] + w, p[2]]));
  const plate = (z0) => box(-28, -28, 28, 28, 7, z0).concat(box(-28, -28, 28, 28, 7, z0 + PL));
  const pinPts = disc(4, 0, 14).map((p) => [p[0], 46, ZC + p[1]]).concat(disc(4, 0, 14).map((p) => [p[0], 49, ZC + p[1]]));

  const tilt = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (Math.abs(deg - last) < 0.01) return;
    last = deg;
    const th = rad(deg), H = (pts) => poly(hull(scr(pts, th)));
    botPlate.setAttribute("d", H(plate(B0)));
    botCr.setAttribute("d", poly(scr(box(-26, -26, 26, 26, 6, B0 + PL), th)));
    backPost.setAttribute("d", H(post(0, -24)));
    lowBulb.setAttribute("d", H(lowPts));
    sand.setAttribute("d", H(sandPts));
    upBulb.setAttribute("d", H(upPts));
    upSand.setAttribute("d", H(upSandPts));
    stream.setAttribute("d", seg(...scr([[0, 0, ZC + 3], [0, 0, B0 + PL + 22]], th)));
    postL.setAttribute("d", H(post(-21, 16)));
    postR.setAttribute("d", H(post(21, 16)));
    topPlate.setAttribute("d", H(plate(T0 - PL)));
    topCr.setAttribute("d", poly(scr(box(-26, -26, 26, 26, 6, T0), th)));
    pin.setAttribute("d", H(pinPts));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { tilt.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const u = (x - y) * R2;
    tilt.t = clamp(-u / 70, -1, 1) * reach;
    read.textContent = Math.round(Math.abs(tilt.t)) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cardtower",
  means: "A sand timer hung on pins in a stand: the glass tilts toward the pointer on a spring, its sand bright in the lower bulb.",
  rules: [1, 3, 5, 8],
  range: [10, 40, 45],
  tour: [[78, 236], [322, 236], [200, 255], null],
  mount,
});
