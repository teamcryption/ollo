/**
 * Pop-up toy: a box with three buttons on its front and a hinged lid. The pointer over it springs the lid open and the head inside rises out.
 * At rest the moving part is held a little off its stop, bright. The slider
 * is how far it goes.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.1, MAX = 1.8;
const STAT = [[-3,-3,63,43,3,0,3],[0,0,60,40,3,3,30],[10,40,20,44,2,8,16],[25,40,35,44,2,8,16],[40,40,50,44,2,8,16]];
const ring = (x0, y0, x1, y1, r, z) => rings(x0, y0, x1, y1, r, 1)[0].map((q) => [q.u, q.v, z]);
const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
const hinge = (p, a) => { const dz = p[2] - 30; return [p[0], p[1] * Math.cos(a) - dz * Math.sin(a), 30 + p[1] * Math.sin(a) + dz * Math.cos(a)]; };
const parts = (a) => { const up = 26 * Math.min(1, a / 1.2); return [box(20, 10, 10 + up, 40, 30, 28 + up), box(24, 14, 28 + up, 36, 26, 32 + up), box(0, 0, 30, 60, 40, 35).map((p) => hinge(p, a))]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const all = [];
  for (const s of STAT) all.push(...ring(s[0], s[1], s[2], s[3], s[4], s[5]), ...ring(s[0], s[1], s[2], s[3], s[4], s[6]));
  for (const a of [REST, MAX, MAX / 2]) for (const part of parts(a)) all.push(...part);
  fit(C, all, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const s of STAT) { const [r, i] = rings(s[0], s[1], s[2], s[3], s[4], 2); put(solid(g), prism(P, front, r, i, s[5], s[6])); }
  const paths = parts(REST).map((_, k) => mk("path", { class: k === 2 ? "sil hi" : "sil" }, g));
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    parts(a).forEach((pts, k) => paths[k].setAttribute("d", poly(hull(pts.map((p) => P(...p))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const rest = all.map((p) => P(...p)), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const inside = ([sx, sy]) => sx > x0 && sx < x1 && sy > y0 && sy < y1;
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? MAX * amt : REST, performance.now(), 0);
    read.textContent = on ? "pop" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(ang, MAX * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "peekaboo",
  means: "A pop-up toy with three buttons and a hinged lid: the pointer over it springs the lid open and the head inside rises out.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[156, 180], [174, 194], [209, 240], null],
  mount,
});
