/**
 * Pocket monitor: a thin portable screen on a low stand bar. The pointer tilts the screen back on its hinge; at rest it leans slightly, bright. The slider is how far it tilts.
 *
 * The pattern: one part answering the pointer (tilt).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BEFORE = [[0,-4,0,80,14,5]];
const PARTS = [[2,3,5,78,7,52]];
const AFTER = [];
const REST = 0.15;

function T(k, [x, y, z]) {
  const a = -1.05 * k, y0 = 5, z0 = 5, dy = y - y0, dz = z - z0;
  return [x, y0 + dy * Math.cos(a) - dz * Math.sin(a), z0 + dy * Math.sin(a) + dz * Math.cos(a)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (const b of BEFORE.concat(AFTER)) ext.push([b[0], b[1], b[2]], [b[3], b[4], b[5]], [b[0], b[4], b[5]], [b[3], b[1], b[5]]);
  for (const k of [0, 1]) for (const b of PARTS) for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) ext.push(T(k, [x, y, z]));
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (b) => { const [r, i] = rings(b[0], b[1], b[3], b[4], 1.5, 1.2); put(solid(g), prism(P, front, r, i, b[2], b[5])); };
  BEFORE.forEach(slab);
  const mv = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, mv), ln = mk("path", { class: "nf" }, mv);
  AFTER.forEach(slab);
  const t = tween(REST);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    let ds = "", ls = "";
    for (const b of PARTS) {
      const c = [];
      for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) c.push(P(...T(k, [x, y, z])));
      ds += poly(hull(c));
      ls += poly([c[1], c[3], c[7], c[5]]) + poly([c[0], c[2], c[6], c[4]]);
    }
    sil.setAttribute("d", ds);
    ln.setAttribute("d", ls);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 0.35 + 0.65 * amt : REST, performance.now(), 0);
    read.textContent = a ? "tilt" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "minimonitor",
  means: "A portable monitor on its stand: the thin screen tilts back on the hinge when the pointer comes near.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[228, 127], [171, 172], [285, 262], null],
  mount,
});
