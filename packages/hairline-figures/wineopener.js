/**
 * Wine opener: a bottle standing on a coaster with a lever corkscrew clamped
 * on its neck. The pointer sweeps the long lever over the top on a spring:
 * the further left it goes, the higher the lever swings and the further the
 * cork draws out of the neck. At rest the lever lies forward, part raised,
 * bright. The slider is how far the lever may swing.
 *
 * The pattern: one part turning on a pivot, following the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, fillet, hull, lerp, poly, prism, proj, ringAt, rings, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 17, NZ = 96, OZ = 104, OH = 16, L = 70, REST = 22;
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.7);
  const top = OZ + OH;
  fit(C, [[-26, -26, 0], [26, 26, 0], [L + 4, 0, top + 34], [-L * 0.95, 0, top + L * 0.4], [0, 0, top + L + 6]], 200, 154);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-26, -26, 26, 26, 22, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 4));
  // the bottle: body, then a shoulder that tapers into the neck
  put(solid(g), prism(P, front, disc(R), disc(R - 2), 4, 64));
  const sh = [];
  for (const [r, z] of [[R, 64], [R * 0.85, 74], [R * 0.55, 82], [6.5, 88], [6.5, NZ]]) sh.push(...ringAt(P, disc(r), z));
  mk("path", { d: poly(hull(sh)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 1.5), 40)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 1.5), 22)), class: "nf lo" }, g);
  // the cork, drawn out of the neck
  const cork = solid(g);
  // the opener's body clamped on the neck, with its pivot pin
  const og = mk("g", {}, g);
  const [orr, oi] = rings(-9, -9, 9, 9, 6, 1.6);
  put(solid(og), prism(P, front, orr, oi, OZ - 12, OZ + OH));
  const lev = mk("g", {}, g);
  const ls = mk("path", { class: "sil hi" }, lev), lc = mk("path", { class: "nf lo" }, lev);
  const sp = spring(REST);
  let last = NaN;

  // a point on the lever: s along it from the pivot, w across, h up from its face
  const at = (a, s, w, h) => {
    const c = Math.cos(rad(a)), n = Math.sin(rad(a));
    return P(s * c - h * n, w, top + s * n + h * c);
  };
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const w of [-6, 6]) for (const [s, h] of [[-6, -3], [L, -3], [L, 3], [-6, 3]]) pts.push(at(a, s, w, h));
    const hl = hull(pts);
    ls.setAttribute("d", poly(fillet(hl, hl.map(() => 3))));
    lc.setAttribute("d", poly(fillet([[2, -3.5, 3], [L - 6, -3.5, 3], [L - 6, 3.5, 3], [2, 3.5, 3]].map(([s, w, h]) => at(a, s, w, h)), [2, 2, 2, 2])));
    const lift = clamp((a - REST) / (150 - REST), 0, 1) * 30;
    put(cork, prism(P, front, disc(4.6, 20), disc(3.4, 20), OZ + OH - 14 + lift, OZ + OH + 2 + lift));
    // past upright the lever passes behind the opener's body
    if (a > 95) og.after(lev); else lev.after(og);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const mid = P(0, 0, 60)[0];
  function move([sx, sy]) {
    const t = clamp((mid + 70 - sx) / 140, 0, 1);
    sp.t = lerp(REST, reach, t);
    read.textContent = "lever " + Math.round(sp.t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "wineopener",
  means: "A lever corkscrew on a wine bottle: the pointer sweeps the long lever up over the top and the cork draws out of the neck.",
  rules: [1, 3, 5, 8],
  range: [90, 150, 170],
  tour: [[292, 194], [195, 194], [99, 194], null],
  mount,
});
