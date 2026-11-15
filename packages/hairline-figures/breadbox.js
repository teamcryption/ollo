/**
 * Bread bin: a box with quarter-round ends and a slatted roll-top front.
 * The pointer's place across the figure rolls the top up and back into the
 * bin, slat by slat, to show the loaf inside. At rest the top is shut and
 * bright. The slider is how far it can roll.
 *
 * The pattern: one part sliding round a curve (roll).
 */
const { Cam, fit, proj, hull, poly, seg, rrect, rings, prism, facing, put, solid, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const W = 70, D = 34, Z0 = 4, SL = 8, REST = 0;
const at = (x, th) => [x, -D * Math.cos(th), Z0 + D * Math.sin(th)];
const arc = (x, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => at(x, a0 + ((a1 - a0) * i) / n));
const side = (x) => [[x, 0, Z0], ...arc(x, Math.PI / 2, Math.PI)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], ...side(0), ...side(W)], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-4, -4, W + 4, D + 4, 4, 1.5);
  put(solid(g), prism(P, front, cr, ci, 0, Z0));
  mk("path", { d: poly(side(0).map((p) => P(...p))), class: "sil" }, g);
  // the loaf: a low rounded hull inside
  const loaf = [];
  for (const [r, z] of [[1, 0], [1, 6], [0.8, 12], [0.45, 16]]) for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; loaf.push(P(W / 2 + 24 * r * Math.cos(t), D * 0.45 + 9 * r * Math.sin(t), Z0 + z)); }
  mk("path", { d: poly(hull(loaf)), class: "nf" }, g);
  const lid = mk("path", { class: "sil hi" }, g), slats = mk("path", { class: "nf lo" }, g);
  mk("path", { d: poly(side(W).map((p) => P(...p))), class: "sil" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const lo = Math.PI - rad(a), hi = Math.PI / 2;
    lid.setAttribute("d", poly([...arc(0, hi, lo), ...arc(W, lo, hi)].map((p) => P(...p))));
    let s = "";
    for (let k = 1; ; k++) { const th = lo - rad(SL * k); if (th <= hi) break; s += seg(P(...at(0, th)), P(...at(W, th))); }
    slats.setAttribute("d", s);
  }
  const L = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(L.unregister);
  const x0 = P(0, D, 0)[0], x1 = P(W, 0, 0)[0], yc = P(W / 2, D / 2, Z0 + D / 2)[1];
  function setT(t) {
    const to = t < 0 ? REST : Math.round(t * maxA);
    tset(ang, to, performance.now(), 0);
    read.textContent = t < 0 ? "rest" : to + "°";
    L.wake();
  }
  setT(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setT(sx < x0 - 30 || sx > x1 + 30 || Math.abs(sy - yc) > 120 ? -1 : clamp((sx - x0) / (x1 - x0), 0, 1)),
    leave: () => setT(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "breadbox",
  means: "A bread bin: the pointer rolls its slatted top up and back into the bin to show the loaf inside.",
  rules: [1, 3, 4, 5],
  range: [40, 65, 80],
  tour: [[104, 174], [222, 148], [296, 130], null],
  mount,
});
