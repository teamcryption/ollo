/**
 * Stapler: a desk stapler, a long base with an anvil plate near its nose, a
 * hinge block at the back and the arm hung on it. The pointer presses the
 * arm down on a spring, harder the nearer the nose it lands; the arm turns
 * bright as it closes. At rest the arm stands open and the anvil is bright.
 * The slider is how hard a press goes.
 */
const {
  Cam, fit, proj, rrect, prism, rings, facing, hull, poly, open, run, ringAt, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const L = 70, Wd = 15, HX = 5, HZ = 12, AL = 66, AT = 7, REST = 21;
const R = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.1);
  const top = HZ + (AL + 2) * Math.sin(REST * R) + AT;
  fit(C, [[0, 0, 0], [L, Wd, 0], [L, 0, 0], [0, Wd, 0], [0, 0, top], [HX + AL, Wd, top], [HX + AL, 0, 12]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, Wd, 5, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const anvil = solid(g);
  put(anvil, prism(P, front, ...rings(54, 3.5, 63, Wd - 3.5, 2, 0.7), 5, 5.8));
  put(solid(g), prism(P, front, ...rings(1, 1.5, 12, Wd - 1.5, 3, 1), 5, HZ + 2));
  const arm = solid(g);
  const AR = rrect(0, 0.5, AL, Wd - 0.5, 5, 6), AI = rrect(1.2, 1.7, AL - 1.2, Wd - 1.7, 3.8, 6);
  const ang = spring(REST);
  let drawn = NaN;

  function at(ring, a, zl) {
    const c = Math.cos(a * R), s = Math.sin(a * R);
    return ring.map((q) => P(HX + q.u * c - zl * s, q.v, HZ + q.u * s + zl * c));
  }
  function draw() {
    if (Math.abs(ang.x - drawn) < 1e-3) return;
    drawn = ang.x;
    const ring = AR.map((q) => ({ ...q })), sil = hull(at(ring, ang.x, 0).concat(at(ring, ang.x, AT)));
    const fr = run(AI, front);
    arm.sil.setAttribute("d", poly(sil));
    arm.cr.setAttribute("d", open(at(fr, ang.x, AT)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(on, x) {
    ang.t = on ? clamp(REST - (REST - 1) * value * clamp(0.35 + x / AL, 0, 1), 1, REST) : REST;
    arm.sil.classList.toggle("hi", on);
    anvil.sil.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(((REST - ang.t) / (REST - 1)) * 100) + "%" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 5);
      set(x > -10 && x < L + 14 && y > -14 && y < Wd + 14, clamp(x, 0, L));
    },
    leave: () => set(false, 0),
  }));
  bag.add(() => svg.replaceChildren());
  set(false, 0);
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "rulerset",
  means: "A desk stapler: the pointer presses its arm down on the hinge, harder near the nose, and the arm turns bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[113, 187], [200, 231], [272, 267], null],
  mount,
});
