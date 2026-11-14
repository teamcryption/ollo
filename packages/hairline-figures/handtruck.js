/**
 * Hand truck: an upright frame on two wheels, a nose plate at its foot and
 * three boxes stacked on it. The pointer tips the truck back on its axle:
 * the farther behind the truck, the deeper the lean, the boxes riding with
 * the frame. At rest it stands nearly upright, the top box bright. The
 * slider is the resting lean.
 *
 * The pattern: one continuous value from a fixed ground plane (spring).
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, rrect, circ, unproj, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const PY = -3, PZ = 6, AMAX = 50;
const BOXES = [[2, 1, 22, 15, 1.5, 17], [4, 2, 20, 14, 17, 30], [6, 3, 17, 12.5, 30, 38]];
const PARTS = [[0, -3, 2, -1, 4, 62], [22, -3, 24, -1, 4, 62], [-1, -4.5, 25, -0.5, 59, 63], [0, -1, 24, 16, 0, 1.6], ...BOXES];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-5, -50, 0], [29, 18, 0], [-5, -3, 66], [29, -50, 48]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const W = (x, y, z, a) => {
    const c = Math.cos(a), s = Math.sin(a), dy = y - PY, dz = z - PZ;
    return P(x, PY + dy * c - dz * s, PZ + dy * s + dz * c);
  };
  const wheel = (x) => {
    const sil = mk("path", { class: "sil" }, g), hub = mk("path", { class: "nf lo" }, g);
    const ring = circ(6, 18);
    sil.setAttribute("d", poly(hull(ring.map((q) => P(x - 1.5, PY + q.u, PZ + q.v)).concat(ring.map((q) => P(x + 1.5, PY + q.u, PZ + q.v))))));
    hub.setAttribute("d", poly(circ(2, 10).map((q) => P(x + 1.5, PY + q.u, PZ + q.v))));
  };
  wheel(-3.5);
  const parts = PARTS.map(([x0, y0, x1, y1, z0, z1], i) => {
    const pg = mk("g", {}, g);
    const r = Math.min(x1 - x0, y1 - y0) > 5 ? 1.6 : 0.7, b = Math.min(1.2, (Math.min(x1 - x0, y1 - y0)) / 2 - 0.2);
    return {
      ring: rrect(x0, y0, x1, y1, r, 3), inner: rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.2, r - b), 3), z0, z1,
      sil: mk("path", { class: "sil" }, pg), cr: mk("path", { class: "nf lo" }, pg), box: i >= 4,
    };
  });
  wheel(27.5);
  const handle = parts[2].sil, topBox = parts[parts.length - 1].sil;

  const ang = spring(restA);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    for (const p of parts) {
      const lo = p.ring.map((q) => W(q.u, q.v, p.z0, a)), hi = p.ring.map((q) => W(q.u, q.v, p.z1, a));
      p.sil.setAttribute("d", poly(hull(lo.concat(hi))));
      p.cr.setAttribute("d", poly(p.inner.map((q) => W(q.u, q.v, p.z1, a))));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function mark(o) { on = o; handle.classList.toggle("hi", o); topBox.classList.toggle("hi", !o); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -16 || x > 40 || y < -60 || y > 26) return leave();
    const deg = clamp((18 - y) * 0.7, 0, AMAX);
    ang.t = deg;
    if (!on) mark(true);
    read.textContent = Math.round(deg) + "°";
    B.wake();
  }
  function leave() {
    ang.t = restA;
    if (on) mark(false);
    read.textContent = "rest";
    B.wake();
  }
  mark(false);
  draw(restA);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (!on) { ang.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "handtruck",
  means: "A hand truck stacked with boxes: it tips back on its axle as the pointer moves behind it, the boxes riding along.",
  rules: [1, 3, 5, 8],
  range: [0, 6, 12],
  tour: [[255, 193], [185, 228], [115, 263], null],
  mount,
});
