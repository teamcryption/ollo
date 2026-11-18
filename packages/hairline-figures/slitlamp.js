/**
 * Slit lamp: an eye microscope on its table, the chin rest frame standing
 * at the patient's end, and the swing arm at the examiner's end carrying the
 * binocular microscope and the tall illuminator tower. The pointer's place
 * across the figure swings the arm about its pivot. At rest the arm stands
 * turned, bright. The slider is how far the arm can swing.
 *
 * The pattern: one part turning to follow the pointer (swing).
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, rings, rrect, ringAt, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 78, PZ = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -44, 0], [112, 44, 0], [-6, 44, 0], [112, -44, 0], [4, -34, 120], [4, 34, 120], [PX, -50, 124], [PX, 50, 124], [PX - 50, 40, 70], [PX - 50, -40, 70]], 200, 166);
  const P = proj(C), all = () => true;
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(par), prism(P, all, a, i, z0, z1)); };
  box(g, -6, -44, 112, 44, 8, 2, 0, PZ);
  // chin rest frame: two posts, chin bar, forehead bar
  for (const y of [-34, 30]) box(g, 0, y, 8, y + 4, 1.5, 0.6, PZ, 116);
  box(g, 0, -34, 8, 34, 2, 0.8, 70, 74);
  box(g, 0, -34, 8, 34, 2, 0.8, 112, 118);
  // the swing arm: one group redrawn as it turns
  const arm = mk("g", {}, g);
  const s = spring(0.75);
  let last = NaN;
  const rot = (ring, a) => { const c = Math.cos(a), sn = Math.sin(a); return ring.map((q) => ({ u: PX + q.u * c - q.v * sn, v: q.u * sn + q.v * c, nu: q.nu * c - q.nv * sn, nv: q.nu * sn + q.nv * c })); };
  const rbox = (a, x0, y0, x1, y1, r, b, z0, z1, cls) => { const sd = solid(arm); put(sd, prism(P, all, rot(rrect(x0, y0, x1, y1, r, 4), a), rot(rrect(x0 + b, y0 + b, x1 - b, y1 - b, r - b, 4), a), z0, z1)); if (cls) sd.sil.classList.add(cls); };
  const W = (a, u, v, z) => P(PX + u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a), z);
  function tube(a, u0, u1, v, z, r, cls) {
    const ring = (u) => { const o = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; o.push(W(a, u, v + r * Math.cos(t), z + r * Math.sin(t))); } return o; };
    mk("path", { d: poly(hull(ring(u0).concat(ring(u1)))), class: cls }, arm);
    const near = Math.cos(a) + Math.sin(a) > 0 ? u1 : u0;
    mk("path", { d: poly(ring(near).map((p, i, o) => p)), class: "nf lo" }, arm);
  }
  function draw(v) {
    const a = rad((v - 0.5) * 2 * maxA);
    if (a === last) return;
    last = a;
    arm.replaceChildren();
    rbox(a, -10, -12, 22, 12, 5, 1.5, PZ, PZ + 6);
    const tower = () => { rbox(a, -16, 20, -8, 28, 2, 0.8, PZ + 6, 104); const [lr, li] = [circ(9, 24), circ(7, 24)]; put(solid(arm), prism(P, all, rot(lr.map((q) => ({ ...q, u: q.u - 12, v: q.v + 24 })), a), rot(li.map((q) => ({ ...q, u: q.u - 12, v: q.v + 24 })), a), 104, 120)); };
    const scope = () => { rbox(a, -4, -5, 4, 5, 2, 0.8, PZ + 6, 56); tube(a, -46, 6, 0, 62, 8, "sil hi"); tube(a, 6, 22, -5, 66, 3.2, "sil"); tube(a, 6, 22, 5, 66, 3.2, "sil"); };
    if (Math.sin(a) + Math.cos(a) * 0 > 0.2) { scope(); tower(); } else { tower(); scope(); }
  }
  draw(s.x);
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    const v = clamp((sx - 70) / 260, 0, 1);
    s.t = v;
    read.textContent = "arm " + Math.round((v - 0.5) * 2 * maxA);
    B.wake();
  }
  function leave() { s.t = 0.75; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; last = NaN; draw(s.x); }, destroy: bag.dispose };
}

hairline({
  name: "slitlamp",
  means: "A slit lamp on its table with the chin rest: the pointer's place across it swings the arm with the microscope and lamp tower.",
  rules: [1, 3, 5, 8],
  range: [30, 50, 70],
  tour: [[134, 218], [172, 143], [320, 241], null],
  mount,
});
