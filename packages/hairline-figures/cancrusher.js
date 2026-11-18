/**
 * Can crusher: a wall plate with a base shelf, a can standing on it, a press
 * plate above and a long lever hinged at the top of the wall plate. At rest
 * the lever stands raised, bright; the pointer on the figure swings it down,
 * driving the press plate onto the can, which squashes. The slider is the swing.
 */
const { Cam, fit, hull, poly, proj, tween, tset, tval, tdone, disposer, mk, pointer, register, rad } = HL;

const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const ring = (x, y, z, r, n = 28) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return [x + Math.cos(a) * r, y + Math.sin(a) * r, z];
});
const cyl = (x, y, r, z0, z1) => ring(x, y, z0, r).concat(ring(x, y, z1, r));
const rot = (p, o, a) => {
  const c = Math.cos(a), s = Math.sin(a), di = p[0] - o[0], dj = p[2] - o[2];
  return [o[0] + di * c - dj * s, p[1], o[2] + di * s + dj * c];
};

const S = 2.55, HP = [6, 15, 62], D = 24;
const ang = (t, a) => rad(50 - 62 * Math.min(1, t * a));
const pinAt = (t, a) => rot([HP[0] + D, 15, HP[2]], HP, ang(t, a));
const plateZ = (t, a) => pinAt(t, a)[2] - 46;
const LEVER = box(HP[0] - 4, 11, HP[2] - 3, HP[0] + 74, 19, HP[2] + 3);
const GRIP = box(HP[0] + 62, 9, HP[2] - 5, HP[0] + 80, 21, HP[2] + 5);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  const all = [...box(0, 2, 0, 6, 28, 70), ...box(6, 4, 0, 30, 26, 4)];
  for (const t of [0, 1]) for (const p of LEVER.concat(GRIP)) all.push(rot(p, HP, ang(t, 1.3)));
  fit(C, all, 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shape = (pts, cls) => { const el = mk("path", { class: cls || "sil" }, g); if (pts) el.setAttribute("d", poly(hull(pts.map((p) => P(...p))))); return el; };
  shape(box(0, 2, 0, 6, 28, 70));
  shape(box(-1, 13, 58, 7, 17, 66), "nf lo");
  shape(box(6, 4, 0, 30, 26, 4));
  const can = shape(null), rim = mk("path", { class: "nf lo" }, g);
  const link = shape(null), plate = shape(null), lever = shape(null, "sil hi"), grip = shape(null, "sil hi");
  const flat = (pts) => poly(pts.map((p) => P(...p)));
  const hb0 = all.map((p) => P(...p));
  const xs = hb0.map((p) => p[0]), ys = hb0.map((p) => p[1]);
  const hb = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = ang(t, amp), pz = plateZ(t, amp), top = pz - 0.2, pin = pinAt(t, amp);
    const r = 8 + (30 - (top - 4)) * 0.08;
    can.setAttribute("d", poly(hull(cyl(18, 15, r, 4, top).map((p) => P(...p)))));
    rim.setAttribute("d", flat(ring(18, 15, top, r - 2)));
    plate.setAttribute("d", poly(hull(box(7, 5, pz, 29, 25, pz + 3).map((p) => P(...p)))));
    link.setAttribute("d", poly(hull(box(16, 13, pz + 3, 20, 17, pz + 4).concat(box(pin[0] - 2, 13, pin[2] - 1, pin[0] + 2, 17, pin[2])).map((p) => P(...p)))));
    lever.setAttribute("d", poly(hull(LEVER.map((p) => P(...rot(p, HP, a))))));
    grip.setAttribute("d", poly(hull(GRIP.map((p) => P(...rot(p, HP, a))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "crush" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => set(x > hb[0] && x < hb[2] && y > hb[1] && y < hb[3]),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "cancrusher",
  means: "A wall can crusher: the long lever swings down from its hinge and drives the press plate onto the can, squashing it.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5, 1, 1.3],
  tour: [[202, 99], [140, 130], [274, 197], null],
  mount,
});
