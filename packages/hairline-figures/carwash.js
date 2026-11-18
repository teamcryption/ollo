/**
 * Car wash: a car parked on a wash bay, and over it a gantry arch on two
 * legs carrying a pair of tall side brushes and one long top brush. The
 * pointer over the bay sends the arch rolling along the car, its brushes
 * spinning as it goes; leaving rolls it back to its rest at the car's nose,
 * its beam bright. The slider is how far the arch travels.
 *
 * The pattern: one part answering the whole figure (hover in a fixed box).
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FX = 52, FY = 30, LY = 25, TOP = 38, REST = -34;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  const ext = [[-FX, -FY, 0], [FX, FY, 0], [-FX, FY, 0], [FX, -FY, 0], [REST, -LY, TOP + 4], [REST + 80, LY, TOP + 4], [REST, LY, TOP + 4]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const blk = (par, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(par), prism(P, front, o, i, z0, z1)); };
  blk(g, -FX, -FY, FX, FY, 5, 1.6, -2.5, 0);                     // bay floor
  mk("path", { class: "nf dash", d: seg(P(-FX + 6, -LY, 0), P(FX - 6, -LY, 0)) + seg(P(-FX + 6, LY, 0), P(FX - 6, LY, 0)) }, g);
  const far = mk("g", {}, svg);
  const car = mk("g", {}, svg);
  for (const x of [-16, 16]) for (const y of [-11.4, 11.4]) put(solid(car), prism(P, front, disc(x, y, 3, 16), null, 0, 3));
  blk(car, -27, -11, 27, 11, 6, 1.6, 3, 13);                     // car body
  blk(car, -12, -9, 12, 9, 5, 1.4, 13, 21);                      // cabin
  const near = mk("g", {}, svg), topg = mk("g", {}, svg);
  const S = (par) => solid(par);
  const legF = S(far), brF = S(far), legN = S(near), brN = S(near), tbr = S(topg), beam = S(topg);
  beam.sil.classList.add("hi");
  const marks = [brF, brN, tbr].map((s) => mk("path", { class: "nf lo" }, s.g));

  const a = tween(REST);
  let last = NaN;
  function vbrush(s, m, x, y, ph) {
    put(s, prism(P, front, disc(x, y, 4.8), disc(x, y, 3.8), 4, TOP - 1));
    let d = "";
    for (let k = 0; k < 6; k++) {
      const q = ph + (k * Math.PI) / 3, nx = Math.cos(q), ny = Math.sin(q);
      if (nx + ny > 0.2) d += seg(P(x + 4.8 * nx, y + 4.8 * ny, 7), P(x + 4.8 * nx, y + 4.8 * ny, TOP - 4));
    }
    m.setAttribute("d", d);
  }
  function draw(x) {
    if (x === last) return;
    last = x;
    const ph = x * 0.18;
    for (const [leg, y] of [[legF, -LY], [legN, LY]]) {
      const [o, i] = rings(x - 3, y - 3, x + 3, y + 3, 1.4, 0.7);
      put(leg, prism(P, front, o, i, 0, TOP));
    }
    vbrush(brF, marks[0], x, -LY + 8, ph);
    vbrush(brN, marks[1], x, LY - 8, -ph);
    const [o, i] = rings(x - 4, -LY - 4, x + 4, LY + 4, 2, 1);
    put(beam, prism(P, front, o, i, TOP, TOP + 4));
    const pts = [];
    for (const y of [-13, 13]) for (let k = 0; k < 16; k++) { const q = (k / 16) * Math.PI * 2; pts.push(P(x + 5 * Math.cos(q), y, 31 + 5 * Math.sin(q))); }
    tbr.sil.setAttribute("d", poly(hull(pts)));
    tbr.cr.setAttribute("d", "");
    let d = "";
    for (let k = 0; k < 6; k++) {
      const q = ph + (k * Math.PI) / 3, nx = Math.cos(q), nz = Math.sin(q);
      if (nx + nz > 0.1) d += seg(P(x + 5 * nx, -11, 31 + 5 * nz), P(x + 5 * nx, 11, 31 + 5 * nz));
    }
    marks[2].setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    const x = tval(a, now);
    draw(x);
    return !tdone(a, now);
  });
  bag.add(B.unregister);

  // the hit: a fixed screen box around the bay and the arch at rest
  const sp = ext.map((q) => P(...q));
  const xs = sp.map((q) => q[0]), ys = sp.map((q) => q[1]);
  const inBox = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(a, v ? REST + reach : REST, performance.now(), 0);
    read.textContent = v ? "wash" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inBox(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(a, REST + v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "carwash",
  means: "A car wash: the gantry arch with its spinning brushes rolls along the parked car under the pointer, and back on leaving.",
  rules: [1, 3, 5, 6, 8],
  range: [30, 55, 80],
  tour: [[200, 170], [230, 190], [170, 150], null],
  mount,
});
