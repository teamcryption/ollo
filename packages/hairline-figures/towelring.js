/**
 * Towel ring: a round wall plate holding a ring on a short arm, a hand towel
 * hung through it, the ring bright at rest. Over it the ring and towel swing
 * out from the wall on the arm's pin, as if pulled for a hand. The slider is
 * how far it swings.
 *
 * The pattern: one object, one part that swings.
 */
const { Cam, circ, fit, fillet, hull, poly, proj, rad, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const PZ = 90, RR = 20, TW = 80, TH = 44;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, -24, PZ + 16], [0, 24, PZ - 20], [6, -TW / 2, PZ - 2 * RR - TH], [6, TW / 2, PZ - 2 * RR - TH], [60, 0, PZ - 70]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const plate = circ(14, 40).map((q) => P(0, q.u, PZ + q.v));
  const plate2 = circ(14, 40).map((q) => P(3, q.u, PZ + q.v));
  mk("path", { d: poly(hull(plate.concat(plate2))), class: "sil" }, g);
  mk("path", { d: poly(circ(11, 40).map((q) => P(3, q.u, PZ + q.v))), class: "nf lo" }, g);
  mk("path", { d: poly(hull(circ(3, 16).map((q) => P(3, q.u, PZ + q.v)).concat(circ(3, 16).map((q) => P(9, q.u, PZ + q.v))))), class: "sil" }, g);
  const back = mk("path", { class: "sil" }, g), ringO = mk("path", { class: "nf hi" }, g), ringI = mk("path", { class: "nf lo" }, g), towel = mk("path", { class: "sil" }, g), hem = mk("path", { class: "nf lo" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(8 + v * amt);
    const X = ([x, y, z]) => { const dx = x - 9, dz = z - PZ; return P(9 + dx * Math.cos(a) - dz * Math.sin(a), y, PZ + dx * Math.sin(a) + dz * Math.cos(a)); };
    const cz = PZ - 4 - RR;
    ringO.setAttribute("d", poly(circ(RR, 48).map((q) => X([9, q.u, cz + q.v]))));
    ringI.setAttribute("d", poly(circ(RR - 3, 48).map((q) => X([9, q.u, cz + q.v]))));
    const bz = cz - RR + 2, tw = TW / 2;
    const panel = (dx, len) => fillet([X([9 + dx, -tw, bz]), X([9 + dx, tw, bz]), X([9 + dx, tw, bz - len]), X([9 + dx, -tw, bz - len])], [3, 3, 3, 3]);
    back.setAttribute("d", poly(panel(-4, TH * 0.7)));
    towel.setAttribute("d", poly(panel(3, TH)));
    hem.setAttribute("d", poly(fillet([X([9 + 3, -tw + 3, bz - TH + 9]), X([9 + 3, tw - 3, bz - TH + 9]), X([9 + 3, tw - 3, bz - TH + 6]), X([9 + 3, -tw + 3, bz - TH + 6])], [1, 1, 1, 1])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(9, 0, PZ - 50);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "swung" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 70 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "towelring",
  means: "A towel ring on a wall plate: over it the ring and its hand towel swing out from the wall on the arm's pin.",
  rules: [1, 4, 5, 8],
  range: [20, 40, 60],
  tour: [[198, 209], [202, 78], [198, 209], null],
  mount,
});
