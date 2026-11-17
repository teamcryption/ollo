/**
 * Fish trap: a round wicker trap, woven in bands, with a funnel lid hinged at
 * the back. The pointer tips the lid open to show the mouth of the trap;
 * leaving lets it settle back, just lifted. At rest the lid is bright.
 * The slider is how far the lid tips.
 *
 * The pattern: one hinged part (open).
 */
const { Cam, fit, facing, circ, hull, open, poly, prism, proj, rad, run, ringAt, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 33, H = 54, LH = 22, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R, -R, 0], [R, R, 0], [0, -R - 4, H + 2 * R + 6], [R, R, H + 4]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ring = circ(R, 48);
  put(solid(g), prism(P, front, ring, circ(R - 2.4, 48), 0, H));
  const near = run(ring, front);
  for (let z = 8; z < H; z += 8) mk("path", { d: open(near.map((q) => P(q.u, q.v, z))), class: "nf lo" }, g);
  for (const q of near.filter((_, i) => i % 3 === 1)) mk("path", { d: open([P(q.u, q.v, 2), P(q.u, q.v, H - 2)]), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, circ(10, 32), H)), class: "nf" }, g);
  const lid = mk("path", { class: "sil hi" }, g), band = mk("path", { class: "nf lo" }, g), mouth = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  const rot = (x, y, z, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)), dy = y + R, dz = z; return P(x, -R + dy * c - dz * s, H + dy * s + dz * c); };
  let last = NaN;
  const lr = circ(R + 1, 40), mr = circ(9, 24), br = circ(R * 0.62, 32);
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = lr.map((q) => rot(q.u, q.v, 0, a)).concat(lr.map((q) => rot(q.u, q.v, 3, a)), mr.map((q) => rot(q.u, q.v, LH, a)));
    lid.setAttribute("d", poly(hull(pts)));
    band.setAttribute("d", poly(br.map((q) => rot(q.u, q.v, LH * 0.45, a))));
    mouth.setAttribute("d", poly(mr.map((q) => rot(q.u, q.v, LH, a))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: () => set(true), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "harpoon",
  means: "A round wicker fish trap with a funnel lid hinged at the back: the pointer tips the lid open on the trap's mouth.",
  rules: [3, 5, 6, 8],
  range: [50, 80, 88],
  tour: [[170, 136], [224, 60], [116, 249], null],
  mount,
});
