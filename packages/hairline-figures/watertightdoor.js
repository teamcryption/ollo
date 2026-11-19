/**
 * Watertight door: a ship's bulkhead with a tall round-cornered doorway over
 * a raised sill, its heavy leaf hung on the right. A handwheel sits in the
 * middle of the leaf and six dogs clamp its edges. Under the pointer the
 * wheel spins, the dogs swing up off the frame and the leaf swings wide
 * open on its hinge. At rest it stands just ajar, the wheel bright. The
 * slider is how far the leaf swings.
 *
 * The pattern: one part answering (a hinge swing on the discrete clock);
 * the hit is the doorway's resting box on screen, which never moves.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, proj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const DW = 54, DH = 86, SILL = 12, WX = 50, WZ = SILL + DH + 12, WD = 8, LT = 4, HX = DW / 2 + 2, LW = DW + 4, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.05);
  const ex = [[-WX, -WD, 0], [WX, -WD, 0], [WX, 0, 0], [-WX, 0, 0], [-WX, -WD, WZ], [WX, -WD, WZ], [-WX, 0, WZ]];
  for (const t of [0, 60, 110]) { const c = Math.cos(rad(t)), s = Math.sin(rad(t)); ex.push([HX - LW * c, LW * s + 8, SILL - 2], [HX - LW * c, LW * s + 8, SILL + DH + 2]); }
  fit(C, ex, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the bulkhead: a slab, its doorway cut through, the hole's far edge seen inside
  const outer = fillet([[-WX, 0], [WX, 0], [WX, WZ], [-WX, WZ]], [3, 3, 3, 3], 4);
  const hole = fillet([[-DW / 2, SILL], [DW / 2, SILL], [DW / 2, SILL + DH], [-DW / 2, SILL + DH]], [8, 8, 16, 16], 6);
  const at = (pts, y) => pts.map(([x, z]) => P(x, y, z));
  mk("path", { class: "sil", d: poly(hull(at(outer, 0).concat(at(outer, -WD)))) }, g);
  mk("path", { class: "nf lo", d: poly(at(hole, -WD)) }, g);
  mk("path", { class: "fo", d: poly(at(outer, 0)) + poly(at(hole, 0).reverse()) }, g);
  mk("path", { class: "nf lo", d: poly(at(outer, 0)) }, g);
  mk("path", { class: "nf", d: poly(at(hole, 0)) }, g);
  for (const z of [SILL + 16, SILL + DH - 16]) mk("path", { class: "sil", d: poly(hull([-2, 0, 2].flatMap((dz) => [P(HX, 0, z + dz * 3), P(HX + 3, 2, z + dz * 3)]))) }, g);

  // the leaf, hung at x = HX: local u runs from the hinge across, n out of its face
  const face = fillet([[0, SILL - 2], [LW, SILL - 2], [LW, SILL + DH + 2], [0, SILL + DH + 2]], [10, 10, 18, 18], 6);
  const leaf = mk("path", { class: "sil" }, g), leafCr = mk("path", { class: "nf lo" }, g);
  const dogs = mk("path", { class: "nf sil" }, g);
  const hub = mk("path", { class: "sil hi" }, g), wheel = mk("path", { class: "nf sil hi" }, g);
  const ZM = SILL + DH / 2, UM = LW / 2 + 1;
  const DOGS = [[4, SILL + 12, 1], [4, ZM, 1], [4, SILL + DH - 12, 1], [LW - 4, SILL + 12, -1], [LW - 4, ZM, -1], [LW - 4, SILL + DH - 12, -1]];

  const tw = tween(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const W = (u, n, z) => P(HX - u * c + n * s, u * s + n * c, z);
    const F = (n) => face.map(([u, z]) => W(u, n, z));
    leaf.setAttribute("d", poly(hull(F(0).concat(F(LT)))));
    leafCr.setAttribute("d", poly(F(LT)));
    const k = clamp((th - REST) / 25, 0, 1), spin = rad(th) * 2.4;
    let dd = "";
    for (const [u, z, side] of DOGS) {
      const a = side > 0 ? Math.PI - k * Math.PI / 2 : k * Math.PI / 2;
      const p0 = W(u, LT + 1.5, z), p1 = W(u + 9 * Math.cos(a), LT + 1.5, z + 9 * Math.sin(a));
      dd += `M${p0[0]},${p0[1]}L${p1[0]},${p1[1]}`;
    }
    dogs.setAttribute("d", dd);
    const ring = (r, n, cu = UM, cz = ZM, m = 40) => Array.from({ length: m }, (_, i) => { const t = (i / m) * Math.PI * 2; return W(cu + r * Math.cos(t), n, cz + r * Math.sin(t)); });
    hub.setAttribute("d", poly(hull(ring(3.5, LT, UM, ZM, 16).concat(ring(3.5, LT + 7, UM, ZM, 16)))));
    let wd = poly(ring(15, LT + 7)) + poly(ring(13, LT + 7));
    for (let i = 0; i < 4; i++) {
      const t = spin + (i * Math.PI) / 2, p0 = W(UM + 3.5 * Math.cos(t), LT + 7, ZM + 3.5 * Math.sin(t)), p1 = W(UM + 13 * Math.cos(t), LT + 7, ZM + 13 * Math.sin(t));
      wd += `M${p0[0]},${p0[1]}L${p1[0]},${p1[1]}`;
    }
    wheel.setAttribute("d", wd);
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, ZM), top = P(0, 0, SILL + DH), bot = P(0, 0, SILL);
  function hit([sx, sy]) { return Math.abs(sx - mid[0]) < 60 && sy > top[1] - 30 && sy < bot[1] + 30; }
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? swing : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { swing = clamp(v, 40, 110); if (on) { tset(tw, swing, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "watertightdoor",
  means: "A ship's watertight door: under the pointer the handwheel spins, the dogs swing free and the heavy leaf swings open.",
  rules: [1, 5, 6, 8],
  range: [40, 80, 110],
  tour: [[194, 158], [194, 100], [194, 221], null],
  mount,
});
