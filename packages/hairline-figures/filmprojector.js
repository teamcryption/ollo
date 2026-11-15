/**
 * Film projector: a body on a turntable base, two reels standing on top and a
 * lens barrel at the front. The projector turns on its base to aim the lens at
 * the pointer, a dashed beam thrown ahead of it, the reels riding along. At
 * rest it faces left of the viewer, the lens bright.
 *
 * The pattern: a continuous aim (one spring on yaw); the hit is the floor
 * plane, which never moves. Depth order of reels and lens swaps as it turns.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, rrect, seg, unproj, spring, stepS, hull, poly,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 8, TZ = 32, R = 15, REST = 2.0, BEAM = 26;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([30 * Math.cos(a), 30 * Math.sin(a), 0], [28 * Math.cos(a), 28 * Math.sin(a), TZ + 2 * R + 2]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  put(solid(g), prism(P, front, circ(24, 64), circ(22.6, 64), 0, 3));
  put(solid(g), prism(P, front, circ(6, 24), null, 3, BZ));
  const beam = mk("path", { class: "nf dash", d: "" }, g);
  const body = solid(g);
  const slot = mk("path", { class: "nf lo", d: "" }, body.g);
  const lens = mk("g", {}, g), barrel = mk("path", { class: "sil", d: "" }, lens), glass = mk("path", { class: "lo", d: "" }, lens);
  const reels = [0, 1].map(() => { const gg = mk("g", {}, g); return { g: gg, rim: mk("path", { class: "sil", d: "" }, gg), sp: mk("path", { class: "nf lo", d: "" }, gg) }; });
  const [BR, BI] = rings(-20, -12, 20, 12, 4, 1.4);

  const yaw = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, order = "";

  // a vertical disc: centre c, spanned by horizontal unit h and z
  const vdisc = (cx, cy, cz, hx, hy, r, n = 36) => {
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(P(cx + hx * r * Math.cos(t), cy + hy * r * Math.cos(t), cz + r * Math.sin(t))); }
    return out;
  };

  function draw() {
    const a = yaw.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const ca = Math.cos(a), sa = Math.sin(a);
    put(body, prism(P, front, turn(BR, a), turn(BI, a), BZ, TZ));
    slot.setAttribute("d", seg(P(-8 * ca - 13 * -sa, -8 * sa - 13 * ca, BZ + 6), P(-8 * ca - 13 * -sa, -8 * sa - 13 * ca, TZ - 6)));
    // lens barrel along +d from the front face, glass face at its tip
    const lx0 = 20 * ca, ly0 = 20 * sa, lx1 = 30 * ca, ly1 = 30 * sa, lz = 20;
    const back = vdisc(lx0, ly0, lz, -sa, ca, 6, 24), tip = vdisc(lx1, ly1, lz, -sa, ca, 6.5, 24);
    barrel.setAttribute("d", poly(hull(back.concat(tip))));
    glass.setAttribute("d", poly(tip) + poly(vdisc(lx1, ly1, lz, -sa, ca, 3.5, 20)));
    const bx = (30 + BEAM) * ca, by = (30 + BEAM) * sa;
    beam.setAttribute("d", seg(P(lx1, ly1, lz + 6), P(bx - 14 * sa, by + 14 * ca, lz + 14)) + seg(P(lx1, ly1, lz - 6), P(bx + 14 * sa, by - 14 * ca, lz - 10)));
    const cs = [[-10, 0], [11, 0]];
    reels.forEach((r, i) => {
      const cx = cs[i][0] * ca, cy = cs[i][0] * sa, cz = TZ + R + 1, rr = i ? R - 3 : R;
      r.rim.setAttribute("d", poly(vdisc(cx, cy, cz, ca, sa, rr)));
      let sp = poly(vdisc(cx, cy, cz, ca, sa, 2.5, 12));
      for (let k = 0; k < 3; k++) { const t = k * 2.094 + i; sp += seg(P(cx + ca * 3 * Math.cos(t), cy + sa * 3 * Math.cos(t), cz + 3 * Math.sin(t)), P(cx + ca * (rr - 2) * Math.cos(t), cy + sa * (rr - 2) * Math.cos(t), cz + (rr - 2) * Math.sin(t))); }
      r.sp.setAttribute("d", sp);
      r.depth = cx + cy;
    });
    // paint order: beam and lens behind the body when the lens faces away
    const lensFront = ca + sa > 0, rf = reels[0].depth < reels[1].depth;
    const key = (lensFront ? "f" : "b") + (rf ? "0" : "1");
    if (key !== order) {
      order = key;
      const [a0, a1] = rf ? [reels[0], reels[1]] : [reels[1], reels[0]];
      const seq = lensFront ? [body.g, a0.g, a1.g, beam, lens] : [beam, lens, body.g, a0.g, a1.g];
      for (const el of seq) g.appendChild(el);
    }
    barrel.classList.add("hi");
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(w) {
    const t = w ? Math.atan2(w[1], w[0]) : REST;
    yaw.t = yaw.t + wrap(t - yaw.t);
    read.textContent = w ? ((Math.round((t * 180) / Math.PI) + 360) % 360) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y); aim(d > 10 && d < 120 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { yaw.k = 100 * v; yaw.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "filmprojector",
  means: "A film projector on a turntable: it turns to aim its lens and beam at the pointer, both reels riding along on top.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[324, 243], [165, 181], [138, 283], null],
  mount,
});
