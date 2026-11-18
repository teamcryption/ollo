/**
 * Business jet: a slim cabin on short gear, swept wings, two pods at the tail
 * under a T-tail, and a tall airstair door forward on the near side, hinged
 * at its sill. The pointer over the jet folds the door out and down into a
 * stair. At rest it stands just ajar, bright. The slider is how far it folds.
 *
 * The pattern: one hinged part (roll about a sill pin).
 */
const { Cam, fit, hull, poly, open, seg, proj, rad, lerp, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const R = 11, ZC = 26, YAW = -36, REST = 8, X0 = 102, X1 = 133, HZ = ZC - 12, HY = R - 1, DH = 25;
const tube = (x0, x1, f, n = 16, m = 16) => {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, [r, zc] = f(t), x = lerp(x0, x1, t); for (let j = 0; j < m; j++) { const a = (j / m) * Math.PI * 2; pts.push([x, r * Math.cos(a), zc + r * Math.sin(a)]); } }
  return pts;
};
const plate = (q, z, th = 1.3) => q.flatMap(([x, y]) => [[x, y, z], [x, y, z + th]]);
const fin = (q) => q.flatMap(([x, z]) => [[x, -1, z], [x, 1, z]]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.85);
  const yaw = (p) => { const a = rad(YAW), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const fold = (p, d) => { const a = rad(d), c = Math.cos(a), s = Math.sin(a), dy = p[1] - HY, dz = p[2] - HZ; return [p[0], HY + dy * c + dz * s, HZ - dy * s + dz * c]; };
  const body = tube(10, 130, (t) => [R * Math.min(1, 0.45 + t * 2), ZC + 3 * Math.max(0, 1 - t * 3)]);
  const nose = tube(130, 156, (t) => [R * Math.sqrt(Math.max(0.02, 1 - Math.pow(t, 2))), ZC - t * 3]);
  const wingF = plate([[52, 0], [80, 0], [48, -58], [40, -58]], ZC - 7), wingN = plate([[52, 0], [80, 0], [48, 58], [40, 58]], ZC - 7);
  const pod = (sg) => tube(26, 50, () => [4.5, 0]).map(([x, y, z]) => [x, y + sg * 15, z - ZC + ZC + 6]);
  const finV = fin([[6, ZC + 6], [30, ZC + 6], [12, ZC + 34], [4, ZC + 34]]);
  const tailT = plate([[2, -22], [14, -22], [18, 22], [6, 22]].map(([x, y]) => [x + 2 * Math.abs(y) / 22, y]), ZC + 34);
  const gear = (x, y) => { const p = []; for (const dx of [-2, 2]) for (const dy of [-1.5, 1.5]) for (const z of [0, ZC - R + 2]) p.push([x + dx, y + dy, z]); return p; };
  const door = []; for (const x of [X0, X1]) for (const h of [0, DH]) for (const t of [0, 1.4]) door.push([x, HY + t, HZ + h]);
  const fp = [body, nose, wingF, wingN, finV, tailT, door.map((q) => fold(q, 125)), [[0, 0, 0]]].flat().map(yaw);
  fit(C, fp, 200, 168);
  const P = proj(C), Q = (q) => P(...yaw(q));
  const g = mk("g", {}, svg);
  const solid = (pts, cls) => mk("path", { d: poly(hull(pts.map(Q))), class: cls }, g);
  solid(wingF, "");
  solid(body.concat(nose), "sil");
  mk("path", { d: poly([[X0, HY + 0.2, HZ], [X1, HY + 0.2, HZ], [X1, HY + 0.2, HZ + DH], [X0, HY + 0.2, HZ + DH]].map(Q)), class: "lo" }, g);
  solid(finV, ""); solid(tailT, ""); solid(pod(1), ""); solid(gear(64, 6), ""); solid(gear(140, 0), "");
  solid(wingN, "");
  const dr = mk("path", { class: "sil hi" }, g), steps = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const T = (q) => Q(fold(q, d));
    dr.setAttribute("d", poly(hull(door.map(T))));
    let s = ""; for (let i = 1; i < 8; i++) { const h = (DH * i) / 8; s += seg(T([X0 + 1.5, HY + 1.4, HZ + h]), T([X1 - 1.5, HY + 1.4, HZ + h])); }
    s += seg(T([X0, HY + 1.4, HZ + DH]), T([X0, HY + 6, HZ + DH + 6])) + seg(T([X1, HY + 1.4, HZ + DH]), T([X1, HY + 6, HZ + DH + 6]));
    steps.setAttribute("d", d > 40 ? s : "");
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = body.concat(nose, wingN, wingF, finV).map(Q), xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 10, Math.max(...xs) + 10, Math.min(...ys) - 20, Math.max(...ys) + 30];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? REST + max : REST, performance.now(), 0);
    read.textContent = a ? "stair " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "privatejet",
  means: "A business jet with a tall airstair door: the pointer over the jet folds the door out and down into a stair.",
  rules: [1, 3, 5, 6],
  range: [60, 108, 120],
  tour: [[199, 224], [170, 200], [230, 190], null],
  mount,
});
