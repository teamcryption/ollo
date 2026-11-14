/**
 * TV aerial: a yagi on a mast, standing on a chimney stack. The boom turns on
 * the mast to face the pointer, its director rods leading; the driven dipole
 * is the bright rod. Leaving swings it back to its rest bearing. The slider
 * is that rest bearing.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MZ = 34, TZ = 78, BT = 2.6, ET = 1.8;
const RODS = [[-24, 34], [-12, 30], [-1, 32], [10, 24], [20, 21], [30, 18]], DIP = 2;

function rot(ring, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ ...q, u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restDeg = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, TZ + 6], [-36, 36, TZ + 6], [0, 0, TZ + 12]], 200, 184);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-12, -12, 12, 12, 2.5, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, MZ));
  const [kr, ki] = rings(-14, -14, 14, 14, 2.5, 1.4);
  put(solid(g), prism(P, front, kr, ki, MZ, MZ + 3));
  put(solid(g), prism(P, front, circ(1.8, 16), circ(1.2, 16), MZ + 3, TZ));
  const boom = solid(g);
  const [bR, bI] = rings(-28, -BT / 2, 34, BT / 2, 1, 0.5);
  const rods = RODS.map(([u, L], i) => {
    const [r, ri] = rings(u - ET / 2, -L / 2, u + ET / 2, L / 2, 0.9, 0.4);
    const s = solid(g);
    if (i === DIP) s.sil.classList.add("hi");
    return { s, r, ri };
  });

  const sp = spring(rad(restDeg));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(boom, prism(P, front, rot(bR, a), rot(bI, a), TZ, TZ + BT));
    rods.forEach((o) => put(o.s, prism(P, front, rot(o.r, a), rot(o.ri, a), TZ + BT, TZ + BT + ET)));
  }
  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    draw(sp.x);
    return moving;
  });
  bag.add(B.unregister);

  function aimAt(t) {
    const d = t - sp.t;
    sp.t += Math.atan2(Math.sin(d), Math.cos(d));
    const deg = Math.round((((sp.t * 180) / Math.PI) % 360 + 360) % 360) % 360;
    return deg;
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.hypot(wx, wy) < 4) return;
    read.textContent = String(aimAt(Math.atan2(wy, wx))).padStart(3, "0") + "°";
    B.wake();
  }
  function leave() { aimAt(rad(restDeg)); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restDeg = v; leave(); }, destroy: bag.dispose };
}

hairline({
  name: "antenna",
  means: "A TV aerial on a chimney: the boom turns on its mast to face the pointer, directors leading, the dipole the bright rod.",
  rules: [1, 3, 5, 8],
  range: [0, 150, 359],
  tour: [[85, 198], [315, 312], [85, 312], null],
  mount,
});
