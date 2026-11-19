/**
 * Articulated lorry: a short tractor unit with its cab and a long box
 * semi-trailer resting on the fifth wheel, hinged on the kingpin. The nearer
 * the pointer comes, the further the trailer swings round the kingpin, its
 * tail sweeping out toward the viewer as in a tight turn. At rest the trailer
 * sits almost straight, its outline bright. The slider sets the swing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const KX = 44, A0 = 6, A1 = 42, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.5);
  const sw = (x, y, a) => [KX + (x - KX) * Math.cos(a) - y * Math.sin(a), (x - KX) * Math.sin(a) + y * Math.cos(a)];
  const ext = [[-90, 15], [-90, -15], [56, 15], [56, -15]].flatMap(([x, y]) => [A0, A1].map((d) => [...sw(x, y, -rad(d)), 62]));
  fit(C, ext.concat([[92, -14, 0], [92, 14, 0], [-90, 15, 0], [92, 14, 54]]), 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheelD = (pt) => poly(circ(8, 18).map((q) => P(...pt(q.u, q.v)))) + seg(P(...pt(0, 0)), P(...pt(2.5, 0)));
  const fixedWheel = (x, y) => mk("path", { class: "sil", d: wheelD((u, v) => [x + u, y, 8 + v]) }, g);
  const farTW = [-70, -52].map(() => mk("path", { class: "sil" }, g));
  [42, 82].forEach((x) => fixedWheel(x, -12));
  const [cr, ci] = rings(34, -12, 92, 12, 2, 1);
  put(solid(g), prism(P, front, cr, ci, 9, 15));
  mk("path", { class: "dot", d: poly(circ(4, 12).map((q) => P(KX + q.u, q.v, 15))) }, g);
  const trailer = solid(g);
  trailer.sil.classList.add("hi");
  const legs = mk("path", { class: "nf lo" }, g);
  const nearTW = [-70, -52].map(() => mk("path", { class: "sil" }, g));
  const [kr, ki] = rings(66, -13, 92, 13, 5, 1.4);
  put(solid(g), prism(P, front, kr, ki, 15, 54));
  mk("path", { class: "nf lo", d: open([P(92, -10, 34), P(92, -10, 48), P(92, 10, 48), P(92, 10, 34)]) + seg(P(78, 13, 24), P(78, 13, 48)) }, g);
  [42, 82].forEach((x) => fixedWheel(x, 12));
  const [tr, ti] = rings(-90, -15, 56, 15, 3, 1.6);
  const turn = (ring, a) => ring.map((q) => {
    const [u, v] = sw(q.u, q.v, a);
    return { ...q, u, v, nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a) };
  });

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const a = -rad(lerp(A0, A1, p));
    put(trailer, prism(P, front, turn(tr, a), turn(ti, a), 17, 62));
    const tw = (x, y) => wheelD((u, v) => { const [wx, wy] = sw(x + u, y, a); return [wx, wy, 8 + v]; });
    [-70, -52].forEach((x, i) => { farTW[i].setAttribute("d", tw(x, -13)); nearTW[i].setAttribute("d", tw(x, 13)); });
    legs.setAttribute("d", [-12, 12].map((y) => { const [lx, ly] = sw(24, y, a); return seg(P(lx, ly, 17), P(lx, ly, 3)); }).join(""));
  }

  const swing = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(swing, dt); draw(swing.x); return m; });
  bag.add(B.unregister);
  const ax = P(-20, 0, 40);

  function aim(pt) {
    const d = Math.hypot(pt[0] - ax[0], (pt[1] - ax[1]) * 0.7);
    if (d > 160) return leave();
    swing.t = clamp(1.25 - d / 120, 0.15, 1) * (0.3 + 0.7 * reach / 100);
    read.textContent = Math.round(lerp(A0, A1, swing.t)) + "°";
    B.wake();
  }
  function leave() { swing.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "articulated",
  means: "An articulated lorry: the nearer the pointer, the further its trailer swings round the kingpin, the tail sweeping out.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[200, 113], [250, 165], [128, 77], null],
  mount,
});
