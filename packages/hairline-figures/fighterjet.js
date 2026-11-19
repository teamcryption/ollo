/**
 * Fighter jet: a slim fuselage on short gear, delta wings, one tall fin and a
 * long bubble canopy hinged at its rear. The pointer over the jet swings the
 * canopy up and open over the cockpit. At rest it sits just cracked, bright.
 * The slider is how far it opens.
 *
 * The pattern: one hinged part (pitch about a pin).
 */
const { Cam, fit, hull, poly, open, proj, rad, lerp, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const R = 9, ZC = 22, YAW = -30, REST = 6, XH = 78, HZ = ZC + R - 1, XN = 150;
const tube = (x0, x1, f, n = 16, m = 14) => {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, r = f(t), x = lerp(x0, x1, t); for (let j = 0; j < m; j++) { const a = (j / m) * Math.PI * 2; pts.push([x, r * Math.cos(a), ZC + r * Math.sin(a)]); } }
  return pts;
};
const plate = (q, z, th = 1.2) => q.flatMap(([x, y]) => [[x, y, z], [x, y, z + th]]);
const fin = (q) => q.flatMap(([x, z]) => [[x, -1, z], [x, 1, z]]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.8);
  const yaw = (p) => { const a = rad(YAW), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const pitch = (p, d) => { const a = rad(d), c = Math.cos(a), s = Math.sin(a), dx = p[0] - XH, dz = p[2] - HZ; return [XH + dx * c - dz * s, p[1], HZ + dx * s + dz * c]; };
  const body = tube(0, 118, (t) => R * Math.min(1, 0.75 + t * 1.5));
  const nose = tube(118, XN, (t) => R * Math.sqrt(Math.max(0.01, 1 - Math.pow(t, 1.8))));
  const canopy = []; for (let i = 0; i <= 12; i++) { const t = i / 12, h = Math.pow(Math.sin(Math.PI * t), 0.7); for (let j = 0; j <= 8; j++) { const a = (j / 8) * Math.PI; canopy.push([lerp(XH, XH + 60, t), 8.5 * h * Math.cos(a), HZ + 13.5 * h * Math.sin(a)]); } }
  const wingF = plate([[30, 0], [88, 0], [36, -60], [24, -60]], ZC - 2), wingN = plate([[30, 0], [88, 0], [36, 60], [24, 60]], ZC - 2);
  const tailF = plate([[0, 0], [20, 0], [4, -24], [-2, -24]], ZC), tailN = plate([[0, 0], [20, 0], [4, 24], [-2, 24]], ZC);
  const finV = fin([[2, ZC + R - 1], [34, ZC + R - 1], [12, ZC + R + 30], [3, ZC + R + 30]]);
  const gear = (x, y) => { const p = []; for (const dx of [-2.5, 2.5]) for (const dy of [-1.5, 1.5]) for (const z of [0, ZC - 4]) p.push([x + dx, y + dy, z]); return p; };
  const fp = [body, nose, wingF, wingN, tailF, tailN, finV, canopy.map((q) => pitch(q, 100))].flat().map(yaw);
  fit(C, fp, 200, 165);
  const P = proj(C), Q = (q) => P(...yaw(q));
  const g = mk("g", {}, svg);
  const solid = (pts, cls) => mk("path", { d: poly(hull(pts.map(Q))), class: cls }, g);
  solid(wingF, ""); solid(tailF, ""); solid(gear(48, -12), ""); solid(gear(128, 0), "");
  solid(body.concat(nose), "sil");
  const pit = []; for (let j = 0; j <= 20; j++) { const a = (j / 20) * Math.PI * 2; pit.push([XH + 26 + 22 * Math.cos(a), 5 * Math.sin(a), HZ + 0.6]); }
  mk("path", { d: poly(pit.map(Q)), class: "lo" }, g);
  mk("path", { d: open(Array.from({ length: 11 }, (_, i) => Q([lerp(6, XH - 4, i / 10), -R * 0.4, ZC + R * 0.9]))), class: "nf lo" }, g);
  solid(finV, ""); solid(gear(48, 12), "");
  solid(wingN, ""); solid(tailN, "");
  const cano = mk("path", { class: "sil hi" }, g), frame = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const T = (q) => Q(pitch(q, d));
    cano.setAttribute("d", poly(hull(canopy.map(T))));
    frame.setAttribute("d", open(Array.from({ length: 9 }, (_, j) => { const a = (j / 8) * Math.PI; return T([XH + 36, 8.2 * Math.cos(a) * 0.9, HZ + 12.8 * Math.sin(a) * 0.9]); })));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = body.concat(nose, wingN, wingF, finV).map(Q), xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 10, Math.max(...xs) + 10, Math.min(...ys) - 20, Math.max(...ys) + 20];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? REST + max : REST, performance.now(), 0);
    read.textContent = a ? "open " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "fighterjet",
  means: "A delta-wing fighter with a long bubble canopy: the pointer over the jet swings the canopy up open over the cockpit.",
  rules: [1, 3, 5, 6],
  range: [50, 78, 96],
  tour: [[212, 214], [180, 190], [240, 200], null],
  mount,
});
