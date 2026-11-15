/**
 * Steamer baskets: three round bamboo tiers stacked on a plate under a
 * domed lid, dumplings in each tier. The pointer picks a tier by its rest
 * height; every tier above it and the lid rise off it, staggered, to show
 * what is steaming inside. At rest the lid sits ajar, bright. The slider is
 * how far the stack opens.
 *
 * The pattern: one of a stack, opened above the choice.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, H = 11, R = 28, Z0 = 3, AJAR = 5;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const DUMP = [[[-10, -8], [9, -10], [0, 7], [-13, 9], [13, 6]], [[-8, 2], [8, -6], [6, 11]], [[0, -9], [-11, 6], [11, 6], [0, 0]]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [0, 0, Z0 + N * H + 3 * 26 + 16]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-40, -40, 40, 40, 14, 2);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));

  const tiers = [];
  for (let k = 0; k <= N; k++) {
    const grp = mk("g", {}, g);
    if (k < N) {
      const s = solid(grp), band = mk("path", { class: "nf lo" }, grp), rim = mk("path", { class: "nf lo" }, grp), buns = DUMP[k].map(() => mk("path", {}, grp));
      tiers.push({ k, grp, s, band, rim, buns, z: tween(0), last: NaN });
    } else tiers.push({ k, grp, lid: mk("path", { class: "sil" }, grp), lrim: mk("path", { class: "nf lo" }, grp), knob: mk("path", {}, grp), z: tween(AJAR), last: NaN });
  }
  const lid = tiers[N];

  function draw(t, dz) {
    if (dz === t.last) return;
    t.last = dz;
    const b = Z0 + t.k * H + dz;
    if (t.lid) {
      const pts = [];
      for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(0, 0, (R + 1) * Math.cos(a) + 3 * Math.sin(a)), b + 13 * Math.sin(a))); }
      t.lid.setAttribute("d", poly(hull(pts.concat(ringAt(P, disc(0, 0, R + 1), b)))));
      t.lrim.setAttribute("d", poly(ringAt(P, disc(0, 0, R - 2), b + 3)));
      t.knob.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 4, 20), b + 13).concat(ringAt(P, disc(0, 0, 3, 20), b + 17)))));
      return;
    }
    put(t.s, prism(P, front, disc(0, 0, R), disc(0, 0, R - 2.2), b, b + H));
    t.band.setAttribute("d", poly(ringAt(P, disc(0, 0, R), b + H * 0.45)).replace(/Z$/, ""));
    t.rim.setAttribute("d", poly(ringAt(P, disc(0, 0, R - 2.2), b + H)));
    DUMP[t.k].forEach(([x, y], i) => t.buns[i].setAttribute("d", poly(hull(ringAt(P, disc(x, y, 5.5, 18), b + H - 3).concat(ringAt(P, disc(x, y, 3.2, 18), b + H + 1.5), ringAt(P, disc(x, y, 0.8, 8), b + H + 3))))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tiers) { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tiers.slice(0, N).map((t) => P(0, 0, Z0 + t.k * H + H / 2));
  const cx = P(0, 0, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - cx) > R * 2.6) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    for (const t of tiers) {
      const up = a < 0 ? (t.lid ? AJAR : 0) : t.k > a ? (t.k - a) * gap : 0;
      tset(t.z, up, now, a < 0 ? 0 : Math.abs(t.k - a - 1) * 45);
      (t.lid ? t.lid : t.s.sil).classList.toggle("hi", a < 0 ? !!t.lid : t.k === a);
    }
    read.textContent = a < 0 ? "rest" : "tier " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gap = v; act = -2; }, destroy: bag.dispose };
}

hairline({
  name: "dumpling",
  means: "Stacked steamer baskets under a lid: the tier under the pointer opens, everything above it rising off to show the dumplings.",
  rules: [1, 2, 5, 6],
  range: [14, 22, 26],
  tour: [[200, 197], [200, 218], [200, 240], null],
  mount,
});
