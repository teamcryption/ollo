/**
 * Flight joystick: a low base with a rubber boot, a stick and a tall grip
 * with a hat button. The grip leans toward the pointer, read on the ground
 * plane, clamped to the slider's throw. At rest it leans a little and the
 * hat is bright.
 */
const { Cam, fit, proj, facing, rings, prism, put, solid, mk, poly, hull, circ, ringAt, unproj, tween, tset, tval, tdone, register, pointer, disposer } = HL;

const rotY = (p, a) => [p[0] * Math.cos(a) + (p[2]) * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
const rotX = (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
const PZ = 12;
const cyl = (x, y, r, z0, z1, n = 18) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; for (const z of [z0, z1]) o.push([x + r * Math.cos(t), y + r * Math.sin(t), z]); } return o; };
const ring3 = (x, y, r, z, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(t), y + r * Math.sin(t), z]); } return o; };
const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let throwMax = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-26, -26, 0], [26, 26, 0], [-26, 26, 0], [26, -26, 0], [0, 0, 100], [-40, -40, 80], [40, 40, 80], [40, -40, 80], [-40, 40, 80]], 200, 160);
  const P = proj(C), front = facing(C), Pp = (q) => P(q[0], q[1], q[2]);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-24, -24, 24, 24, 8, 3);
  put(solid(g), prism(P, front, br, bi, 0, PZ));
  mk("path", { d: poly(ringAt(P, circ(11, 32).map((q) => ({ ...q })), PZ)), class: "nf lo" }, g);
  const boot = mk("path", { class: "sil" }, g), stick = mk("path", { class: "sil" }, g);
  const grip = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf" }, g), hat = mk("path", { class: "sil" }, g), trig = mk("path", { class: "sil" }, g);
  const tx = tween(0.22), ty = tween(-0.12);
  let last = "";
  function T(p, ax, ay) { return rotX(rotY([p[0], p[1], p[2] - PZ], ax), -ay).map((v, i) => (i === 2 ? v + PZ : v)); }
  function draw(ax, ay) {
    const k = ax.toFixed(4) + ay.toFixed(4);
    if (k === last) return; last = k;
    const H = (pts) => poly(hull(pts.map((p) => Pp(T(p, ax, ay)))));
    boot.setAttribute("d", H(cyl(0, 0, 9, PZ, PZ + 2).concat(cyl(0, 0, 5, PZ + 8, PZ + 9))));
    stick.setAttribute("d", H(cyl(0, 0, 3, PZ, 46)));
    grip.setAttribute("d", H(cyl(0, 2, 8, 44, 80).concat(cyl(0, 4, 9, 70, 84))));
    cap.setAttribute("d", poly(ring3(0, 4, 9, 84).map((p) => Pp(T(p, ax, ay)))));
    hat.setAttribute("d", H(cyl(0, 6, 3.2, 84, 89, 12)));
    trig.setAttribute("d", H(bx(-3, -9, 62, 3, -5, 72)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tx, now), tval(ty, now)); return !(tdone(tx, now) && tdone(ty, now)); });
  bag.add(B.unregister);
  function aim(p) {
    const now = performance.now();
    if (!p) {
      tset(tx, 0.22, now, 0); tset(ty, -0.12, now, 0);
      hat.classList.add("hi"); grip.classList.remove("hi"); read.textContent = "rest";
    } else {
      const [wx, wy] = unproj(C, p[0], p[1], PZ), d = Math.hypot(wx, wy) || 1, a = Math.min(throwMax, d / 120);
      tset(tx, (wx / d) * a, now, 0); tset(ty, (wy / d) * a, now, 0);
      hat.classList.remove("hi"); grip.classList.add("hi");
      read.textContent = Math.round((a * 180) / Math.PI) + "°";
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { throwMax = v; }, destroy: bag.dispose };
}

hairline({
  name: "vrcontroller",
  means: "A flight joystick on a low base: the grip leans toward the pointer, as far as the slider's throw allows.",
  rules: [1, 3, 4, 5],
  range: [0.2, 0.45, 0.7],
  tour: [[120, 200], [300, 120], [250, 260], null],
  mount,
});
