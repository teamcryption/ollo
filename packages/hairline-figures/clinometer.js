/**
 * Clinometer: a quarter-circle plate with a sighting tube along its top
 * edge, pivoted on a post, a plumb needle hanging from the pivot across the
 * scale. The pointer is what to sight: the plate tilts to aim the tube at it
 * while the needle keeps hanging straight down. At rest it sights upward,
 * bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous tilt on a spring; the hit is the pointer's
 * angle from the pivot's fixed screen point.
 */
const {
  Cam, clamp, fit, hull, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const R = 50, Z0 = R + 16, TH = 4, REST = 20, MAXT = 40;
const E = [Math.SQRT1_2, -Math.SQRT1_2, 0], W = [Math.SQRT1_2, Math.SQRT1_2, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  const at = (s, h, t) => [s * E[0] + t * W[0], s * E[1] + t * W[1], Z0 + h];
  fit(C, [[-16, -16, 0], [16, 16, 0], at(R + 6, R * 0.7, 0), at(-4, 8, 0), at(R * 0.8, -R * 0.8, 0)], 200, 166);
  const P = proj(C), front = facing(C);
  const Q = (s, h, t) => P(...at(s, h, t));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-16, -16, 16, 16, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 7));
  mk("path", { class: "nf", d: seg(Q(0, -Z0 + 7, -7), Q(0, 0, -7)) + seg(Q(0, 0, -7), Q(0, 0, -TH / 2)) }, g);
  const plate = mk("path", { class: "sil" }, g), scale = mk("path", { class: "nf lo" }, g);
  const tube = mk("path", { class: "sil" }, g), needle = mk("path", { class: "nf" }, g);
  const sp = { k: 90 * value, c: 17 * Math.sqrt(value) };
  const th = spring(REST, sp);
  let last = NaN;

  function draw() {
    const T = th.x;
    if (T === last) return;
    last = T;
    const c = Math.cos(rad(T)), s = Math.sin(rad(T));
    const L = (u, v, t) => Q(u * c - v * s, u * s + v * c, t);
    const face = (t) => {
      const pts = [L(0, 0, t)];
      for (let i = 0; i <= 18; i++) { const a = rad(-90 + i * 5); pts.push(L(R * Math.cos(a), R * Math.sin(a), t)); }
      return pts;
    };
    plate.setAttribute("d", poly(hull(face(-TH / 2).concat(face(TH / 2)))));
    const ticks = [];
    for (let i = 0; i <= 9; i++) {
      const a = rad(-90 + i * 10), r0 = i % 3 === 0 ? R - 9 : R - 6;
      ticks.push(seg(L(r0 * Math.cos(a), r0 * Math.sin(a), TH / 2), L((R - 3) * Math.cos(a), (R - 3) * Math.sin(a), TH / 2)));
    }
    scale.setAttribute("d", ticks.join(""));
    const tp = [];
    for (const u of [-6, R + 6]) for (const v of [1, 7]) for (const t of [-3, 3]) tp.push(L(u, v, t));
    tube.setAttribute("d", poly(hull(tp)));
    needle.setAttribute("d", seg(Q(0, 0, TH / 2 + 0.5), Q(0, -(R - 4), TH / 2 + 0.5)));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  plate.classList.add("hi");

  const piv = P(...at(0, 0, 0));
  function aim(p) {
    if (!p) { th.t = REST; read.textContent = "rest"; }
    else {
      th.t = clamp(-Math.atan2(p[1] - piv[1], Math.max(8, p[0] - piv[0])) * 180 / Math.PI, -MAXT, MAXT);
      read.textContent = (th.t >= 0 ? "+" : "") + Math.round(th.t) + "°";
    }
    B.wake();
  }
  draw();
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { th.k = 90 * v; th.c = 17 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "clinometer",
  means: "A sighting clinometer on a post: the plate tilts to aim its tube at the pointer while the plumb needle hangs straight.",
  rules: [1, 3, 5],
  range: [0.4, 1, 2],
  tour: [[209, 162], [276, 53], [300, 220], null],
  mount,
});
