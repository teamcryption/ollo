/**
 * Dirt bike: two tall wheels, long exposed forks, a swingarm, a slim tank and
 * a long flat seat, high front fender and number plate. The pointer presses
 * it down: lower on the stage, deeper the whole frame sinks on its
 * suspension, the forks shortening and the swingarm swinging, while the
 * wheels stay planted. At rest the number plate is bright. The slider is the
 * suspension travel.
 *
 * The pattern: one continuous compression on a spring, read from the pointer's height.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, circ, seg, clamp, flatDot, place,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing,
} = HL;

const R = 12, XR = -30, XF = 32, SAG = 1.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[XR - R - 8, -8, 0], [XF + R, 8, 0], [XR - R - 8, 0, 36], [20, -14, 46], [20, 14, 46]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, hw) => {
    const ring = (R2, off) => { const o = []; for (let i = 0; i < 36; i++) { const s = (i / 36) * Math.PI * 2; o.push(P(cx + R2 * Math.cos(s), off, R + R2 * Math.sin(s))); } return o; };
    const el = solid(g);
    el.sil.setAttribute("d", poly(hull(ring(R, -hw).concat(ring(R, hw)))));
    mk("path", { class: "nf lo", d: poly(ring(R - 5, hw)) }, el.g);
  };
  const bar = (a, b, r) => poly(hull(circ(r, 10).flatMap((q) => [P(a[0] + q.u, a[1] + q.v, a[2]), P(b[0] + q.u, b[1] + q.v, b[2])])));
  wheel(XR, 3.5);
  const arm = mk("path", { class: "sil" }, g), tail = mk("path", { class: "sil" }, g);
  const eng = solid(g), tank = solid(g), seat = solid(g);
  const forkF = mk("path", { class: "sil" }, g);
  wheel(XF, 3);
  const forkN = mk("path", { class: "sil" }, g);
  const fend = solid(g), bars = mk("path", { class: "nf sil" }, g);
  const plate = flatDot(g, C, 1.6, "dot");
  const box = (el, x0, y0, x1, y1, r, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, 1); put(el, prism(P, front, o, i, z0, z1)); };
  const S = spring(SAG);
  let last = NaN, act = false;

  function draw() {
    const d = S.x;
    if (d === last) return;
    last = d;
    arm.setAttribute("d", bar([XR, 0, R], [-6, 0, 18 - d], 1.8));
    tail.setAttribute("d", bar([-8, 0, 32 - d], [XR - 8, 0, 36 - d], 1.4));
    box(eng, -10, -5, 6, 5, 3, 10 - d, 22 - d);
    box(tank, -4, -6, 14, 6, 5, 27 - d, 34 - d);
    box(seat, -26, -5, 2, 5, 3, 31 - d, 34 - d);
    forkF.setAttribute("d", bar([XF, -4, R], [20, -4, 42 - d], 1.5));
    forkN.setAttribute("d", bar([XF, 4, R], [20, 4, 42 - d], 1.5));
    box(fend, XF - 9, -4, XF + 6, 4, 3, 26 - d * 0.4, 27.5 - d * 0.4);
    bars.setAttribute("d", seg(P(19, -14, 46 - d), P(19, 14, 46 - d)) + seg(P(20, 0, 42 - d), P(19, 0, 46 - d)));
    place(plate, P(23, 0, 39 - d));
    read.textContent = act ? Math.round(d) + " cm" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(S, dt); draw(); return m; });
  bag.add(B.unregister);
  let lastY = null;
  const press = (sy) => clamp((sy - 70) / 190, 0, 1) * travel;
  function setActive(on, d) {
    act = on; S.t = d;
    forkF.classList.toggle("hi", on); forkN.classList.toggle("hi", on);
    plate.setAttribute("class", on ? "dot off" : "dot");
    last = NaN; B.wake();
  }
  setActive(false, SAG);
  draw();
  bag.add(pointer(stage, {
    move: ([, sy]) => { lastY = sy; setActive(true, press(sy)); },
    leave: () => { lastY = null; setActive(false, SAG); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (act && lastY !== null) setActive(true, press(lastY)); }, destroy: bag.dispose };
}

hairline({
  name: "dirtbike",
  means: "A dirt bike: the pointer presses it down, the frame sinking on its long forks and swingarm while the wheels stay planted.",
  rules: [1, 3, 4, 5],
  range: [6, 10, 14],
  tour: [[215, 106], [281, 214], [281, 246], null],
  mount,
});
