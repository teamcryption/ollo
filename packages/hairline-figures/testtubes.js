/**
 * Test tubes: six glass tubes standing in a two-deck rack, each with a
 * rounded foot, a lip at the mouth and liquid filled to its own level. The
 * pointer picks a tube by where it stands: it lifts out of the rack, and the
 * tubes beside it rise a little, staggered from it. At rest one tube stands
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 15, R = 4.6, TL = 52, DECK = 26, RW = 12, LIFT = 22, FAV = 2;
const LEVEL = [0.55, 0.35, 0.7, 0.45, 0.6, 0.3];
const X1 = (N - 1) * STEP + 16;
const ringAtXY = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-6, -6, 0], [X1 + 6, RW + 6, 0], [X1 + 6, -6, 0], [-6, RW + 6, 0], [0, RW / 2, TL + LIFT + 4], [X1, RW / 2, TL + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack: a base, two end posts and the upper deck with a hole per tube
  const [br, bi] = rings(-6, -2, X1 + 6, RW + 2, 2.5, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  for (const x0 of [-6, X1 + 2]) { const [r, i] = rings(x0, 0, x0 + 4, RW, 1, 0.5); put(solid(g), prism(P, front, r, i, 3, DECK)); }

  const tubes = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * STEP, y = RW / 2, grp = mk("g", {}, g);
    const glass = mk("path", { class: "sil" }, grp), liquid = mk("path", { class: "nf lo" }, grp), lip = mk("path", { class: "nf" }, grp);
    tubes.push({ k, x, y, grp, glass, liquid, lip, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  const deck = solid(g);
  const [dr, di] = rings(-6, -1, X1 + 6, RW + 1, 2, 1);
  put(deck, prism(P, front, dr, di, DECK, DECK + 3));
  const holes = mk("path", { class: "nf lo" }, deck.g);
  holes.setAttribute("d", tubes.map((t) => poly(ringAt(P, ringAtXY(t.x, t.y, R + 0.8), DECK + 3))).join(""));
  // tubes rise through the deck: the part above it is drawn again after the deck
  const tops = tubes.map((t) => { const grp = mk("g", {}, g); return { grp, glass: mk("path", { class: "sil" }, grp), liquid: mk("path", { class: "nf lo" }, grp), lip: mk("path", { class: "nf" }, grp) }; });

  function shape(t, lift, from) {
    const z0 = 3 + lift, z1 = z0 + TL, foot = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI + (Math.PI * i) / 10; foot.push(P(t.x + R * Math.cos(a), t.y + R * Math.sin(a) * 0.0, z0 + R + R * Math.sin(a))); }
    const ring = ringAtXY(t.x, t.y, R), lo = Math.max(z0 + R, from);
    const pts = ringAt(P, ring, z1).concat(ringAt(P, ring, lo)).concat(lo <= z0 + R ? ringAt(P, ringAtXY(t.x, t.y, R * 0.55), z0 + 0.8) : []);
    const lvl = z0 + R + (TL - R - 6) * LEVEL[t.k];
    return {
      glass: poly(hull(pts)),
      liquid: lvl > from ? open(ringAt(P, run(ring, front), lvl)) : "",
      lip: poly(ringAt(P, ringAtXY(t.x, t.y, R + 1), z1)),
    };
  }

  function draw(t, i, lift) {
    if (lift === t.last) return;
    t.last = lift;
    const a = shape(t, lift, 0), b = shape(t, lift, DECK + 3);
    t.glass.setAttribute("d", a.glass); t.liquid.setAttribute("d", a.liquid); t.lip.setAttribute("d", "");
    const top = tops[i];
    top.glass.setAttribute("d", b.glass); top.liquid.setAttribute("d", b.liquid); top.lip.setAttribute("d", b.lip);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    tubes.forEach((t, i) => { draw(t, i, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  const mids = tubes.map((t) => P(t.x, t.y, TL * 0.6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 12 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tubes.forEach((t, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(t.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      tops[k].glass.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "testtubes",
  means: "Six test tubes in a rack: the one under the pointer lifts out, and the tubes beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 124], [213, 163], [265, 189], null],
  mount,
});
