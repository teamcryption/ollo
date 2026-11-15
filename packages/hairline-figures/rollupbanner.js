/**
 * Roll-up banner: a printed banner pulled up out of its floor cassette, held
 * by a rear pole, a rail along its top. The pointer's height is where the
 * top rail goes: the banner slides up or rolls back into the cassette on a
 * spring. At rest it stands most of the way up, its rail bright. The slider
 * is how quickly it follows.
 */
const { Cam, clamp, facing, fit, poly, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;
const HW = 36, HMAX = 124, HMIN = 14, REST = 104, BZ = 7;
const at = (s, z, y = 0) => [s * 0.7071 + y * 0.7071, -s * 0.7071 + y * 0.7071, z];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [at(-HW - 3, 0, -8), at(HW + 3, 0, 8), at(0, HMAX + 3), at(-HW - 3, 0, 8), at(HW + 3, 0, -8)], 200, 166);
  const P = proj(C), front = facing(C), Q = (s, z, y) => P(...at(s, z, y));
  const g = mk("g", {}, svg);
  const poleEl = mk("path", { class: "nf lo" }, g);
  const ban = mk("path", { class: "sil" }, g);
  const band = mk("path", { class: "nf lo" }, g);
  const rail = mk("path", { class: "nf sil hi" }, g);
  const turnRing = (r) => r.map((q) => { const [u, v] = at(q.u, 0, q.v); return { u, v, nu: q.nu * 0.7071 + q.nv * 0.7071, nv: -q.nu * 0.7071 + q.nv * 0.7071 }; });
  const [r0, r1] = rings(-HW - 2, -5, HW + 2, 5, 3, 1.2);
  put(solid(g), prism(P, front, turnRing(r0), turnRing(r1), 0, BZ));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-3) return;
    drawn = sp.x;
    const h = sp.x;
    poleEl.setAttribute("d", seg(Q(0, BZ, -2), Q(0, h, -2)));
    ban.setAttribute("d", poly([Q(-HW, BZ), Q(HW, BZ), Q(HW, h), Q(-HW, h)]));
    band.setAttribute("d", seg(Q(-HW + 6, BZ + (h - BZ) * 0.3), Q(HW - 6, BZ + (h - BZ) * 0.3)) + seg(Q(-HW + 6, h - 12), Q(HW - 22, h - 12)));
    rail.setAttribute("d", poly([Q(-HW - 1, h), Q(HW + 1, h), Q(HW + 1, h + 2.5), Q(-HW - 1, h + 2.5)]));
  }
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(L.unregister);
  const sx0 = Q(-HW - 24, 0)[0], sx1 = Q(HW + 24, 0)[0], base = Q(0, 0)[1], zs = base - Q(0, 1)[1];
  function set(z) {
    sp.t = z == null ? REST : clamp(z, HMIN, HMAX);
    read.textContent = z == null ? "rest" : Math.round((sp.t / HMAX) * 100) + "%";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(p[0] < sx0 || p[0] > sx1 || p[1] > base + 30 ? null : (base - p[1]) / zs),
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "rollupbanner",
  means: "A roll-up banner on its floor cassette: the banner slides up or rolls back down to the pointer's height.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 225], [160, 130], [200, 60], null],
  mount,
});
