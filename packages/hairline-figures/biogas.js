/**
 * Biogas dome: a floating-drum digester on a farm slab, a round tank with
 * a domed gas drum riding in its mouth, a feed inlet behind and a slurry
 * chute in front. The pointer's place across the figure is how much gas the
 * drum holds: the drum rises out of the tank on a spring as it fills. At
 * rest it floats a third up, bright. The slider is the drum's full rise.
 *
 * The pattern: one value, one part (a gauge).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TR = 34, TZ = 30, DR = 29, DH = 10, DOME = 11, BZ = 4, REST = 0.25;
const disc = (x, y, r, n = 56) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-62, -48, 0], [48, 70, 0], [48, -48, 0], [-62, 70, 0], [0, 0, TZ + DH + DOME + 54]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-62, -48, 48, 70, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, BZ));
  // the feed inlet, behind the tank, and its pipe in
  put(solid(g), prism(P, front, disc(-46, -6, 9, 32), disc(-46, -6, 7.4, 32), BZ, BZ + 18));
  put(solid(g), prism(P, front, disc(-46, -6, 6, 24), disc(-46, -6, 4.6, 24), BZ + 18, BZ + 19));
  // the tank
  put(solid(g), prism(P, front, disc(0, 0, TR), disc(0, 0, TR - 2.2), BZ, TZ));
  mk("path", { d: poly(ringAt(P, disc(0, 0, DR + 1.4), TZ)), class: "lo" }, g);
  // the drum: wall from the tank's mouth up, then the dome, with its gas valve
  const drum = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g);
  const valve = solid(g);
  // the slurry chute, in front
  const [cr, ci] = rings(-9, 38, 9, 60, 3, 1.4);
  put(solid(g), prism(P, front, cr, ci, BZ, BZ + 12));
  const [cr2, ci2] = rings(-6, 41, 6, 57, 2, 1.2);
  mk("path", { d: poly(ringAt(P, cr2, BZ + 12)), class: "lo" }, g);
  void ci2;

  const lvl = spring(REST);
  let last = NaN;
  function draw(t) {
    const v = Math.round(t * 1000) / 1000;
    if (v === last) return;
    last = v;
    const z1 = TZ + DH * 0.4 + v * rise, pts = ringAt(P, disc(0, 0, DR), TZ);
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(0, 0, DR * Math.cos(a), 40), z1 + DOME * Math.sin(a))); }
    drum.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", open(ringAt(P, run(disc(0, 0, DR - 1.6), front), z1)));
    const vz = z1 + DOME;
    put(valve, prism(P, front, disc(0, 0, 3, 16), disc(0, 0, 2, 16), vz - 0.5, vz + 4));
  }

  const B = register(stage, (dt) => {
    const m = stepS(lvl, dt);
    draw(lvl.x);
    return m;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  let shown = "";
  function aim(t) {
    lvl.t = t;
    const s = t === REST ? "rest" : "gas " + Math.round(t * 100) + "%";
    if (s !== shown) { shown = s; read.textContent = s; }
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(Math.round(clamp((sx - cx + 70) / 140, 0, 1) * 20) / 20 || 0.001),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rise = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "biogas",
  means: "A floating-drum biogas digester: the pointer's place across it is how full of gas the drum is, and the drum rises out of the tank.",
  rules: [1, 3, 5, 8],
  range: [12, 46, 52],
  tour: [[150, 160], [240, 170], [290, 178], null],
  mount,
});
