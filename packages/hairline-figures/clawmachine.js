/**
 * Claw machine: a cabinet with a glass case over a pit of prizes, a gantry
 * rail under the roof and a claw on a cable. The pointer over the pit steers
 * the claw: it slides over the prize below and drops toward it on its cable.
 * At rest the claw hangs high over the chute corner, bright. The slider is
 * how far the claw drops.
 *
 * The pattern: one part following the pointer over a ground plane (terrain).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, BZ = 34, GZ = 92, HZ = 104, TOPZ = 86, REST = [50, 10];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PRIZES = [[14, 14, 6], [28, 10, 5], [12, 30, 5], [26, 26, 7], [42, 34, 6], [16, 46, 6], [32, 44, 5], [46, 48, 6], [44, 18, 4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [0, 0, HZ], [W, W, HZ], [W, 0, HZ], [0, W, HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // back posts and back glass edges, behind everything
  mk("path", { d: seg(P(0, 0, BZ), P(0, 0, GZ)) + seg(P(W, 0, BZ), P(W, 0, GZ)) + seg(P(0, W, BZ), P(0, W, GZ)), class: "nf lo" }, g);
  const [br, bi] = rings(0, 0, W, W, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the chute: a square opening on the front corner of the pit floor
  mk("path", { d: poly(ringAt(P, rings(W - 16, W - 16, W - 3, W - 3, 2, 1)[0], BZ)), class: "nf lo" }, g);

  // prizes: little round lumps, back to front
  [...PRIZES].sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, y, r]) => {
    const pts = [];
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, r * Math.cos(t) + 0.3), BZ + r * 0.9 * (1 + Math.sin(t)))); }
    mk("path", { d: poly(hull(pts)) }, g);
  });

  // gantry rail under the roof
  const rail = mk("path", { class: "nf lo" }, g);
  const cable = mk("path", { class: "nf lo" }, g);
  const head = solid(g), prongs = mk("path", { class: "nf" }, g);
  head.sil.classList.add("hi");

  // front posts, glass rim and the roof header
  mk("path", { d: seg(P(W, W, BZ), P(W, W, GZ)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, br, GZ)), class: "nf lo" }, g);
  const [hr, hi] = rings(-2, -2, W + 2, W + 2, 4, 1.6);
  const roof = solid(g);
  put(roof, prism(P, front, hr, hi, GZ, HZ));
  roof.g.querySelector("path").classList.add("nf");

  const sx = spring(REST[0]), sy = spring(REST[1]), sz = spring(TOPZ);
  let last = "";
  function draw() {
    const x = sx.x, y = sy.x, z = sz.x, key = [x, y, z].map((n) => n.toFixed(2)).join();
    if (key === last) return;
    last = key;
    rail.setAttribute("d", seg(P(0, y, GZ - 2), P(W, y, GZ - 2)) + seg(P(x, 0, GZ - 2), P(x, W, GZ - 2)));
    cable.setAttribute("d", seg(P(x, y, GZ - 2), P(x, y, z + 8)));
    const [r0, r1] = [disc(x, y, 6), disc(x, y, 4.2)];
    put(head, prism(P, front, r0, r1, z, z + 8));
    let d = "";
    for (const a of [0, 2.09, 4.19]) {
      const c = Math.cos(a + 0.8), s = Math.sin(a + 0.8);
      d += open([P(x + 5 * c, y + 5 * s, z), P(x + 11 * c, y + 11 * s, z - 9), P(x + 6 * c, y + 6 * s, z - 17)]);
    }
    prongs.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    const m = [sx, sy, sz].map((sp) => stepS(sp, dt)).some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = p ? unproj(C, p[0], p[1], BZ) : [NaN, NaN];
    const inside = p && wx > -4 && wx < W + 4 && wy > -4 && wy < W + 4;
    if (inside) {
      sx.t = clamp(wx, 8, W - 8); sy.t = clamp(wy, 8, W - 8);
      sz.t = TOPZ - (TOPZ - BZ - 20) * drop;
      read.textContent = "x" + (1 + Math.floor(sx.t / 15)) + "·" + (1 + Math.floor(sy.t / 15));
    } else {
      sx.t = REST[0]; sy.t = REST[1]; sz.t = TOPZ;
      read.textContent = "rest";
    }
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; }, destroy: bag.dispose };
}

hairline({
  name: "clawmachine",
  means: "A claw machine over a pit of prizes: the claw slides over the prize under the pointer and drops toward it on its cable.",
  rules: [1, 3, 5, 8],
  range: [0, 0.7, 1],
  tour: [[173, 196], [228, 204], [205, 165], null],
  mount,
});
