/**
 * Foosball: a table with four rods across its pitch, each rod carrying a
 * line of players on it. The pointer picks a rod by where it stands: the rod
 * spins and its players kick through, and the rods beside it twitch,
 * staggered from it. At rest one rod is cocked back, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 108, D = 58, TZ = 26, RZ = 40, LEG = 13, FAV = 2;
const RODS = [[14, [29]], [38, [12, 46]], [62, [8, 29, 50]], [86, [16, 42]]];
const RESTA = [0.15, -0.25, 0.7, 0.1];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -14, 0], [L, D + 16, 0], [L, -14, RZ + 8], [0, D + 16, RZ + 8], [L, D, 0], [0, 0, RZ + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, TZ));
  // the pitch: centre line, centre circle and two goal mouths
  mk("path", { d: seg(P(L / 2, 3, TZ), P(L / 2, D - 3, TZ)) + poly(ringAt(P, disc(L / 2, D / 2, 8, 24), TZ)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, rings(-0.01, D / 2 - 9, 5, D / 2 + 9, 1, 0.5)[0], TZ)) + poly(ringAt(P, rings(L - 5, D / 2 - 9, L + 0.01, D / 2 + 9, 1, 0.5)[0], TZ)), class: "nf lo" }, g);

  const rods = RODS.map(([x, ys], k) => {
    const grp = mk("g", {}, g);
    const bar = mk("path", { class: "nf" }, grp);
    const men = ys.map(() => mk("path", {}, grp));
    const knob = solid(grp);
    put(knob, prism(P, front, disc(x, D + 12, 3), disc(x, D + 12, 1.8), RZ - 3, RZ + 3));
    return { k, x, ys, bar, men, knob, a: tween(RESTA[k]), last: NaN };
  });

  function draw(r, a) {
    if (a === r.last) return;
    r.last = a;
    r.bar.setAttribute("d", seg(P(r.x, -12, RZ), P(r.x, D + 10, RZ)));
    const s = Math.sin(a), c = Math.cos(a);
    r.ys.forEach((y, i) => {
      const pts = [];
      for (const dy of [-2.6, 2.6]) for (const [t, w] of [[-3, 2.2], [LEG, 3]]) for (const dx of [-w, w]) {
        pts.push(P(r.x + t * s + dx * c, y + dy, RZ - t * c + dx * s));
      }
      r.men[i].setAttribute("d", poly(hull(pts)));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rods) { draw(r, tval(r.a, now)); if (!tdone(r.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = rods.map((r) => P(r.x, D / 2, RZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rods.forEach((r, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? RESTA[k] : dd === 0 ? -1.15 : dd === 1 ? 0.35 : 0;
      tset(r.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      r.men.forEach((m) => m.classList.toggle("hi", on));
      r.men.forEach((m) => m.classList.toggle("sil", !on));
    });
    read.textContent = a < 0 ? "rest" : "rod " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "foosball",
  means: "A foosball table with four rods: the rod under the pointer spins so its players kick through, and the rods beside it twitch.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[181, 127], [211, 142], [241, 157], null],
  mount,
});
