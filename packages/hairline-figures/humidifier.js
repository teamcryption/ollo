/**
 * Humidifier: a low base with a dial, carrying a tall water tank with a grip cut into its top. The pointer over the humidifier lifts the tank off its base to be filled; at rest it sits a little raised, bright.
 *
 * The pattern: one part lifting off a body.
 */
const { Cam, circ, fit, facing, prism, proj, rings, seg, poly, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BZ = 22, TH = 54, LIFT = 38, REST = 0.08;
const BASE = rings(0, 0, 72, 56, 14, 1.8);
const TANK = rings(3, 3, 69, 53, 12, 1.8);
const GRIP = rings(22, 24, 50, 32, 4, 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.1);
  const ext = [];
  for (const q of BASE[0]) ext.push([q.u, q.v, 0]);
  for (const q of TANK[0]) ext.push([q.u, q.v, BZ + TH + LIFT]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, BASE[0], BASE[1], 0, BZ));
  // dial and vents on the base's front face (y = 56)
  mk("path", { class: "nf lo", d: poly(circ(5, 24).map((q) => P(56 + q.u, 56, 11 + q.v))) }, g);
  let vd = "";
  for (let i = 0; i < 4; i++) vd += seg(P(12 + i * 5, 56, 6), P(12 + i * 5, 56, 16));
  mk("path", { class: "nf lo", d: vd }, g);
  const ts = solid(g);
  const det = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z0 = BZ + LIFT * t, z1 = z0 + TH;
    put(ts, prism(P, front, TANK[0], TANK[1], z0, z1));
    let d = poly(GRIP[0].map((q) => P(q.u, q.v, z1)));
    d += seg(P(14, 53, z0 + 24), P(56, 53, z0 + 24));
    for (let i = 0; i < 3; i++) d += seg(P(61, 53, z0 + 10 + i * 12), P(65, 53, z0 + 10 + i * 12));
    det.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  // hit: the rest pose's screen box, base to tank top
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const q of BASE[0]) for (const z of [0, BZ + TH]) { const [sx, sy] = P(q.u, q.v, z); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  x0 -= 6; x1 += 6; y0 -= 10; y1 += 6;
  const hit = ([sx, sy]) => (sx < x0 || sx > x1 || sy < y0 || sy > y1 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : Math.max(REST, amp), performance.now(), 0);
    ts.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "tank " + Math.round(LIFT * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "humidifier",
  means: "A humidifier whose water tank lifts up off its base, ready to be refilled, when the pointer comes over it.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[200, 122], [200, 210], [140, 230], null],
  mount,
});
