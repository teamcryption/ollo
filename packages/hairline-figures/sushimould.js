/**
 * Rice mould: an onigiri press, a rounded triangular frame standing open
 * on a small tray, and the triangular presser that fits inside it, with a
 * knob on top. The pointer over the mould lifts the presser up out of the
 * frame, showing the rice packed inside; leaving presses it back down. At
 * rest the presser sits half pressed, its plate bright. The slider is the lift.
 *
 * The pattern: one part answering hover with a lift (tween), hit on the ground.
 */
const {
  Cam, fillet, fit, hull, open, poly, proj, unproj, tset, tval, tween, tdone,
  disposer, mk, pointer, register,
} = HL;

const tri = (R, rr, rot = 15) => fillet([0, 120, 240].map((a) => { const t = ((a + rot) * Math.PI) / 180; return [R * Math.cos(t), R * Math.sin(t)]; }), [rr, rr, rr], 6);
const H = 20, REST = 16, TH = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, tri(46, 12).map(([x, y]) => [x, y, 0]).concat(tri(30, 7).map(([x, y]) => [x, y, 3 + H + 30 + TH + 12])), 200, 168);
  const P = proj(C);
  const at = (pts, z) => pts.map(([x, y]) => P(x, y, z));
  const body = (pts, z0, z1, cls = "sil") => mk("path", { class: cls, d: poly(hull(at(pts, z0).concat(at(pts, z1)))) }, g);
  const g = mk("g", {}, svg);

  // tray, then the frame with its open top, then the rice mound inside
  const tray = tri(46, 12), outer = tri(36, 9), inner = tri(31, 7), rice = tri(27, 7);
  body(tray, 0, 3);
  mk("path", { class: "nf lo", d: poly(at(tri(44, 11), 3)) }, g);
  body(outer, 3, 3 + H);
  mk("path", { d: poly(at(inner, 3 + H)) }, g);
  mk("path", { class: "nf lo", d: poly(hull(at(rice, 3 + H - 2).concat(at(tri(18, 6), 3 + H + 5)))) }, g);

  // the presser: a plate a little smaller than the opening, a stem and a knob
  const plate = mk("path", { class: "sil hi" }, g), crease = mk("path", { class: "nf lo" }, g);
  const stem = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);
  const disc = (r) => Array.from({ length: 24 }, (_, i) => [r * Math.cos((i / 24) * 2 * Math.PI), r * Math.sin((i / 24) * 2 * Math.PI)]);
  const z = tween(REST);
  let last = NaN;
  function draw(lv) {
    if (lv === last) return;
    last = lv;
    const z0 = 3 + H - REST + lv;
    plate.setAttribute("d", poly(hull(at(tri(29.5, 7), z0).concat(at(tri(29.5, 7), z0 + TH)))));
    crease.setAttribute("d", open(at(tri(27.5, 6), z0 + TH)));
    stem.setAttribute("d", poly(hull(at(disc(3), z0 + TH).concat(at(disc(3), z0 + TH + 7)))));
    knob.setAttribute("d", poly(hull(at(disc(7), z0 + TH + 7).concat(at(disc(6), z0 + TH + 12)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? REST + lift : REST, performance.now(), 0);
    read.textContent = a ? "lift" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 3 + H);
    set(Math.hypot(x, y) < 46);
  }
  set(false);
  bag.add(pointer(stage, { move, leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "sushimould",
  means: "An onigiri mould on its tray: the pointer lifts the triangular presser out of the frame to show the rice packed inside.",
  rules: [1, 3, 5, 6],
  range: [14, 26, 30],
  tour: [[228, 189], [250, 200], [205, 180], null],
  mount,
});
