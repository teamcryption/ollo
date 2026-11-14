/**
 * Orchard: four fruit trees in a row on a strip of grass, each with a trunk,
 * a round crown and a few fruit. The pointer picks a tree by where it stands:
 * its crown swings over as if shaken and its fruit drops to the grass, the
 * trees beside it sway a little, staggered from it. At rest the crowns are of
 * different sizes and one is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, lerp, place, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, SZ = 3, FAV = 2, SWAY = 9;
const CR = [13, 15, 12, 14], TH = [16, 20, 15, 18];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const FR = [[-5, 8, 2], [6, 9, -4], [1, 11, 6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-20, -20, 0], [X1 + 20, 20, 0], [X1 + 20, -20, 0], [-20, 20, 0], [0, 0, 52], [X1, 0, 52]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-20, -20, X1 + 20, 20, 8, 2);
  put(solid(g), prism(P, front, gr, gi, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, CR[k] * 0.7), SZ)), class: "nf lo dash" }, grp);
    const trunk = mk("path", {}, grp), crown = mk("path", { class: "sil" }, grp), crease = mk("path", { class: "nf lo" }, grp);
    const fruit = FR.map(() => mk("circle", { r: 2, class: "dot m" }, grp));
    items.push({ k, x, y, trunk, crown, crease, fruit, lean: tween(k === FAV ? 3 : 0), drop: tween(0), last: NaN, lastD: NaN });
  }

  function draw(it, ln, dr) {
    if (ln === it.last && dr === it.lastD) return;
    it.last = ln; it.lastD = dr;
    const h = TH[it.k], R = CR[it.k], cz = SZ + h + R * 0.8, cx = it.x, cy = it.y + ln;
    it.trunk.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 2.4, 12), SZ).concat(ringAt(P, disc(cx, cy, 2, 12), cz)))));
    const pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(cx, cy, R * Math.cos(t) + 0.01), cz + R * 0.8 * Math.sin(t))); }
    it.crown.setAttribute("d", poly(hull(pts)));
    it.crease.setAttribute("d", poly(ringAt(P, disc(cx, cy, R - 1.5), cz)));
    FR.forEach(([fx, fy, fz], j) => {
      const d = Math.min(1, Math.max(0, dr * 1.6 - j * 0.3));
      place(it.fruit[j], P(lerp(cx + fx, it.x + fx * 1.2, d), lerp(cy + fy, it.y + fy * 0.6 + 10, d), lerp(cz + fz, SZ, d)));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.lean, now), tval(it.drop, now)); if (!tdone(it.lean, now) || !tdone(it.drop, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ln = a < 0 ? (k === FAV ? 3 : 0) : dd === 0 ? SWAY : dd === 1 ? 3 : 0;
      const dl = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.lean, ln, now, dl);
      tset(it.drop, a >= 0 && dd === 0 ? 1 : 0, now, dl);
      it.crown.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tree " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "orchard",
  means: "Four fruit trees in a row: the tree under the pointer swings over and drops its fruit, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 140], [220, 175], [260, 195], null],
  mount,
});
