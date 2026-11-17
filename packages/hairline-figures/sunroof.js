/**
 * Sunroof: a small saloon car, the glass panel set into its roof. At rest
 * the panel is shut, bright. The pointer over the car lifts the panel a
 * little and slides it back along the roof, opening the hole above the
 * seats; the slider is how far it slides.
 *
 * The pattern: one sliding part (slide).
 */
const { Cam, fit, facing, hull, poly, open, prism, proj, rings, rrect, ringAt, run, clamp, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const HZ = 44, X0 = 25, X1 = 46, Y0 = 6.5, Y1 = 37.5, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let far = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [92, 0, 0], [92, 44, 0], [0, 44, 0], [22, 4, HZ + 4], [74, 40, HZ + 7]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(0, 0, 92, 44, 7, 1.5); put(solid(g), prism(P, front, r, i, 6, 26)); }
  { const foot = rrect(10, 2, 80, 42, 5, 4), top = rrect(22, 4, 74, 40, 4, 4), inner = rrect(23.5, 5.5, 72.5, 38.5, 2.5, 4);
    put(solid(g), { sil: poly(hull(ringAt(P, foot, 26).concat(ringAt(P, top, HZ)))), crease: open(ringAt(P, run(inner, front), HZ)) }); }
  mk("path", { d: poly([P(16, 42.5, 28), P(70, 42.5, 28), P(62, 41, 41), P(26, 41, 41)]), class: "nf lo" }, g);
  // the roof opening and the seat backs seen through it
  mk("path", { d: poly([P(X0, Y0, HZ), P(X1, Y0, HZ), P(X1, Y1, HZ), P(X0, Y1, HZ)]), class: "nf lo" }, g);
  for (const [x, a, b] of [[X1 - 4, Y0 + 3, Y0 + 13], [X1 - 4, Y1 - 13, Y1 - 3], [X0 + 5, Y0 + 3, Y1 - 3]]) mk("path", { d: open([P(x, a, HZ), P(x, b, HZ)]), class: "nf lo" }, g);
  const pane = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf lo" }, g);
  for (const x of [20, 74]) { const pts = []; for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2; pts.push(P(x + 9 * Math.cos(t), 44.5, 9 + 9 * Math.sin(t))); } mk("path", { d: poly(pts) }, g); }
  const pos = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const z = HZ + clamp(d / 3, 0, 5), pts = [];
    for (const x of [X0 + d, X1 + d]) for (const y of [Y0, Y1]) for (const h of [0, 1.6]) pts.push(P(x, y, z + h));
    pane.setAttribute("d", poly(hull(pts)));
    glass.setAttribute("d", poly([P(X0 + d + 3, Y0 + 3, z + 1.6), P(X1 + d - 3, Y0 + 3, z + 1.6), P(X1 + d - 3, Y1 - 3, z + 1.6), P(X0 + d + 3, Y1 - 3, z + 1.6)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(pos, now)); return !tdone(pos, now); });
  bag.add(B.unregister);
  const mid = P(46, 22, 26);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(pos, a > 0 ? far : REST, performance.now(), 0);
    pane.classList.add("hi");
    read.textContent = a > 0 ? Math.round((far / 28) * 100) + "%" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 100 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { far = v; if (act > 0) { tset(pos, v, performance.now(), 0); read.textContent = Math.round((v / 28) * 100) + "%"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sunroof",
  means: "A small car with a glass sunroof: the pointer over the car lifts the panel and slides it back along the roof to open it.",
  rules: [1, 4, 5, 8],
  range: [10, 24, 28],
  tour: [[182, 106], [200, 170], [240, 150], null],
  mount,
});
