/**
 * Bike light: a front lamp on a strap clip round a length of handlebar. The
 * lamp swivels on its clip to aim where the pointer is, following on a
 * spring. At rest it points ahead and a little down, its lens bright.
 * The slider is how quickly it follows.
 *
 * The pattern: a continuous aim on a spring, hit on the ground plane.
 */
const {
  Cam, clamp, fit, hull, poly, proj, unproj, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const BR = 4.5, BL = 60, CZ = 14, LEN = 34, RB = 7, RF = 10;
const REST = [0.5, 0.15];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, -BL, -BR], [0, BL, BR], [30, -24, CZ + 20], [-30, 24, CZ + 20], [30, 24, CZ - 14], [-24, -24, CZ - 10]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const frame = (a, b) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), e = d.map((x) => x / L);
    let u = Math.abs(e[2]) < 0.9 ? [e[1], -e[0], 0] : [1, 0, 0];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const w = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
    return (o, r, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(...[0, 1, 2].map((j) => o[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j]))); });
  };
  const tube = (a, b, r, n) => { const f = frame(a, b); return poly(hull(f(a, r, n).concat(f(b, r, n)))); };
  mk("path", { class: "sil", d: tube([0, -BL, 0], [0, BL, 0], BR, 28) }, g);
  mk("path", { class: "sil", d: tube([0, -5, 0], [0, 5, 0], BR + 2, 28) }, g);
  mk("path", { class: "sil", d: tube([0, 0, 3], [0, 0, CZ - 3], 3.2) }, g);
  const knuckle = mk("path", { class: "sil", d: tube([0, -4, CZ], [0, 4, CZ], 4) }, g);
  const body = mk("path", { class: "sil" }, g), bezel = mk("path", { class: "nf lo" }, g), lens = mk("path", { class: "nf" }, g);
  const yaw = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), pit = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "";

  function draw() {
    const key = yaw.x.toFixed(3) + pit.x.toFixed(3);
    if (key === last) return;
    last = key;
    const d = [Math.cos(yaw.x) * Math.cos(pit.x), Math.sin(yaw.x) * Math.cos(pit.x), -Math.sin(pit.x)];
    const c = [0, 0, CZ + RF - 2], a = c.map((v, j) => v - d[j] * LEN * 0.35), b = c.map((v, j) => v + d[j] * LEN * 0.65);
    const f = frame(a, b), back = f(a, RB), fr = f(b, RF), bz = f(b.map((v, j) => v - d[j] * 4), RF);
    body.setAttribute("d", poly(hull(back.concat(fr))));
    bezel.setAttribute("d", poly(bz));
    lens.setAttribute("d", d[0] + d[1] > -0.2 ? poly(f(b, RF - 2.5)) : "");
    if (d[0] + d[1] < 0) g.insertBefore(body, knuckle); else knuckle.after(body);
  }
  // keep the lens and bezel above the body in either order
  const B = register(stage, (dt) => { const m1 = stepS(yaw, dt), m2 = stepS(pit, dt); draw(); body.after(bezel, lens); return m1 || m2; });
  bag.add(B.unregister);

  function aim(p) {
    let over = false, x = 0, y = 0;
    if (p) { [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) < 90; }
    if (over) {
      yaw.t = Math.atan2(y, x);
      pit.t = clamp(0.6 - Math.hypot(x, y) / 90, -0.5, 0.6);
      read.textContent = `${Math.round(((yaw.t * 180) / Math.PI + 360) % 360)}°`;
    } else { yaw.t = REST[0]; pit.t = REST[1]; read.textContent = "rest"; }
    lens.classList.toggle("hi", !over);
    body.classList.toggle("hi", over);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { yaw.k = pit.k = 100 * v; yaw.c = pit.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "bikelight",
  means: "A front bike light clipped to a handlebar: it swivels on its clip to aim where the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[60, 182], [340, 182], [200, 240], null],
  mount,
});
