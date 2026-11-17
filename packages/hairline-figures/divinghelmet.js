/**
 * Diving helmet: a round copper helmet with a front porthole, seated on a
 * broad corselet. The pointer over the figure tilts the helmet back on its
 * rear hinge to open it. At rest the front porthole is bright. The slider is
 * how far it tilts.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const A = (20 * Math.PI) / 180, D = [Math.cos(A), Math.sin(A), 0], U = [-Math.sin(A), Math.cos(A), 0], W = [0, 0, 1];
const R = 24, CZ = 44, HX = [-R * 0.95 * D[0], -R * 0.95 * D[1], 26];
const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
function ring(c, u, w, r, n = 28) { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(add(add(c, u, r * Math.cos(t)), w, r * Math.sin(t))); } return o; }
function tilt(p, th) { // rotate about the hinge axis U through HX
  const q = add(p, HX, -1), c = Math.cos(th), s = Math.sin(th);
  const kd = q[0] * U[0] + q[1] * U[1], kx = [U[1] * q[2], -U[0] * q[2], U[0] * q[1] - U[1] * q[0]];
  return add(HX, [q[0] * c + kx[0] * s + U[0] * kd * (1 - c), q[1] * c + kx[1] * s + U[1] * kd * (1 - c), q[2] * c + kx[2] * s]);
}
const sphere = () => { const o = []; for (let i = -3; i <= 4; i++) { const f = (i / 4) * (Math.PI / 2) * 0.92; o.push(...ring([0, 0, CZ + R * Math.sin(f)], [1, 0, 0], [0, 1, 0], R * Math.cos(f), 24)); } return o; };
const neck = () => [...ring([0, 0, 24], [1, 0, 0], [0, 1, 0], 17), ...ring([0, 0, 30], [1, 0, 0], [0, 1, 0], 17)];
const SIDE = [Math.cos(A + 1.3), Math.sin(A + 1.3), 0], SU = [-SIDE[1], SIDE[0], 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const shoulders = [...ring([0, 0, 2], [1, 0, 0], [0, 1, 0], 34, 32), ...ring([0, 0, 22], [1, 0, 0], [0, 1, 0], 19, 32)];
  const th1 = (-45 * Math.PI) / 180;
  fit(C, [...shoulders, ...sphere(), ...sphere().map((p) => tilt(p, th1))], 200, 165);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(pp(shoulders))) }, g);
  mk("path", { class: "nf lo", d: poly(pp(ring([0, 0, 22], [1, 0, 0], [0, 1, 0], 19, 32))) }, g);
  for (const k of [0, 1, 2, 3]) { const a = A + Math.PI / 4 + (k * Math.PI) / 2, c = [27 * Math.cos(a), 27 * Math.sin(a), 8.5]; if (Math.cos(a) + Math.sin(a) > -0.3) mk("path", { class: "dot off", d: poly(pp(ring(c, [1, 0, 0], [0, 1, 0], 1.6, 10))) }, g); }
  mk("path", { class: "sil", d: poly(hull(pp([...ring(add(HX, U, -6), U, W, 3.5, 12), ...ring(add(HX, U, 6), U, W, 3.5, 12), add(HX, [0, 0, 1], -6)]))) }, g);
  const nk = mk("path", { class: "sil" }, g), hel = mk("path", { class: "sil" }, g), side = mk("path", { class: "nf lo" }, g);
  const rim = mk("path", { class: "nf" }, g), glass = mk("path", { class: "nf hi" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = (-t * amt * Math.PI) / 180, T = (pts) => pp(pts.map((p) => tilt(p, th)));
    nk.setAttribute("d", poly(hull(T(neck()))));
    hel.setAttribute("d", poly(hull(T(sphere()))));
    side.setAttribute("d", poly(T(ring(add([0, 0, CZ], SIDE, R - 1.5), SU, W, 6.5))));
    rim.setAttribute("d", poly(hull(T([...ring(add([0, 0, CZ], D, R - 3), U, W, 11.5), ...ring(add([0, 0, CZ], D, R + 1), U, W, 11.5)]))));
    glass.setAttribute("d", poly(T(ring(add([0, 0, CZ], D, R + 1.2), U, W, 8.5))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...shoulders, ...sphere()]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "divinghelmet",
  means: "A diving helmet on its corselet: the pointer tilts the helmet back on its hinge, the front porthole bright.",
  rules: [1, 3, 5, 6],
  range: [20, 35, 45],
  tour: [[200, 99], [175, 120], [225, 135], null],
  mount,
});
