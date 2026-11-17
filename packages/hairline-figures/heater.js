/**
 * Fan heater: a boxy heater with a slatted grille, hung between two arms on a flat foot. The pointer over it tilts the body up on its pivot; at rest it leans up a little, bright.
 *
 * The pattern: one part tilting on a hinge.
 */
const { Cam, fit, hull, poly, prism, facing, proj, rings, seg, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TILT = 42, REST = 0.18, YC = 18, ZP = 46;
const BOX = rings(0, 0, 64, 36, 7, 1.8);
const FOOT = rings(-10, -8, 74, 44, 10, 1.6);
const ARM = (x) => rings(x, 13, x + 6, 23, 2.5, 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.3);
  const R = (x, y, z, a) => { const c = Math.cos(a), s = Math.sin(a), dy = y - YC, dz = z - ZP; return [x, YC + dy * c - dz * s, ZP + dy * s + dz * c]; };
  const ext = [];
  for (const q of FOOT[0]) ext.push([q.u, q.v, 0]);
  for (const a of [0, rad(TILT)]) for (const q of BOX[0]) for (const z of [16, 76]) ext.push(R(q.u, q.v, z, a));
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, FOOT[0], FOOT[1], 0, 5));
  put(solid(g), prism(P, front, ARM(-7)[0], ARM(-7)[1], 5, ZP + 4));
  const bs = solid(g);
  const top = mk("path", { class: "nf lo" }, g);
  const gr = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, front, ARM(65)[0], ARM(65)[1], 5, ZP + 4));
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(TILT * t), Q = (x, y, z) => P(...R(x, y, z, a));
    bs.sil.setAttribute("d", poly(hull(BOX[0].map((q) => Q(q.u, q.v, 16)).concat(BOX[0].map((q) => Q(q.u, q.v, 76))))));
    top.setAttribute("d", poly(BOX[1].map((q) => Q(q.u, q.v, 76))));
    let d = "";
    for (let i = 0; i < 8; i++) d += seg(Q(9, 36, 24 + i * 6.5), Q(55, 36, 24 + i * 6.5));
    d += seg(Q(50, 30, 76), Q(56, 30, 76)) + seg(Q(53, 27, 76), Q(53, 33, 76));
    gr.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  // hit: the rest pose's screen box
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const q of FOOT[0]) for (const z of [0, 78]) { const [sx, sy] = P(q.u, q.v, z); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  const hit = ([sx, sy]) => (sx < x0 || sx > x1 || sy < y0 || sy > y1 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : Math.max(REST, amp), performance.now(), 0);
    bs.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "tilt " + Math.round(TILT * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "heater",
  means: "A fan heater hung between two arms on a foot: the pointer over it tilts the slatted body up on its pivot to aim the warm air.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[200, 86], [200, 180], [130, 215], null],
  mount,
});
