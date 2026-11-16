/**
 * High seat: a booster seat with a backrest, two arms and a front safety bar hinged at the back of the arms. The pointer over it swings the bar up and back to let a child in.
 * At rest the moving part is held a little off its stop, bright. The slider
 * is how far it goes.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.12, MAX = 1.9;
const STAT = [[0,0,56,48,4,0,16],[0,0,56,10,3,16,58],[0,10,8,48,3,16,30],[48,10,56,48,3,16,30]];
const ring = (x0, y0, x1, y1, r, z) => rings(x0, y0, x1, y1, r, 1)[0].map((q) => [q.u, q.v, z]);
const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
const sw = (p, a) => { const dy = p[1] - 14, dz = p[2] - 31; return [p[0], 14 + dy * Math.cos(a) - dz * Math.sin(a), 31 + dy * Math.sin(a) + dz * Math.cos(a)]; };
const parts = (a) => [box(-2, 40, 30, 58, 54, 37), box(22, 44, 16, 34, 50, 30), box(-2, 14, 30, 6, 54, 34), box(50, 14, 30, 58, 54, 34)].map((b) => b.map((p) => sw(p, a)));

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
  const paths = parts(REST).map((_, k) => mk("path", { class: k < 2 ? "sil hi" : "sil" }, g));
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
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(ang, MAX * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "kidschair",
  means: "A booster seat with a hinged safety bar across its arms: the pointer over it swings the bar up and back, and leaving closes it.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[148, 183], [194, 190], [229, 240], null],
  mount,
});
