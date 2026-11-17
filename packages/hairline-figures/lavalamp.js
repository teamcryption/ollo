/**
 * Lava lamp: a tapered glass on a cone base under a small cap, with a big
 * wax blob inside. The pointer, moving up the glass, floats the blob up
 * with it, stretching as it rises. At rest the blob sits low, bright.
 * The slider is how high the blob can float.
 *
 * The pattern: one part sliding on its rail.
 */
const {
  Cam, circ, clamp, fit, hull, poly, proj, ringAt, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const BZ = 26, GZ = 96, R0 = 18, R1 = 9, REST = 0.12;
const disc = (r, n = 40) => circ(r, n);
const rAt = (z) => R0 + ((R1 - R0) * (z - BZ)) / (GZ - BZ);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [24, 24, 0], [0, 0, GZ + 14]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shell = (rings, cls) => mk("path", { d: poly(hull(rings.flatMap(([r, z]) => ringAt(P, disc(r), z)))), class: cls }, g);
  // the glass, open so the blob shows through
  shell([[R0, BZ], [R0 + 2, BZ + 20], [R1, GZ]], "nf");
  const blob = mk("path", { class: "nf sil hi" }, g), small = mk("path", { class: "nf" }, g);
  // the cone base and the cap
  shell([[23, 0], [16, BZ]], "");
  mk("path", { d: poly(ringAt(P, disc(16), BZ)), class: "nf lo" }, g);
  shell([[R1, GZ], [5, GZ + 12]], "");
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const t = sp.x * reach;
    if (t === drawn) return;
    drawn = t;
    const zc = BZ + 14 + t * 44, h = 8 + 7 * t, pts = [];
    for (let k = -3; k <= 3; k++) { const z = zc + (h * k) / 3, r = Math.min(rAt(z) - 2, 10 - 2 * t) * Math.sqrt(1 - (k / 3.2) ** 2); pts.push(...ringAt(P, disc(r, 24), z)); }
    blob.setAttribute("d", poly(hull(pts)));
    const z2 = BZ + 6 + (1 - t) * 30, r2 = Math.min(3.5, rAt(z2) - 2), sp2 = [];
    for (const k of [-1, 0, 1]) sp2.push(...ringAt(P, disc(r2 * (k ? 0.6 : 1), 16), z2 + k * 3));
    small.setAttribute("d", poly(hull(sp2)));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const lo = P(0, 0, BZ + 14)[1], hi = P(0, 0, BZ + 58)[1];
  function set(t) {
    sp.t = t;
    read.textContent = t === REST ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  set(REST);
  bag.add(pointer(stage, {
    move: ([, sy]) => set(Math.round(clamp((lo - sy) / (lo - hi), 0.12, 1) * 20) / 20),
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "lavalamp",
  means: "A lava lamp with a wax blob in its glass: moving up the glass floats the blob up with it, stretching as it rises.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[200, 200], [200, 130], [200, 68], null],
  mount,
});
