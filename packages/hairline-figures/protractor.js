/**
 * Geometry set: a half-round protractor lying flat, ticked along its rim, and
 * a drawing compass standing with its needle in the protractor's centre. The
 * pointer is where the pencil should land: the compass swings round to that
 * angle and opens its legs to that radius, the pencil leg bright. At rest the
 * compass stands half open across the plate with the protractor's rim bright.
 * The slider is how far the legs may open.
 *
 * The pattern: a continuous aim (two springs, angle and spread); the hit is on
 * the plate's top plane, which never moves.
 */
const {
  Cam, fit, hull, open, poly, proj, unproj, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 52, TH = 2, L = 44, A0 = -0.55, D0 = 32;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
  const ext = [];
  for (let k = 0; k <= 12; k++) { const q = -Math.PI + (k / 12) * Math.PI; ext.push([R * Math.cos(q), R * Math.sin(q), 0]); }
  ext.push([-R, 4, 0], [R, 4, 0], [0, -10, L + 10], [-20, 0, L + 10], [20, -20, L + 10]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const tube = (a, b, r) => {
    const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
    const u = unit(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u), pts = [];
    for (let k = 0; k < 14; k++) {
      const q = (k / 14) * Math.PI * 2, o = add(mul(u, r * Math.cos(q)), mul(v, r * Math.sin(q)));
      pts.push(P(...add(a, o)), P(...add(b, o)));
    }
    return { sil: poly(hull(pts)), crease: "" };
  };

  // the protractor: a half disc with a straight edge along y = 3, ticks along its rim
  const plate = solid(g), pts = [], arc = [];
  for (let k = 0; k <= 48; k++) {
    const q = -Math.PI + (k / 48) * Math.PI, c = Math.cos(q), s = Math.sin(q);
    pts.push(P(R * c, 3 + R * s, 0), P(R * c, 3 + R * s, TH));
    arc.push(P((R - 14) * c, 3 + (R - 14) * s, TH));
  }
  let cr = open(arc);
  for (let k = 1; k < 12; k++) {
    const q = -Math.PI + (k / 12) * Math.PI, c = Math.cos(q), s = Math.sin(q), t = k % 3 === 0 ? 9 : 4.5;
    cr += open([P((R - 2) * c, 3 + (R - 2) * s, TH), P((R - 2 - t) * c, 3 + (R - 2 - t) * s, TH)]);
  }
  cr += open([P(-R + 2, 1.4, TH), P(R - 2, 1.4, TH)]);
  put(plate, { sil: poly(hull(pts)), crease: cr });

  const far = solid(g), near = solid(g), head = solid(g), grip = solid(g);
  const legs = { far, near };
  let drawn = "";
  function draw(a, d) {
    const key = a.toFixed(4) + d.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    const pin = [0, 0, TH], pen = [d * Math.cos(a), d * Math.sin(a), TH];
    const h = Math.sqrt(L * L - (d / 2) * (d / 2));
    const top = [pen[0] / 2, pen[1] / 2, TH + h];
    const mid = (f) => add(f, mul(unit([top[0] - f[0], top[1] - f[1], top[2] - f[2]]), 9));
    const needle = { sil: tube(top, mid(pin), 1.9).sil + tube(mid(pin), pin, 0.7).sil, crease: "" };
    const pencil = { sil: tube(top, mid(pen), 1.9).sil + tube(mid(pen), pen, 1.3).sil, crease: "" };
    // the leg whose foot is nearer the viewer is painted last
    const penNear = pen[0] + pen[1] > 0;
    put(legs.far, penNear ? needle : pencil);
    put(legs.near, penNear ? pencil : needle);
    legs.penSolid = penNear ? legs.near : legs.far;
    put(head, tube(add(top, [0, 0, -2]), add(top, [0, 0, 3]), 3.4));
    put(grip, tube(add(top, [0, 0, 3]), add(top, [0, 0, 10]), 1.3));
  }

  const sa = spring(A0), sd = spring(D0);
  let lim = value, over = null;
  function paint() {
    plate.sil.classList.toggle("hi", over === null);
    far.sil.classList.toggle("hi", over !== null && legs.penSolid === far);
    near.sil.classList.toggle("hi", over !== null && legs.penSolid === near);
  }
  const B = register(stage, (dt) => {
    const m1 = stepS(sa, dt), m2 = stepS(sd, dt);
    draw(sa.x, sd.x); paint();
    return m1 || m2;
  });
  bag.add(B.unregister);

  function retarget() {
    if (over) {
      sa.t = clamp(Math.atan2(over[1], over[0]), -Math.PI + 0.12, -0.12);
      sd.t = clamp(Math.hypot(over[0], over[1]), 12, 30 + 18 * lim);
    } else { sa.t = A0; sd.t = D0; }
    read.textContent = over ? Math.round((-sa.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TH);
      over = Math.hypot(x, y) > R + 20 || y > 16 ? null : [x, Math.min(y, -2)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(A0, D0); paint();
  retarget();
  return { set: (v) => { lim = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "protractor",
  means: "A compass on a protractor: it swings to the pointer's angle and opens to its radius, the pencil leg bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[155, 145], [265, 157], [298, 236], null],
  mount,
});
