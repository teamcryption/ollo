/**
 * Brake caliper: a drilled disc on its hub, with the caliper straddling its
 * edge and two pads inside. The pointer is the service: the nearer it comes,
 * the further the caliper slides off the disc's edge and its pads open. At rest
 * the caliper sits just clear of the rim, its body bright. The slider is how
 * far the caliper may slide.
 *
 * The pattern: one slide on a spring; the hit is on the floor plane.
 */
const {
  Cam, circ, fit, prism, proj, rings, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 32, DZ = 4, CX = 26, REST = 3, MAX = 24;
const box = (P, front, x0, y0, x1, y1, z0, z1, r = 2, b = 0.8) => {
  const [o, i] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, o, i, z0, z1);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R + MAX + 10, -R, 0], [CX + MAX + 12, 0, 20]], 200, 165);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 96), circ(R - 9, 96), 0, DZ));
  put(solid(g), prism(P, front, circ(12, 48), circ(10, 48), DZ, DZ + 5));
  for (let k = 0; k < 5; k++) { const a = k * 1.2566; place(flatDot(g, C, 1.6, "dot off"), P(6 * Math.cos(a), 6 * Math.sin(a), DZ + 5)); }
  for (let k = 0; k < 18; k++) { const a = k * 0.349 + (k % 2) * 0.12, r = k % 2 ? 26 : 20; place(flatDot(g, C, 1, "dot off"), P(r * Math.cos(a), r * Math.sin(a), DZ)); }
  const grp = mk("g", {}, g), padA = solid(grp), body = solid(grp), padB = solid(grp);
  const slide = spring(REST, { k: 110, c: 19 });
  let drawn = NaN, max = MAX * value;

  function draw() {
    const s = slide.x;
    if (Math.abs(s - drawn) < 1e-3) return;
    drawn = s;
    const x = CX + s, open = s * 0.12;
    put(padA, box(P, front, x - 4, -9, x + 4, 9, DZ - 3 - open, DZ - 1 - open, 1.5, 0.6));
    put(body, box(P, front, x - 2, -13, x + 12, 13, -3 - open, 13 + open, 4, 1.4));
    put(padB, box(P, front, x - 5, -10, x + 5, 10, 13 + open, 16 + open, 2, 0.8));
  }
  const B = register(stage, (dt) => { const m = stepS(slide, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(d) {
    slide.t = d == null ? REST : clamp(REST + (max - REST) * (1 - d / 60), REST, max);
    body.sil.classList.toggle("hi", true);
    read.textContent = d == null ? "rest" : Math.round(slide.t) + " mm";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], DZ), d = Math.hypot(x - CX - REST - 5, y);
      aim(Math.hypot(x, y) > R + 50 && d > 40 ? null : d);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { max = MAX * v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "brakebleeder",
  means: "A disc brake caliper: the caliper slides off the drilled disc and its pads open as the pointer nears.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1],
  tour: [[243, 196], [80, 127], [200, 165], null],
  mount,
});
