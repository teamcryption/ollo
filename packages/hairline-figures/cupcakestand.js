/**
 * Cupcake stand: a three-tier round cake stand on a foot, its plates on one
 * pole with a finial, and nine cupcakes on the tiers, four, three and two,
 * each a pleated paper case under a domed frosting swirl. The pointer is a
 * field: the cupcakes near it rise on their springs, the one under it highest
 * and bright, the lift falling off with distance. At rest they sit unevenly,
 * one on the middle tier raised, bright. The slider is the field's reach.
 *
 * The pattern: a field of springs (terrain); the hit unprojects onto each
 * cupcake's own rest top, so stepped tiers never pick the part behind.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

// each tier: plate top z, plate radius, cupcake ring radius, screen angles (90 is nearest)
const TIERS = [[9.5, 46, 33, [45, 135, 225, 315]], [33.5, 32, 20, [210, 90, 330]], [55.5, 19, 10, [210, 30]]];
const REST = [[0, 1.5, 0.5, 0], [1, 6, 0], [0.5, 0]], FAV = [1, 1], LIFT = 15, HIT = 11;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([46 * Math.cos(a), 46 * Math.sin(a), 0], [46 * Math.cos(a), 46 * Math.sin(a), 9.5]); }
  ext.push([0, 0, 66], [-7, 7, 55.5 + 15 + LIFT]);
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const cakes = [];
  TIERS.forEach(([z0, , rc, angs], t) => angs.forEach((phi, j) => {
    const th = ((phi - 45) * Math.PI) / 180;
    cakes.push({ t, j, x: rc * Math.cos(th), y: rc * Math.sin(th), z0, d: rc * Math.sin((phi * Math.PI) / 180), sp: spring(REST[t][j]), last: NaN });
  }));
  const tierCakes = (t, near) => cakes.filter((c) => c.t === t && (c.d > 0) === near).sort((a, b) => a.d - b.d);
  const pole = (z0, z1) => put(solid(g), prism(P, front, circ(1.8, 20), null, z0, z1));
  const plate = (zt, R) => put(solid(g), prism(P, front, circ(R, 72), circ(R - 1.6, 72), zt - 1.6, zt));
  function cupcake(c) {
    const grp = mk("g", {}, g);
    c.cs = mk("path", { class: "sil" }, grp);
    c.pl = mk("path", { class: "nf lo" }, grp);
    c.fr = mk("path", { class: "sil" }, grp);
    c.sw = mk("path", { class: "nf lo" }, grp);
  }

  // back to front: foot, then tier by tier its far cupcakes; the near ones after everything above them
  put(solid(g), prism(P, front, circ(14, 48), circ(12.6, 48), 0, 2.2));
  pole(2.2, 7.9);
  plate(9.5, 46);
  tierCakes(0, false).forEach(cupcake);
  pole(9.5, 31.9);
  plate(33.5, 32);
  tierCakes(1, false).forEach(cupcake);
  pole(33.5, 53.9);
  plate(55.5, 19);
  tierCakes(2, false).forEach(cupcake);
  pole(55.5, 61);
  const ball = [];
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI - Math.PI / 2; ball.push(...ringAt(P, circ(3 * Math.cos(a), 16), 63.5 + 3 * Math.sin(a))); }
  mk("path", { class: "sil", d: poly(hull(ball)) }, g);
  [2, 1, 0].forEach((t) => tierCakes(t, true).forEach(cupcake));

  function draw(c) {
    const lift = c.sp.x;
    if (Math.abs(lift - c.last) < 1e-3) return;
    c.last = lift;
    const z = c.z0 + lift, zt = z + 5.5, { x, y } = c;
    c.cs.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 4.6), z).concat(ringAt(P, disc(x, y, 6), zt)))));
    const pleats = [];
    for (let i = 0; i < 5; i++) {
      const th = ((50 + i * 20 - 45) * Math.PI) / 180, cx = Math.cos(th), sy = Math.sin(th);
      pleats.push(seg(P(x + 4.6 * cx, y + 4.6 * sy, z), P(x + 6 * cx, y + 6 * sy, zt - 0.4)));
    }
    c.pl.setAttribute("d", pleats.join(""));
    const dome = [];
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); dome.push(...ringAt(P, disc(x, y, 6.8 * Math.cos(a) + 0.01), zt + 6.2 * Math.sin(a))); }
    dome.push(...ringAt(P, disc(x + 0.6, y - 0.6, 1.4, 12), zt + 8.2));
    c.fr.setAttribute("d", poly(hull(dome)));
    c.sw.setAttribute("d", [[6.8, 0.2], [5.6, 3.2], [3.4, 5.4]].map(([r, h]) => open(ringAt(P, run(disc(x, y, r), front), zt + h))).join(""));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cakes) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  // the hit: each cupcake tests the pointer on its own rest top, the nearest middle wins
  let pt = null;
  function retarget() {
    const ds = cakes.map((c) => {
      if (!pt) return Infinity;
      const [wx, wy] = unproj(C, pt[0], pt[1], c.z0 + REST[c.t][c.j] + 6);
      return Math.hypot(wx - c.x, wy - c.y);
    });
    let a = -1;
    ds.forEach((d, k) => { if (d < HIT && (a < 0 || d < ds[a])) a = k; });
    cakes.forEach((c, k) => {
      const f = a < 0 ? 0 : k === a ? 1 : clamp(0.6 * Math.exp(-((ds[k] / reach) ** 2)), 0.09, 0.6);
      c.sp.t = a < 0 ? REST[c.t][c.j] : LIFT * f;
      const on = a < 0 ? c.t === FAV[0] && c.j === FAV[1] : k === a;
      c.cs.classList.toggle("hi", on);
      c.fr.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "cupcake " + (cakes[a].t + 1) + "·" + (cakes[a].j + 1);
    B.wake();
  }
  retarget();
  bag.add(pointer(stage, { move: (p) => { pt = p; retarget(); }, leave: () => { pt = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cupcakestand",
  means: "A three-tier stand of nine cupcakes: those near the pointer rise, the one under it highest and bright.",
  rules: [1, 3, 5, 8],
  range: [10, 22, 36],
  tour: [[256, 221], [200, 167], [221, 103], null],
  mount,
});
