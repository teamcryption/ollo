/**
 * Tower crane: a lattice mast on a footing, a jib and a counter-jib with its
 * counterweight, a trolley running on the jib and a hook block on its cable,
 * beside a stack of steel beams. The pointer is where the load should go: the
 * jib slews to face it and the trolley runs out to its distance, both on
 * springs. The hook is the bright mark, at rest and answering. The slider is
 * how quickly the crane follows.
 *
 * The pattern: a continuous aim (spotlights); the hit is on the ground plane,
 * which never moves.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MH = 88, MW = 3.5, JL = 68, CJ = 24, JW = 1.6, JT = 4, HZ = 24, REST = [-35, 46];
const rot = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.85);
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push([JL * Math.cos(a), JL * Math.sin(a), MH + JT], [56 * Math.cos(a), 56 * Math.sin(a), HZ - 4]); }
  fit(C, pts.concat([[-16, -16, -4], [16, 16, -4], [0, 0, MH + 16]]), 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const box = (parent, x0, y0, x1, y1, z0, z1, r = 1, b = 0.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(g, -16, -16, 16, 16, -4, 0, 3, 1.2);
  const hookG = mk("g", {}, g);
  // the mast, with bracing on its two visible faces and the slewing cab at its head
  const mastG = mk("g", {}, g);
  box(mastG, -MW, -MW, MW, MW, 0, MH - 6, 0.8, 0.5);
  let br = "";
  for (let z = 0; z < MH - 10; z += 8) {
    br += seg(P(-MW + 0.6, MW, z), P(MW - 0.6, MW, z + 8)) + seg(P(MW, MW - 0.6, z), P(MW, -MW + 0.6, z + 8));
  }
  mk("path", { d: br, class: "nf lo" }, mastG);
  box(mastG, -MW - 1, -MW - 1, MW + 1, MW + 1, MH - 6, MH, 1.2, 0.6);
  // the beams, steel on the ground in front of the mast
  const stack = mk("g", {}, g);
  for (const [y0, z0, x0, x1] of [[18, 0, 26, 56], [23, 0, 26, 56], [28, 0, 26, 56], [20.5, 3, 29, 53], [25.5, 3, 29, 53]]) box(stack, x0, y0, x1, y0 + 4, z0, z0 + 3, 0.8, 0.5);
  const jibG = mk("g", {}, g);
  const cw = solid(jibG), trol = solid(jibG), jib = solid(jibG), apex = mk("path", { class: "nf" }, jibG), ties = mk("path", { class: "nf lo" }, jibG);
  const cable = mk("path", { class: "nf lo" }, hookG), hook = solid(hookG), curl = mk("path", { class: "nf hi" }, hookG);
  hook.sil.classList.add("hi");

  const ang = spring((REST[0] * Math.PI) / 180, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const dist = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "", inFront = null;

  function draw() {
    const key = ang.x.toFixed(4) + "," + dist.x.toFixed(2);
    if (key === last) return;
    last = key;
    const a = ang.x, d = dist.x, c = Math.cos(a), s = Math.sin(a);
    const R = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, b).map((ring) => rot(ring, a));
    const [cr, ci] = R(-CJ, -3, -CJ + 9, 3, 1, 0.6); put(cw, prism(P, front, cr, ci, MH - 5, MH));
    const [tr, ti] = R(d - 3, -2.2, d + 3, 2.2, 0.8, 0.5); put(trol, prism(P, front, tr, ti, MH - 3, MH));
    const [jr, ji] = R(-CJ, -JW, JL, JW, 1, 0.5); put(jib, prism(P, front, jr, ji, MH, MH + JT));
    const W = (u, z) => P(u * c, u * s, z);
    apex.setAttribute("d", seg(P(0, 0, MH + JT), P(0, 0, MH + 16)));
    ties.setAttribute("d", seg(P(0, 0, MH + 16), W(JL - 4, MH + JT)) + seg(P(0, 0, MH + 16), W(-CJ + 2, MH + JT)));
    const hx = d * c, hy = d * s;
    cable.setAttribute("d", seg(P(hx, hy, MH - 3), P(hx, hy, HZ + 4)));
    const [hr, hi] = rings(hx - 2, hy - 2, hx + 2, hy + 2, 1, 0.5); put(hook, prism(P, front, hr, hi, HZ, HZ + 4));
    curl.setAttribute("d", open([P(hx, hy, HZ), P(hx, hy, HZ - 3), P(hx + 1.6, hy + 1.6, HZ - 4.4), P(hx + 2.4, hy + 2.4, HZ - 2.6)]));
    // the hook is behind the mast when its ground point is farther than the mast's
    const f = hx + hy > 0;
    if (f !== inFront) { inFront = f; if (f) stack.after(hookG); else mastG.before(hookG); }
  }

  const B = register(stage, (dt) => { const m1 = stepS(ang, dt), m2 = stepS(dist, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  function aim(p) {
    let ta = (REST[0] * Math.PI) / 180, td = REST[1];
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r < JL + 30 && r > 4) { ta = Math.atan2(y, x); td = clamp(r, 12, JL - 6); } else p = null;
    }
    ta = ang.t + ((((ta - ang.t) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    ang.t = ta; dist.t = td;
    const deg = Math.round((((ta * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = p ? `slew ${deg}°` : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { ang.k = dist.k = 100 * v; ang.c = dist.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "towercrane",
  means: "A tower crane beside a stack of beams: the jib slews toward the pointer and the trolley runs out to its distance.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[292, 260], [102, 263], [230, 290], null],
  mount,
});
