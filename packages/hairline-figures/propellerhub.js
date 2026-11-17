/**
 * Propeller: a three-bladed propeller on an engine nacelle, held up on a
 * stand. The pointer is a breath of air: the blades turn on a spring by a
 * third of a turn, and the spinner takes the bright. At rest the blades stand
 * a little off square, one blade bright. The slider is how far they turn.
 *
 * The pattern: a turn on one spring; the hit is a fixed circle round the hub at rest.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HZ = 54, RB = 46, REST = 0.26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-RB, 2, HZ - RB], [RB, 2, HZ + RB], [-22, -40, 0], [22, -6, 0], [0, -44, HZ + 10], [0, 14, HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ts = (s, ring, inner, z0, z1, T) => {
    const pts = (r, z) => r.map((q) => P(...T([q.u, q.v, z])));
    put(s, { sil: poly(hull(pts(ring, z0).concat(pts(ring, z1)))), crease: inner ? poly(pts(inner, z1)) : "" });
  };
  put(solid(g), prism(P, front, ...rings(-22, -40, 22, -6, 4, 1.6), 0, 4));
  put(solid(g), prism(P, front, ...rings(-3.5, -26, 3.5, -20, 1.5, 0.8), 4, HZ - 8));
  const cyl = circ(10, 40), cylIn = circ(8.6, 40);
  ts(solid(g), cyl, cylIn, -44, 0, ([u, v, w]) => [u, w, HZ + v]);
  const [br, bi] = rings(-3.6, 9, 3.6, RB, 3.4, 1.2);
  const blades = [0, 1, 2].map(() => solid(g));
  const spin = mk("path", { class: "sil" }, g);
  const tip = P(0, 14, HZ);
  spin.setAttribute("d", poly(hull(circ(7.5, 32).map((q) => P(q.u, 1, HZ + q.v)).concat([tip]))));
  const sp = spring(REST);
  let drawn = NaN, on = false;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    blades.forEach((b, k) => {
      const t = sp.x + (k * Math.PI * 2) / 3, c = Math.cos(t), s = Math.sin(t);
      ts(b, br, bi, -1, 1, ([u, v, w]) => [u * c - v * s, 2 + w, HZ + u * s + v * c]);
    });
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    sp.t = on ? REST + (Math.PI * 2 / 3) * 0.5 * (0.5 + value) : REST;
    blades[0].sil.classList.toggle("hi", !on);
    spin.classList.toggle("hi", on);
    read.textContent = on ? "spin" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const h = P(0, 2, HZ); on = Math.hypot(p[0] - h[0], p[1] - h[1]) < 150; retarget(); },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "propellerhub",
  means: "A three-bladed propeller on its nacelle: the pointer turns the blades a third of a turn, and the spinner lights.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 60], [150, 150], [250, 170], null],
  mount,
});
