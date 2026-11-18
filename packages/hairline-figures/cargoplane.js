/**
 * Cargo plane: a stout high-wing freighter on short gear, a tall fin at the
 * tail and a nose that is one big door, hinged along its top. The pointer
 * over the plane swings the nose up and back, opening the hold's round
 * mouth. At rest the door stands just ajar, bright. The slider is how far
 * it swings.
 *
 * The pattern: one hinged part (pitch about a pin).
 */
const { Cam, fit, hull, poly, open, proj, rad, lerp, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const XH = 100, NL = 44, R = 13, ZC = 24, YAW = -28, REST = 10, HZ = ZC + R;
const tube = (x0, x1, f, n = 16, m = 16) => {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, [r, zc] = f(t), x = lerp(x0, x1, t); for (let j = 0; j < m; j++) { const a = (j / m) * Math.PI * 2; pts.push([x, r * Math.cos(a), zc + r * Math.sin(a)]); } }
  return pts;
};
const plate = (q, z, th = 1.4) => q.flatMap(([x, y]) => [[x, y, z], [x, y, z + th]]);
const fin = (q) => q.flatMap(([x, z]) => [[x, -1.2, z], [x, 1.2, z]]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  const yaw = (p) => { const a = rad(YAW), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const pitch = (p, d) => { const a = rad(d), c = Math.cos(a), s = Math.sin(a), dx = p[0] - XH, dz = p[2] - HZ; return [XH + dx * c - dz * s, p[1], HZ + dx * s + dz * c]; };
  const body = tube(0, XH, (t) => [R * Math.min(1, 0.3 + t * 2.2), ZC + R * 0.7 * Math.max(0, 1 - t * 2.5)]);
  const nose = tube(XH, XH + NL, (t) => [R * Math.sqrt(Math.max(0.02, 1 - Math.pow(t, 2.4))), ZC - t * 3]);
  const wingF = plate([[46, 0], [66, 0], [62, -78], [54, -78]], HZ - 3), wingN = plate([[46, 0], [66, 0], [62, 78], [54, 78]], HZ - 3);
  const tailF = plate([[0, 0], [16, 0], [8, -26], [2, -26]], ZC + R * 1.5), tailN = plate([[0, 0], [16, 0], [8, 26], [2, 26]], ZC + R * 1.5);
  const finV = fin([[0, ZC + R], [22, ZC + R], [8, ZC + R + 30], [1, ZC + R + 30]]);
  const gear = (x, y) => { const p = []; for (const dx of [-3, 3]) for (const dy of [-2, 2]) for (const z of [0, ZC - R + 2]) p.push([x + dx, y + dy, z]); return p; };
  const mouth = []; for (let j = 0; j <= 24; j++) { const a = (j / 24) * Math.PI * 2; mouth.push([XH, (R - 2) * Math.cos(a), ZC + (R - 2) * Math.sin(a)]); }
  const fp = [body, nose, wingF, wingN, tailF, tailN, finV, nose.map((q) => pitch(q, 100))].flat().map(yaw);
  fit(C, fp, 200, 170);
  const P = proj(C), Q = (q) => P(...yaw(q));
  const g = mk("g", {}, svg);
  const solid = (pts, cls) => mk("path", { d: poly(hull(pts.map(Q))), class: cls }, g);
  solid(wingF, ""); solid(tailF, ""); solid(gear(30, -5), ""); solid(gear(XH - 8, 0), "");
  mk("path", { d: poly(mouth.map(Q)), class: "lo" }, g);
  const doorG = mk("g", {}, g);
  solid(body, "sil");
  mk("path", { d: open(Array.from({ length: 11 }, (_, i) => Q([lerp(20, XH - 4, i / 10), -R * 0.35, ZC + R * 0.92]))), class: "nf lo" }, g);
  solid(finV, ""); solid(gear(30, 5), "");
  const door = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g);
  solid(wingN, ""); solid(tailN, "");
  g.insertBefore(door, doorG); g.insertBefore(seam, doorG);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const pts = nose.map((q) => Q(pitch(q, d)));
    door.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", poly(mouth.map((q) => Q(pitch([q[0] + 0.5, q[1], q[2]], d)))));
    const up = d > 30;
    if (up !== draw.up) { draw.up = up; if (up) { g.insertBefore(door, doorG); g.insertBefore(seam, doorG); } else { g.insertBefore(seam, wingN.el || g.lastChild.previousSibling); g.insertBefore(door, seam); } }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = body.concat(nose).map(Q), xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 10, Math.max(...xs) + 10, Math.min(...ys) - 30, Math.max(...ys) + 20];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? REST + max : REST, performance.now(), 0);
    read.textContent = a ? "door " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cargoplane",
  means: "A high-wing freighter whose whole nose is a door: the pointer over the plane swings the nose up to open the hold.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 100],
  tour: [[235, 227], [190, 200], [150, 180], null],
  mount,
});
