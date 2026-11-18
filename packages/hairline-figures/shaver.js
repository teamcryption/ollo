/**
 * Shaver: an electric foil shaver standing on its foot, a rounded grip with
 * a panel and a power button, a neck, and a wide head carrying two foil
 * rolls. The head is hinged at its back edge: the higher the pointer goes up
 * the shaver, the further the head pops up and swings back, baring the
 * cutter block. At rest it sits a little ajar and the button is the bright
 * mark. The slider is how far back the head can swing.
 *
 * The pattern: one part on a hinge, its angle a spring driven by the
 * pointer's height over the rest pose's fixed screen band.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const HY = -7, HZ = 40, REST = 6, FR = 3.5, FZ = 49.2, HT = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 4.3);
  // the head's local points, rotated about the hinge (an x axis at HY, HZ) and popped up
  const blk = rrect(-16, -7, 16, 7, 4.5, 6);
  function pose(t) {
    const a = (t * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), up = 5 * clamp(t / 40, 0, 1);
    return ([x, y, z]) => { const dy = y - HY, dz = z - HZ; return [x, HY + dy * c - dz * s, HZ + dy * s + dz * c + up]; };
  }
  function headPts(R) {
    const pts = [];
    blk.forEach((q) => { pts.push(R([q.u, q.v, HZ]), R([q.u, q.v, HT])); });
    [-15.5, 15.5].forEach((x) => [-3.4, 3.4].forEach((yc) => {
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push(R([x, yc + FR * Math.cos(a), FZ + FR * Math.sin(a)])); }
    }));
    return pts;
  }
  fit(C, [[-12, -7, 0], [12, 7, 0], [16, 7, 53], [-16, -7, 53]].concat(headPts(pose(110))), 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the grip, its panel and the power button
  const body = solid(g);
  const [br, bi] = rings(-12, -7, 12, 7, 6, 1.4);
  put(body, prism(P, front, br, bi, 0, 36));
  const panel = rrect(-6, 7, 6, 25, 4.5, 4).map((q) => P(q.u, 7, q.v));
  mk("path", { class: "nf lo", d: poly(panel) + seg(P(-3.5, 7, 13), P(3.5, 7, 13)) + seg(P(-3.5, 7, 17), P(3.5, 7, 17)) }, body.g);
  const btn = mk("circle", { class: "dot", r: 3 }, body.g);
  place(btn, P(0, 7, 30));
  const neck = solid(g);
  const [nr, ni] = rings(-10, -5.5, 10, 5.5, 4, 1);
  put(neck, prism(P, front, nr, ni, 36, HZ));

  // the head, then the cutter block it covers
  const hg = mk("g", {}, g);
  const hsil = mk("path", { class: "sil" }, hg), hcr = mk("path", { class: "nf lo" }, hg);
  const cut = solid(g);
  const [cr, ci] = rings(-14, -4, 14, 4, 1.5, 0.6);
  put(cut, prism(P, front, cr, ci, HZ, HZ + 3));
  let blades = "";
  for (let k = -2; k <= 2; k++) blades += seg(P(-13, k * 1.5, HZ + 3), P(13, k * 1.5, HZ + 3));
  mk("path", { class: "nf lo", d: blades }, cut.g);

  let last = NaN;
  function draw(t) {
    if (Math.abs(t - last) < 0.02) return;
    last = t;
    const R = pose(t), Q = (p) => P(...R(p));
    hsil.setAttribute("d", poly(hull(headPts(R).map((p) => P(...p)))));
    let d = "";
    [-3.4, 3.4].forEach((yc) => {
      const arc = [];
      for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI; arc.push(Q([15.5, yc + FR * Math.cos(a), FZ + FR * Math.sin(a)])); }
      d += open(arc) + seg(Q([-15.5, yc, FZ + FR]), Q([15.5, yc, FZ + FR]));
    });
    d += seg(Q([-15.5, 0, HT - 0.8]), Q([15.5, 0, HT - 0.8])) + open([Q([15.6, 6.9, HT - 1]), Q([15.6, 6.9, HZ + 1.5])]);
    hcr.setAttribute("d", d);
    if (t > 38) { if (!cut.g.isConnected) hg.after(cut.g); } else cut.g.remove();
  }

  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  // the hit: a fixed screen band over the rest pose; height along it sets the swing
  const top = P(0, 0, 54)[1], bot = P(0, 0, 6)[1];
  const xs = [P(-16, 7, 44)[0], P(16, -7, 44)[0], P(-12, 7, 0)[0], P(12, -7, 0)[0]];
  const x0 = Math.min(...xs) - 6, x1 = Math.max(...xs) + 6;
  let f = -1;
  function aim() {
    ang.t = f < 0 ? REST : amax * (0.2 + 0.8 * f);
    const on = f >= 0;
    hsil.classList.toggle("hi", on);
    btn.setAttribute("class", on ? "dot off" : "dot");
    read.textContent = on ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    f = sx < x0 || sx > x1 || sy < top - 30 || sy > P(12, 7, 0)[1] + 8 ? -1 : clamp((bot - sy) / (bot - top), 0, 1);
    aim();
  }
  aim();
  bag.add(pointer(stage, { move, leave: () => { f = -1; aim(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; if (f >= 0) aim(); }, destroy: bag.dispose };
}

hairline({
  name: "shaver",
  means: "An electric foil shaver: the higher the pointer climbs it, the further its hinged head pops up and swings back off the cutters.",
  rules: [1, 3, 4, 5],
  range: [30, 80, 110],
  tour: [[134, 249], [134, 182], [145, 95], null],
  mount,
});
