/**
 * Odometerwheel: a surveyor's measuring wheel, a spoked wheel on a long
 * handle with a counter, standing on a marked line. The pointer pulls it
 * along the line: it rolls there on a spring, its spokes turning by the
 * distance covered, and the counter reads it. At rest it stands left of
 * centre, its tyre bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous slide on a spring, with rotation tied to it;
 * the hit is the pointer's screen x, which never moves.
 */
const {
  Cam, clamp, fit, hull, lerp, poly, proj, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const R = 30, TH = 6, SPAN = 46, REST = -22, HL_ = 78, HA = 0.95;
const E = [Math.SQRT1_2, -Math.SQRT1_2, 0], W = [Math.SQRT1_2, Math.SQRT1_2, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.85);
  const at = (s, h, t) => [s * E[0] + t * W[0], s * E[1] + t * W[1], h];
  const hx = -HL_ * Math.cos(HA), hz = R + HL_ * Math.sin(HA);
  fit(C, [at(-SPAN - R + hx, 0, 0), at(SPAN + R, 0, 0), at(-SPAN + hx, hz + 4, 0), at(SPAN, 2 * R, 0)], 200, 166);
  const P = proj(C);
  const Q = (s, h, t) => P(...at(s, h, t));
  const g = mk("g", {}, svg);
  const marks = [seg(Q(-SPAN - R + hx, 0, 0), Q(SPAN + R, 0, 0))];
  for (let s = -SPAN - 20; s <= SPAN + 20; s += 10) marks.push(seg(Q(s, 0, -4), Q(s, 0, 4)));
  mk("path", { class: "nf lo", d: marks.join("") }, g);
  const handle = mk("path", { class: "nf" }, g), box = mk("path", { class: "sil" }, g);
  const tyre = mk("path", { class: "sil" }, g), hub = mk("path", { class: "nf lo" }, g), spokes = mk("path", { class: "nf" }, g);
  const x = spring(REST, { k: 80 * value, c: 16 * Math.sqrt(value) });
  let last = NaN;

  function ring(s0, t, r) {
    return Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return Q(s0 + r * Math.cos(a), R + r * Math.sin(a), t); });
  }
  function draw() {
    const s0 = x.x;
    if (s0 === last) return;
    last = s0;
    const f = TH / 2;
    tyre.setAttribute("d", poly(hull(ring(s0, -f, R).concat(ring(s0, f, R)))));
    hub.setAttribute("d", poly(ring(s0, f, R - 4)) + poly(ring(s0, f + 0.5, 4)));
    const rot = -s0 / R, sp = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + (i / 5) * Math.PI * 2;
      sp.push(seg(Q(s0 + 4 * Math.cos(a), R + 4 * Math.sin(a), f + 0.5), Q(s0 + (R - 4) * Math.cos(a), R + (R - 4) * Math.sin(a), f + 0.5)));
    }
    spokes.setAttribute("d", sp.join(""));
    // the handle: a fork behind the wheel up to a grip, with the counter on it
    const top = [s0 + hx, hz];
    handle.setAttribute("d", seg(Q(s0, R, -f - 2), Q(top[0], top[1], -f - 2)) +
      seg(Q(top[0], top[1], -f - 10), Q(top[0], top[1], -f + 6)));
    const m = [lerp(s0, top[0], 0.42), lerp(R, top[1], 0.42)], bp = [];
    for (const ds of [-5, 5]) for (const dh of [-4, 4]) for (const t of [-f - 6, -f + 2]) bp.push(Q(m[0] + ds, m[1] + dh, t));
    box.setAttribute("d", poly(hull(bp)));
  }
  const B = register(stage, (dt) => { const mv = stepS(x, dt); draw(); return mv; });
  bag.add(B.unregister);
  tyre.classList.add("hi");

  const c0 = Q(0, 0, 0), c1 = Q(SPAN, 0, 0);
  function roll(p) {
    if (!p) { x.t = REST; read.textContent = "rest"; }
    else {
      x.t = clamp(((p[0] - c0[0]) / (c1[0] - c0[0])) * SPAN, -SPAN, SPAN);
      read.textContent = (Math.round(x.t + SPAN) / 10).toFixed(1) + "m";
    }
    B.wake();
  }
  draw();
  roll(null);
  bag.add(pointer(stage, { move: (p) => roll(p), leave: () => roll(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { x.k = 80 * v; x.c = 16 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "odometerwheel",
  means: "A surveyor's measuring wheel on a marked line: it rolls after the pointer, its spokes turning, the counter reading the distance.",
  rules: [1, 3, 5],
  range: [0.4, 1, 2],
  tour: [[309, 244], [85, 244], [200, 230], null],
  mount,
});
