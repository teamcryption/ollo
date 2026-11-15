/**
 * Fire hydrant: a flanged foot, a barrel, a collar, a domed bonnet with its
 * operating nut, and three outlet nozzles, each closed by a cap. The pointer
 * is the crew arriving: the upper barrel turns on a spring until the big
 * pumper cap faces it. At rest the pumper looks off down the kerb, its cap
 * bright. The slider is how quickly the barrel follows.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 2.4;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
// nozzles: offset angle, half width, reach, z0, z1, cap length
const NOZ = [[0, 5, 18, 13, 24, 4], [Math.PI / 2, 3.4, 14, 15, 22, 3], [-Math.PI / 2, 3.4, 14, 15, 22, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 5.2);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([18 * Math.cos(a), 18 * Math.sin(a), 13], [11 * Math.cos(a), 11 * Math.sin(a), 0]); }
  ext.push([0, 0, 48]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const barrel = mk("g", {}, g);
  put(solid(barrel), prism(P, front, circ(10, 40), circ(8.6, 40), 0, 3));
  put(solid(barrel), prism(P, front, circ(7, 36), circ(6, 36), 3, 33));
  put(solid(barrel), prism(P, front, circ(9, 40), circ(7.8, 40), 33, 36));
  put(solid(barrel), prism(P, front, circ(7, 36), circ(5.4, 36), 36, 42));
  put(solid(barrel), prism(P, front, circ(2.6, 6), null, 42, 47));
  const noz = NOZ.map(([o, w, L, z0, z1, cl], i) => {
    const grp = mk("g", {}, g);
    return { o, w, L, z0, z1, cl, grp, body: solid(grp), cap: solid(grp), rb: rings(4, -w, L - cl, w, w * 0.6, 0.6), rc: rings(L - cl, -w - 1, L, w + 1, 1.5, 0.8), behind: null, i };
  });
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    for (const n of noz) {
      const T = (r) => turn(r, a + n.o);
      put(n.body, prism(P, front, T(n.rb[0]), null, n.z0 + 1, n.z1 - 1));
      put(n.cap, prism(P, front, T(n.rc[0]), T(n.rc[1]), n.z0, n.z1));
      const b = Math.cos(a + n.o) + Math.sin(a + n.o) < 0;
      if (b !== n.behind) { n.behind = b; if (b) barrel.before(n.grp); else barrel.after(n.grp); }
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const aim = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(aim - sp.t);
    noz[0].cap.sil.classList.toggle("hi", true);
    read.textContent = over ? Math.round(((aim * 180) / Math.PI + 360) % 360) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r < 3 || r > 70 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "hydrant",
  means: "A fire hydrant whose upper barrel turns on its post until the big pumper cap faces the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[163, 186], [347, 260], [274, 315], null],
  mount,
});
