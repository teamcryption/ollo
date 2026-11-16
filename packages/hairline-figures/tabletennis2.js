/**
 * Ball launcher: a tennis ball machine on a round base, its turret a body,
 * a hopper of balls on top and a barrel out the front. The pointer is where
 * it aims: the turret turns on its column on a spring to face it. At rest it
 * points off to one side, the barrel bright. The slider is how quickly it
 * follows.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = rad(28);
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.15);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([50 * Math.cos(a), 50 * Math.sin(a), 22], [24 * Math.cos(a), 24 * Math.sin(a), 0], [16 * Math.cos(a), 16 * Math.sin(a), 52]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-22, -22, 22, 22, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, circ(4, 20), null, 5, 18));
  const tur = mk("g", {}, g), barG = mk("g", {}, tur);
  const BODY = rings(-15, -13, 13, 13, 6, 2), BAR = rings(4, -5, 46, 5, 5, 1.4), MOUTH = rings(42, -6.5, 47, 6.5, 2, 1);
  const HOP = rings(-16, -14, 8, 14, 5, 2);
  const barrel = solid(barG), mouth = solid(barG), body = solid(tur), hop = solid(tur), balls = [0, 1, 2].map(() => solid(tur));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, barFirst = null;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = (r) => turn(r, a);
    put(body, prism(P, front, T(BODY[0]), T(BODY[1]), 18, 32));
    put(barrel, prism(P, front, T(BAR[0]), T(BAR[1]), 22, 31));
    put(mouth, prism(P, front, T(MOUTH[0]), T(MOUTH[1]), 20.5, 32.5));
    put(hop, prism(P, front, T(HOP[0]), T(HOP[1]), 32, 46));
    [[-8, -5], [-1, 5], [-10, 6]].forEach(([u, v], i) => put(balls[i], prism(P, front, T(disc(u, v, 4.2)), null, 46, 49)));
    const first = Math.cos(a) + Math.sin(a) < 0;
    if (first !== barFirst) { barFirst = first; if (first) tur.prepend(barG); else tur.append(barG); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(over) {
    const t = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(t - sp.t);
    barrel.sil.classList.add("hi");
    mouth.sil.classList.add("hi");
    read.textContent = over ? "aim " + Math.round(((t * 180) / Math.PI + 360) % 360) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y); aim(r < 14 || r > 90 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "tabletennis2",
  means: "A tennis ball launcher: its turret, hopper and barrel turn on the column to aim at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[133, 175], [66, 231], [122, 285], null],
  mount,
});
