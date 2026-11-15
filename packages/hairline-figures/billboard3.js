/**
 * Rotating sign: a lightbox sign box on a tall pole, on a round footing. The
 * pointer is the passer-by: the box turns on its pole to face it, on a
 * spring. At rest it stands a little askew, bright. The slider is how
 * quickly it turns.
 */
const { Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;
const Z0 = 62, Z1 = 112, HW = 36, HD = 5, REST = (-38 * Math.PI) / 180;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  const ext = [[0, 0, 0]];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([HW * Math.cos(a), HW * Math.sin(a), Z1], [HW * Math.cos(a), HW * Math.sin(a), Z0], [16 * Math.cos(a), 16 * Math.sin(a), 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(16, 40), circ(14.6, 40), 0, 4));
  put(solid(g), prism(P, front, circ(2.6, 20), null, 4, Z0));
  const box = solid(g), cap = solid(g);
  const [R0, R1] = rings(-HW, -HD, HW, HD, 3, 1.4), [K0, K1] = rings(-HW + 4, -HD + 1.5, HW - 4, HD - 1.5, 2, 0.8);
  box.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    put(box, prism(P, front, turn(R0, sp.x), turn(R1, sp.x), Z0, Z1));
    put(cap, prism(P, front, turn(K0, sp.x), turn(K1, sp.x), Z1, Z1 + 3));
  }
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(L.unregister);
  function aim(over) {
    // the box's face (local +v) turns toward the pointer
    const a = over ? Math.atan2(over[1], over[0]) - Math.PI / 2 : REST;
    sp.t = sp.t + wrap(a - sp.t);
    read.textContent = over ? String(Math.round((((a + Math.PI / 2) * 180) / Math.PI + 360) % 360)).padStart(3, "0") + "°" : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y); aim(r < 8 || r > 130 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "billboard3",
  means: "A lightbox sign on a tall pole: the box turns on its pole to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[302, 243], [98, 243], [250, 300], null],
  mount,
});
