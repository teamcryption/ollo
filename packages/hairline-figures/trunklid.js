/**
 * Car boot lid: a small hatchback seen from the rear quarter, its tailgate
 * hinged at the back of the roof. At rest the tailgate is shut, bright. The
 * pointer over the car swings it up on its hinge to open the boot; the
 * slider is how far it lifts.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, fit, facing, hull, poly, open, prism, proj, rings, rrect, ringAt, run, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const HX = 54, HZ = 44, VX = 34, VZ = -20, NL = Math.hypot(VX, VZ), NX = -VZ / NL, NZ = VX / NL, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [90, 0, 0], [90, 44, 0], [0, 44, 0], [24, 4, 46], [HX + 14, 2, 84], [HX + 14, 42, 84]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(0, 0, 90, 44, 7, 1.5); put(solid(g), prism(P, front, r, i, 6, 26)); }
  { const foot = rrect(10, 2, 56, 42, 5, 4), top = rrect(24, 4, 54, 40, 4, 4), inner = rrect(25.5, 5.5, 52.5, 38.5, 2.5, 4);
    const s = solid(g);
    put(s, { sil: poly(hull(ringAt(P, foot, 26).concat(ringAt(P, top, HZ)))), crease: open(ringAt(P, run(inner, front), HZ)) }); }
  mk("path", { d: poly([P(16, 42.5, 28), P(50, 42.5, 28), P(50, 41, 41), P(26, 41, 41)]), class: "nf lo" }, g);
  // the boot opening, under the tailgate
  mk("path", { d: poly([P(HX + 2, 4, HZ - 2), P(88, 4, 26), P(88, 40, 26), P(HX + 2, 40, HZ - 2)]), class: "nf lo" }, g);
  mk("path", { d: open([P(60, 6, 26), P(88, 6, 26)]), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf lo" }, g), lip = mk("path", { class: "nf lo" }, g);
  // near wheels
  for (const x of [20, 72]) { const pts = []; for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2; pts.push(P(x + 9 * Math.cos(t), 44.5, 9 + 9 * Math.sin(t))); } mk("path", { d: poly(pts) }, g); }
  const W = (s, y, t, a) => {
    const lx = s * VX + t * NX, lz = s * VZ + t * NZ, c = Math.cos(a), sn = Math.sin(a);
    return P(HX + lx * c - lz * sn, y, HZ + lx * sn + lz * c);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const s of [0, 1]) for (const y of [2, 42]) for (const t of [0, 2]) pts.push(W(s, y, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    glass.setAttribute("d", poly([W(0.1, 6, 2, a), W(0.56, 6, 2, a), W(0.56, 38, 2, a), W(0.1, 38, 2, a)]));
    lip.setAttribute("d", open([W(0.8, 16, 2, a), W(0.8, 28, 2, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(45, 22, 26);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a > 0 ? Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 100 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); read.textContent = Math.round(v) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "trunklid",
  means: "A hatchback seen from the rear: the pointer over the car swings its tailgate up on the roof hinge to open the boot.",
  rules: [1, 4, 5, 8],
  range: [45, 80, 100],
  tour: [[250, 165], [200, 150], [290, 140], null],
  mount,
});
