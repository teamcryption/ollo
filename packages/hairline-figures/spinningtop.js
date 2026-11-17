/**
 * Spinning top: a wooden top on its point, with a stem on top and a dashed
 * circle on the floor where it wanders. The pointer is where the top leans:
 * it tilts toward the pointer on a spring, further the further away it is.
 * At rest it leans a little, its stem bright.
 */
const { Cam, fit, proj, hull, poly, clamp, spring, stepS, unproj, disposer, mk, pointer, register } = HL;

const PROF = [[0, 0.6], [4, 7], [9, 14], [14, 18.5], [17, 18], [20, 13]], STEM = [20, 34, 2.6];
const REST = { t: 0.2, a: 3.6 };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.8);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([30 * Math.cos(a), 30 * Math.sin(a), 0], [16 * Math.cos(a), 16 * Math.sin(a), 36]); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const disc = (c, d, r, n = 36) => {
    const u = norm(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u);
    return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(...[0, 1, 2].map((j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]))); });
  };
  mk("path", { class: "dash nf", d: poly(Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * Math.PI * 2; return P(26 * Math.cos(t), 26 * Math.sin(t), 0); })) }, g);
  const body = mk("path", { class: "sil" }, g), band = mk("path", { class: "lo nf" }, g), face = mk("path", { class: "lo nf" }, g);
  const stem = mk("path", { class: "sil" }, g), cap = mk("path", { class: "lo nf" }, g);
  const tilt = spring(REST.t, { k: 100 * value, c: 18 * Math.sqrt(value) }), az = spring(REST.a, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let key = "", over = null;

  function draw() {
    const k = tilt.x.toFixed(4) + "," + az.x.toFixed(4);
    if (k === key) return;
    key = k;
    const d = [Math.sin(tilt.x) * Math.cos(az.x), Math.sin(tilt.x) * Math.sin(az.x), Math.cos(tilt.x)];
    const at = (s) => d.map((x) => x * s);
    body.setAttribute("d", poly(hull(PROF.flatMap(([s, r]) => disc(at(s), d, r)))));
    band.setAttribute("d", poly(disc(at(14), d, 18.5)));
    face.setAttribute("d", poly(disc(at(20), d, 13)));
    stem.setAttribute("d", poly(hull(disc(at(STEM[0]), d, STEM[2], 20).concat(disc(at(STEM[1]), d, STEM[2], 20)))));
    cap.setAttribute("d", poly(disc(at(STEM[1]), d, STEM[2], 20)));
  }

  const B = register(stage, (dt) => { const a = stepS(tilt, dt), b = stepS(az, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    let deg = 0;
    if (over) {
      const r = Math.hypot(over[0], over[1]);
      tilt.t = clamp(0.16 + r / 110, 0.16, 0.5);
      az.t = az.t + wrap(Math.atan2(over[1], over[0]) - az.t);
      deg = Math.round((tilt.t * 180) / Math.PI);
    } else { tilt.t = REST.t; az.t = az.t + wrap(REST.a - az.t); }
    body.classList.toggle("hi", !!over);
    stem.classList.toggle("hi", !over);
    read.textContent = over ? "lean " + deg + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 80 ? null : r < 3 ? [3, 0] : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { tilt.k = az.k = 100 * v; tilt.c = az.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "spinningtop",
  means: "A spinning top on its point: it tilts toward the pointer, leaning further the further away the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[205, 182], [200, 131], [200, 293], null],
  mount,
});
