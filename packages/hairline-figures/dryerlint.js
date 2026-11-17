/**
 * Lint filter: a tumble dryer with its lint screen in a slot on top. The pointer over the dryer pulls the screen up out of the slot; at rest it sits a little proud, bright.
 *
 * The pattern: one part sliding out of a body (lift).
 */
const { Cam, circ, fit, facing, prism, proj, rings, seg, poly, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TOP = 62, LIFT = 52, REST = 0.14;
const BODY = rings(0, 0, 60, 56, 6, 1.6);
const SLOT = rings(10, 14, 50, 22, 2, 1);
const FIL = rings(12, 16, 48, 20, 1.5, 0.8);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.15);
  const ext = [];
  for (const q of BODY[0]) ext.push([q.u, q.v, 0], [q.u, q.v, TOP]);
  for (const q of FIL[0]) ext.push([q.u, q.v, TOP + 6 + LIFT]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, BODY[0], BODY[1], 0, TOP));
  // door on the front face (y = 56), and the slot on top
  const door = (R) => poly(circ(R, 40).map((q) => P(30 + q.u, 56, 30 + q.v)));
  mk("path", { class: "nf lo", d: door(19) }, g);
  mk("path", { class: "nf lo", d: door(15) }, g);
  mk("path", { class: "nf lo", d: poly(SLOT[0].map((q) => P(q.u, q.v, TOP))) }, g);
  const fs = solid(g);
  const mesh = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z1 = TOP + 6 + LIFT * t;
    put(fs, prism(P, front, FIL[0], FIL[1], TOP, z1));
    let d = "";
    for (let i = 0; i <= 8; i++) { const x = 15 + i * 3.75; d += seg(P(x, 20, TOP + 1), P(x, 20, z1 - 6)); }
    d += seg(P(15, 20, z1 - 6), P(45, 20, z1 - 6));
    d += seg(P(24, 20, z1 - 3), P(36, 20, z1 - 3));
    mesh.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  // hit: the rest pose's screen box
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of ext.slice(0, BODY[0].length * 2)) { const [sx, sy] = P(...p); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  x0 -= 6; x1 += 6; y0 -= 20; y1 += 6;
  const hit = ([sx, sy]) => (sx < x0 || sx > x1 || sy < y0 || sy > y1 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : Math.max(REST, amp), performance.now(), 0);
    fs.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "lint " + Math.round(LIFT * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "dryerlint",
  means: "A tumble dryer whose lint screen pulls up out of the slot on its top when the pointer comes over the machine.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[215, 136], [190, 215], [150, 190], null],
  mount,
});
