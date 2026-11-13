/**
 * Stacking rings: a toy peg on a round base with five rings of shrinking
 * size threaded on it. The pointer's height picks a ring: it and every ring
 * above it lift off the peg together, staggered from it, and the chosen ring
 * is bright. At rest the top ring sits a little raised, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a stack; the hit reads the rings' rest heights.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RADII = [27, 23, 19.5, 16, 12.5], H = 7.5, BZ = 5, PEG = 5, PT = BZ + RADII.length * H + 7, LIFT = 22, FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-33, -33, 0], [33, 33, 0], [33, -33, 0], [-33, 33, 0], [-14, -14, PT + LIFT + 4], [14, 14, PT + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(32, 64), circ(30, 64), 0, BZ));
  const base = solid(g); // the peg's first stretch, under the bottom ring

  const rings = RADII.map((R, k) => {
    const grp = mk("g", {}, g);
    return { k, R, grp, s: solid(grp), hole: mk("path", { class: "nf lo" }, grp), peg: solid(grp), z: tween(k === FAV ? 6 : 0), last: NaN };
  });
  const knob = solid(g);
  const z0 = (k) => BZ + k * H;
  let drawn = "";

  function draw(now) {
    const zs = rings.map((r) => z0(r.k) + tval(r.z, now)), key = zs.map((z) => z.toFixed(2)).join();
    if (key === drawn) return;
    drawn = key;
    const pegTo = (a, b) => (b > a + 0.05 ? prism(P, front, circ(PEG, 24), null, a, b) : { sil: "", crease: "" });
    put(base, pegTo(BZ, Math.min(zs[0], PT)));
    rings.forEach((r, k) => {
      const z = zs[k], top = z + H;
      put(r.s, prism(P, front, circ(r.R, 56), circ(r.R - 2.2, 56), z, top));
      r.hole.setAttribute("d", poly(ringAt(P, circ(PEG + 1.4, 24), top)));
      const next = k + 1 < rings.length ? zs[k + 1] : Infinity;
      put(r.peg, top < PT ? pegTo(top, Math.min(next, PT)) : { sil: "", crease: "" });
    });
    put(knob, prism(P, front, circ(PEG + 1.5, 24), circ(PEG, 24), PT, PT + 3));
    const above = rings.find((r, k) => zs[k] > PT + 2);
    if (above) above.grp.before(knob.g); else rings[rings.length - 1].grp.after(knob.g);
  }

  const B = register(stage, (_dt, now) => {
    draw(now);
    return rings.some((r) => !tdone(r.z, now));
  });
  bag.add(B.unregister);

  const mids = rings.map((r) => P(0, 0, z0(r.k) + H / 2)), cx = P(0, 0, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - cx) > 80) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    rings.forEach((r, k) => {
      const z = a < 0 ? (k === FAV ? 6 : 0) : k >= a ? LIFT : 0;
      tset(r.z, z, now, a < 0 ? 0 : Math.abs(k - a) * stag);
      r.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stackingrings",
  means: "A toy peg with five stacked rings: the ring at the pointer's height and all above it lift off the peg together.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 244], [150, 207], [170, 134], null],
  mount,
});
