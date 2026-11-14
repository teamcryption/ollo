/**
 * Smoothie: a blender on its motor base, a tapered jug with a fill line and
 * a handle, and a lid on top. The pointer picks a part by its height at
 * rest: over the lid, the lid lifts off; over the jug, the jug lifts off the
 * base carrying its lid. At rest the lid sits ajar, bright.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 16, JZ = 46, AJAR = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-2, -2, 0], [32, 32, 0], [32, -2, 0], [-2, 32, 0], [15, 15, BZ + 2 + JZ + 44]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 30, 30, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the dial on the base's top rim, in front of the jug's foot
  const dial = mk("path", { class: "nf lo" }, g);
  dial.setAttribute("d", poly(ringAt(P, rrect(23, 23, 28, 28, 2.5, 4), BZ)));

  const jugG = mk("g", {}, g), lidG = mk("g", {}, g);
  const foot = rrect(5, 5, 25, 25, 5, 6), top = rrect(1, 1, 29, 29, 7, 6), inner = rrect(2.6, 2.6, 27.4, 27.4, 5.4, 6);
  const fillR = rrect(3, 3, 27, 27, 6, 6);
  const jug = solid(jugG), level = mk("path", { class: "nf lo" }, jugG), handle = mk("path", { class: "nf" }, jugG);
  const lid = solid(lidG), knob = mk("path", { class: "nf" }, lidG);
  const [lr, li] = rings(0, 0, 30, 30, 8, 1.6);
  const kr = rrect(12, 12, 18, 18, 3, 4);

  const jz = tween(0), lz = tween(AJAR);
  let lastJ = NaN, lastL = NaN;
  function draw(j, l) {
    if (j === lastJ && l === lastL) return;
    lastJ = j; lastL = l;
    const z0 = BZ + 2 + j, z1 = z0 + JZ;
    jug.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    jug.cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    level.setAttribute("d", open(ringAt(P, run(fillR, front), z0 + JZ * 0.62)));
    handle.setAttribute("d", open([P(29, 15, z1 - 6), P(37, 15, z1 - 9), P(37, 15, z0 + 14), P(27, 15, z0 + 10)]));
    const lb = z1 + l;
    put(lid, prism(P, front, lr, li, lb, lb + 4));
    knob.setAttribute("d", poly(hull(ringAt(P, kr, lb + 4).concat(ringAt(P, kr, lb + 8)))));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(jz, now), tval(lz, now));
    return !(tdone(jz, now) && tdone(lz, now));
  });
  bag.add(B.unregister);

  const lidY = P(15, 15, BZ + 2 + JZ + 6)[1], jugY = P(15, 15, BZ + 2 + JZ * 0.45)[1], cx = P(15, 15, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - cx) > 70) return -1;
    if (sy < lidY + 18 && sy > lidY - 50) return 0;
    if (Math.abs(sy - jugY) < 52) return 1;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tset(jz, a === 1 ? 14 + lift * 0.3 : 0, now, 0);
    tset(lz, a === 0 ? 14 + lift : a === 1 ? 2 : AJAR, now, a === 1 ? 60 : 0);
    jug.sil.classList.toggle("hi", a === 1);
    lid.sil.classList.toggle("hi", a !== 1);
    read.textContent = a === 0 ? "lid" : a === 1 ? "jug" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; act = -2; setActive(-1); }, destroy: bag.dispose };
}

hairline({
  name: "smoothie",
  means: "A blender: over the lid it lifts off the jug; over the jug, the jug lifts off its motor base with the lid riding on it.",
  rules: [1, 5, 6, 8],
  range: [0, 10, 20],
  tour: [[200, 123], [200, 182], [200, 110], null],
  mount,
});
