/**
 * Potato ricer: a round basket with a long lower handle, and an upper
 * handle hinged over the far rim carrying the plunger disc. The pointer over
 * the ricer swings the upper handle up on its hinge and lifts the plunger
 * out of the basket. At rest the handle stands a little open, bright.
 * The slider is how far it opens. The hit is a fixed screen box.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const R = 15, H = 30, YH = -20, ZH = 38, L = 96, REST = 10, OPEN = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.95);
  const at = (d, th, off = 0) => [0, YH + d * Math.cos(th) - off * Math.sin(th), ZH + d * Math.sin(th) + off * Math.cos(th)];
  fit(C, [[-R, -R - 8, 0], [R, R, 0], [0, 84, ZH], at(L, rad(OPEN + REST)), at(0, 0), [0, 84, 0]], 200, 190);
  const P = proj(C), front = facing(C);
  const capsule = (a, b, r) => {
    const pts = [];
    for (const c of [a, b]) for (let i = 0; i < 12; i++) {
      const q = (i / 12) * Math.PI * 2, u = r * Math.cos(q), w = r * Math.sin(q);
      pts.push(P(c[0] + u, c[1] + w, c[2]), P(c[0] + u, c[1], c[2] + w), P(c[0], c[1] + u, c[2] + w));
    }
    return poly(hull(pts));
  };
  const g = mk("g", {}, svg);
  // hinge post on the far rim
  mk("path", { class: "sil", d: capsule([0, YH + 2, H - 2], [0, YH, ZH], 4) }, g);
  // basket
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 0, H));
  for (const z of [8, 16]) mk("path", { class: "nf lo", d: open(ringAt(P, disc(0, 0, R), z).slice(5, 26)) }, g);
  put(solid(g), prism(P, front, disc(0, 0, R + 2), disc(0, 0, R), H - 2, H));
  // the plunger and the upper handle move together
  const mv = mk("g", {}, g);
  const stem = mk("path", { class: "sil" }, mv), plate = mk("path", {}, mv), plCr = mk("path", { class: "nf lo" }, mv);
  // lower handle, fixed, reaching to the viewer
  mk("path", { class: "sil", d: capsule([0, R, H - 1], [0, 84, H + 4], 3.6) }, g);
  mk("path", { class: "nf lo", d: open([P(0, R + 4, H + 2.5), P(0, 80, H + 7)]) }, g);
  const top = mk("g", {}, g);
  const arm = mk("path", { class: "sil hi" }, top), armCr = mk("path", { class: "nf lo" }, top);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const th = rad(REST + v * OPEN * amt);
    arm.setAttribute("d", capsule(at(0, th), at(L, th, -6), 4));
    armCr.setAttribute("d", open([P(...at(6, th, 3)), P(...at(L - 4, th, -3))]));
    const pc = at(-YH, th, -12), lift = Math.max(pc[2], H - 10);
    stem.setAttribute("d", capsule(at(-YH, th), [0, pc[1], lift], 2.4));
    const pr = prism(P, front, disc(0, pc[1], R - 3), disc(0, pc[1], R - 5), lift - 2, lift);
    plate.setAttribute("d", pr.sil);
    plCr.setAttribute("d", pr.crease);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 140 && Math.abs(sy - 168) < 140), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "potatoricer",
  means: "A potato ricer: the pointer swings the upper handle up on its hinge and lifts the plunger out of the basket.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[162, 220], [200, 190], [236, 168], null],
  mount,
});
