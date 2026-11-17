/**
 * Wire stripper: a pair of strippers lying on the bench, two arms crossing
 * at a pivot, short notched jaws in front and long grips behind. The pointer
 * is how far the grips are squeezed apart: the arms swing open on the pivot,
 * jaws and grips together. The top grip is bright; at rest the pair stands
 * a little open. The slider is how quickly it follows.
 */
const {
  Cam, circ, clamp, fit, facing, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 24, REST = 0.13, MAXA = 0.48;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: PX + q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (const a of [-MAXA, MAXA, -REST, REST]) for (const u of [-80, 36]) ext.push([PX + u * Math.cos(a), u * Math.sin(a), 0], [PX + u * Math.cos(a), u * Math.sin(a), 9]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ARM = rings(-50, -3, 36, 3, 2.5, 0.9), GRIP = rings(-80, -6, -26, 6, 6, 1.6), NOTCH = rings(10, -3.6, 22, 3.6, 1.2, 0.5);
  const arms = [-1, 1].map((sgn) => ({ sgn, body: solid(g), notch: solid(g), grip: solid(g) }));
  const pin = solid(g);
  put(pin, prism(P, front, circ(5, 28).map((q) => ({ ...q, u: q.u + PX })), circ(3.4, 28).map((q) => ({ ...q, u: q.u + PX })), 0, 10));
  arms[1].grip.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return; drawn = sp.x;
    for (const A of arms) {
      const a = A.sgn * sp.x, z0 = A.sgn < 0 ? 0 : 4;
      put(A.body, prism(P, front, turn(ARM[0], a), turn(ARM[1], a), z0, z0 + 4));
      put(A.notch, prism(P, front, turn(NOTCH[0], a), turn(NOTCH[1], a), z0 + 4, z0 + 4.6));
      put(A.grip, prism(P, front, turn(GRIP[0], a), turn(GRIP[1], a), 0, z0 + 5));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(o) {
    sp.t = o ? clamp(Math.atan2(Math.abs(o[1]), Math.max(PX - o[0], 30)), 0.03, MAXA) : REST;
    read.textContent = o ? Math.round(sp.t * 114.6) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x + 20, y) > 110 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "wirestripper",
  means: "A wire stripper on the bench: its arms swing open on the pivot as the pointer moves out from the grips.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[110, 130], [55, 157], [44, 163], null],
  mount,
});
