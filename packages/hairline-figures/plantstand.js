/**
 * Plant stand: three boards stepping up between two stepped side panels,
 * two flared pots on each, and six houseplants with their own leaf shapes:
 * upright blades, a low rosette, arching fronds, broad round leaves on
 * stems, a little palm and trailing hearts, each leaf with its midrib. The
 * pointer picks a plant by the pot it stands over: it grows taller and
 * opens its leaves, and the plants beside it grow a little, staggered from
 * it. At rest the plants are unevenly grown, one ahead and bright. The
 * slider is the stagger.
 *
 * The pattern: stepped parts at different heights; the pointer is read on
 * each plant's own resting plane, nearest middle wins.
 */
const {
  Cam, circ, fillet, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 56, DEP = 13, PH = 7, FAV = 2;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// per plant: leaves, spread from az0, elevation el → el - open, length, width, widest point q, droop, stem height hb
const KINDS = [
  { n: 5, az0: 0.4, el: 82, open: 14, L: 17, w: 2.3, q: 0.9, droop: 0, hb: 0 },
  { n: 8, az0: 0, el: 38, open: 22, L: 7.5, w: 3.2, q: 1, droop: 0, hb: 0 },
  { n: 7, az0: 0.3, el: 55, open: 25, L: 15, w: 2.6, q: 1, droop: 0.55, hb: 0 },
  { n: 4, az0: 0.8, el: 40, open: 22, L: 11, w: 6.2, q: 0.8, droop: 0.15, hb: 5 },
  { n: 6, az0: 0.2, el: 28, open: 18, L: 10, w: 1.9, q: 1, droop: 0.45, hb: 9 },
  { n: 5, az0: 0.6, el: 18, open: 26, L: 8, w: 5, q: 0.6, droop: 0.9, hb: 1 },
];
const SPOT = [[15, 0], [41, 0], [14, 1], [40, 1], [16, 2], [42, 2]], REST = [0.15, 0.3, 0.7, 0, 0.25, 0.1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  const yOf = (t) => 2 * DEP - t * DEP + DEP / 2, zOf = (t) => 8 + 12 * t;
  fit(C, [[-2, 0, 0], [W + 2, 3 * DEP, 0], [W + 2, 0, 0], [-2, 3 * DEP, 0], [6, 0, zOf(2) + 40], [W - 6, 0, zOf(2) + 40], [0, 3 * DEP + 6, 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const prof = fillet([[3 * DEP, 0], [3 * DEP, 9], [2 * DEP, 9], [2 * DEP, 21], [DEP, 21], [DEP, 33], [0, 33], [0, 0]], [1, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1], 3);
  const panel = (x) => mk("path", { d: poly(prof.map(([y, z]) => P(x, y, z))) }, g);
  panel(-1.5);

  const plants = SPOT.map(([x, t], k) => ({ k, x, t, y: yOf(t), z0: zOf(t), kind: KINDS[k], gr: tween(REST[k]), last: NaN }));
  for (let t = 2; t >= 0; t--) {
    const [r, i] = rings(0, yOf(t) - DEP / 2, W, yOf(t) + DEP / 2, 1.4, 0.7);
    put(solid(g), prism(P, front, r, i, zOf(t) - 2, zOf(t)));
    for (const p of plants.filter((q) => q.t === t)) {
      p.grp = mk("g", {}, g);
      const foot = disc(p.x, p.y, 3.6), top = disc(p.x, p.y, 5.2);
      p.pot = solid(p.grp);
      put(p.pot, { sil: poly(hull(ringAt(P, foot, p.z0).concat(ringAt(P, top, p.z0 + PH)))), crease: open(ringAt(P, run(disc(p.x, p.y, 4.3), front), p.z0 + PH)) });
      p.stem = mk("path", { class: "nf" }, p.grp);
      p.leaves = []; p.ribs = [];
      for (let j = 0; j < p.kind.n; j++) { p.leaves.push(mk("path", {}, p.grp)); p.ribs.push(mk("path", { class: "nf lo" }, p.grp)); }
    }
  }
  panel(W + 1.5);

  function leaf(p, j, gr) {
    const K = p.kind, az = K.az0 + (j / K.n) * Math.PI * 2, el = ((K.el + 8 - K.open * 1.4 * gr) * Math.PI) / 180, L = K.L * (0.75 + 0.85 * gr);
    const hb = K.hb * (0.8 + 1.2 * gr) + 3 * gr + (K.n > 6 ? 0 : (j % 2) * 1.2), bx = p.x, by = p.y, bz = p.z0 + PH - 1 + hb;
    const d = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)], nx = -Math.sin(az), ny = Math.cos(az);
    const spine = (t) => [bx + d[0] * L * t, by + d[1] * L * t, bz + d[2] * L * t - K.droop * L * t * t * 0.7];
    const side = [], other = [], rib = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, s = spine(t), w = K.w * Math.pow(Math.sin(Math.PI * Math.pow(t, K.q)), 0.8) / 2;
      side.push(P(s[0] + nx * w, s[1] + ny * w, s[2])); other.unshift(P(s[0] - nx * w, s[1] - ny * w, s[2]));
      if (i > 0 && i < 9) rib.push(P(...s));
    }
    const tip = spine(1);
    return { depth: tip[0] + tip[1], d: poly(side.concat(other)), rib: open(rib), stem: hb > 0.5 ? seg(P(bx, by, p.z0 + PH - 1), P(bx, by, bz)) : "" };
  }
  function draw(p, gr) {
    if (gr === p.last) return;
    p.last = gr;
    const ls = [];
    for (let j = 0; j < p.kind.n; j++) ls.push(leaf(p, j, gr));
    ls.sort((a, b) => a.depth - b.depth);
    p.stem.setAttribute("d", ls.map((l) => l.stem).join(""));
    ls.forEach((l, j) => { p.leaves[j].setAttribute("d", l.d); p.ribs[j].setAttribute("d", l.rib); });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of plants) { draw(p, tval(p.gr, now)); if (!tdone(p.gr, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** Each plant's own resting plane, a little above its pot's rim; the plant whose middle the pointer lands nearest wins. */
  function hit([sx, sy]) {
    let best = -1, bd = 13;
    for (const p of plants) {
      const [x, y] = unproj(C, sx, sy, p.z0 + PH + 5), d = Math.hypot(x - p.x, y - p.y);
      if (d < bd) { bd = d; best = p.k; }
    }
    return best;
  }

  let act = -2;
  const dist = (a, b) => Math.abs(a.t - b.t) + Math.abs(Math.round((a.x - b.x) / 26));
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const p of plants) {
      const d = a >= 0 ? dist(p, plants[a]) : 0, gr = a < 0 ? REST[p.k] : d === 0 ? 1 : d === 1 ? Math.max(REST[p.k], 0.5) : REST[p.k];
      tset(p.gr, gr, now, from < 0 ? 0 : dist(p, plants[from]) * stag);
      p.on = p.k === (a < 0 ? FAV : a);
      p.pot.sil.classList.toggle("hi", p.on);
      for (const l of p.leaves) l.classList.toggle("hi", p.on);
    }
    read.textContent = a < 0 ? "rest" : "plant " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "plantstand",
  means: "A three-step plant stand of six houseplants: the plant under the pointer grows taller and opens its leaves, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 212], [227, 195], [256, 156], null],
  mount,
});
