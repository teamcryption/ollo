/**
 * Pepper mill: a tall mill on a round dish, a square-cornered body and a
 * square-cornered head with a knob on top. The pointer twists the head: its
 * screen x is the turn, on a spring, and the head rises a little as it
 * unscrews. At rest the head sits a quarter-turn askew, bright.
 */
const {
  Cam, circ, facing, fit, prism, proj, rrect, rings, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const REST = 0.42, H0 = 54, H1 = 86;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([34 * Math.cos(a), 34 * Math.sin(a), 0]); }
  ext.push([0, 0, H1 + 18], [16, 16, H1 + 14], [-16, -16, H1 + 14]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // dish with a few grains of pepper
  put(solid(g), prism(P, front, circ(32, 64), circ(29.5, 64), 0, 3));
  const GR = [[-22, 6], [-18, 14], [8, 22], [14, 18], [-6, 24], [22, -4], [19, 9], [-24, -6]];
  GR.forEach(([x, y], i) => place(flatDot(g, C, 1, i % 3 ? "dot off" : "dot m"), P(x, y, 3)));
  // body: foot, waist and shoulder
  const BODY = rings(-11, -11, 11, 11, 4, 1.4), FOOT = rings(-13, -13, 13, 13, 5, 1.6);
  put(solid(g), prism(P, front, turn(FOOT[0], 0.2), turn(FOOT[1], 0.2), 3, 9));
  put(solid(g), prism(P, front, turn(BODY[0], 0.2), turn(BODY[1], 0.2), 9, H0));
  const collar = solid(g);
  put(collar, prism(P, front, circ(8, 32), circ(7, 32), H0, H0 + 3));
  const HEAD = [rrect(-13, -13, 13, 13, 5, 6), rrect(-11.6, -11.6, 11.6, 11.6, 3.6, 6)];
  const head = solid(g), neck = solid(g), knob = solid(g);
  head.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const lift = spring(0);
  let drawn = NaN;
  function draw() {
    const a = sp.x, z = H0 + 2 + lift.x;
    if (Math.abs(a - drawn) < 1e-4 && Math.abs(lift.x - draw.l) < 1e-3) return;
    drawn = a; draw.l = lift.x;
    put(collar, prism(P, front, circ(8, 32), circ(7, 32), H0, z + 1));
    put(head, prism(P, front, turn(HEAD[0], a), turn(HEAD[1], a), z, z + (H1 - H0)));
    const top = z + (H1 - H0);
    put(neck, prism(P, front, turn(rrect(-3, -3, 3, 3, 1.2, 3), a), null, top, top + 5));
    put(knob, prism(P, front, turn(rrect(-6, -6, 6, 6, 2.6, 4), a), turn(rrect(-5, -5, 5, 5, 1.8, 4), a), top + 5, top + 10));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt) | stepS(lift, dt); draw(); return !!m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const t = clamp((p[0] - 200) / 120, -1, 1);
      sp.t = REST + t * Math.PI * 0.75;
      lift.t = 9 * Math.abs(t);
      read.textContent = "turn " + Math.round(t * 135) + "°";
      B.wake();
    },
    leave: () => { sp.t = REST; lift.t = 0; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "spicegrinder",
  means: "A tall pepper mill on a dish: the head twists with the pointer and rises a little as it unscrews.",
  rules: [3, 5, 8, 9],
  range: [0.5, 1, 1.6],
  tour: [[330, 259], [70, 259], [200, 60], null],
  mount,
});
