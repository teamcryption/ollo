/**
 * Container yard: twelve shipping containers in four stacks of three, ribbed
 * along their sides with a door split at the end, under a gantry crane whose
 * beam spans the yard on two portal frames. The pointer picks a stack: the
 * trolley runs over it and its top container lifts on the cables, and the
 * tops beside it lift a little, staggered from it. At rest the second stack's
 * top hangs part way up, bright. The slider is the lift.
 *
 * The pattern: one of many in a row (riffle); tweens per top, a tween for the
 * trolley; the hit is read on each stack's rest outline, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, CW = 12, GAP = 3, L = 38, H = 12, STACK = 3 * H, YM = L / 2, BZ = 54, FAV = 1, NEAR = 0.22;
const W = N * (CW + GAP) - GAP, PX = 13;
const cx = (i) => i * (CW + GAP) + CW / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-PX - 2, 0, 0], [W + PX + 2, L, 0], [W + PX + 2, 0, 0], [-PX - 2, L, 0], [-PX - 4, YM, BZ + 11], [W + PX + 4, YM, BZ + 11]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A container from z0, its ribs on the long side and its door split at the end, into solid el. */
  function box(el, x0, z0) {
    const x1 = x0 + CW, z1 = z0 + H;
    const [r, i] = rings(x0, 0, x1, L, 1.2, 0.7);
    put(el, prism(P, front, r, i, z0, z1));
    let d = "";
    for (let y = 3.5; y < L - 2; y += 3) d += seg(P(x1, y, z0 + 1.2), P(x1, y, z1 - 1.2));
    for (const x of [x0 + 2.8, x1 - 2.8]) d += seg(P(x, L, z0 + 1.2), P(x, L, z1 - 1.2));
    el.ribs.setAttribute("d", d);
    el.door.setAttribute("d", seg(P(x0 + CW / 2, L, z0 + 0.8), P(x0 + CW / 2, L, z1 - 0.8)));
  }
  const mkBox = () => { const el = solid(g); el.ribs = mk("path", { class: "nf lo" }, el.g); el.door = mk("path", { class: "nf" }, el.g); return el; };

  /** A portal frame at x: two legs and a sill along y under the beam. */
  function portal(x) {
    for (const y of [2, L - 5]) { const [r, i] = rings(x - 1.5, y, x + 1.5, y + 3, 1, 0.5); put(solid(g), prism(P, front, r, i, 0, BZ)); }
    const [r, i] = rings(x - 2, 0, x + 2, L, 1.2, 0.6);
    put(solid(g), prism(P, front, r, i, BZ, BZ + 4));
  }

  portal(-PX);
  const stacks = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (CW + GAP);
    box(mkBox(), x0, 0); box(mkBox(), x0, H);
    const top = mkBox();
    stacks.push({ k, x0, top, z: tween(k === FAV ? 0.75 : 0), last: NaN });
  }
  const cables = mk("path", { class: "nf" }, g);
  portal(W + PX);
  const [br, bi] = rings(-PX - 3, YM - 2.5, W + PX + 3, YM + 2.5, 1.5, 0.7);
  put(solid(g), prism(P, front, br, bi, BZ + 4, BZ + 8));
  const trolley = solid(g);
  const tx = tween(cx(FAV));
  let lastT = NaN, cableAt = -1;

  /** The height of the stack tops under trolley position x, read between the two stacks it lies between. */
  function topAt(x, now) {
    const u = clamp((x - CW / 2) / (CW + GAP), 0, N - 1), a = Math.floor(u), b = Math.min(N - 1, a + 1);
    return STACK + lerp(tval(stacks[a].z, now), tval(stacks[b].z, now), u - a) * lift;
  }

  const B = register(stage, (_dt, now) => {
    let moving = !tdone(tx, now);
    for (const s of stacks) {
      const z = tval(s.z, now) * lift;
      if (z !== s.last) { box(s.top, s.x0, 2 * H + z); s.last = z; }
      if (!tdone(s.z, now)) moving = true;
    }
    const x = tval(tx, now), top = topAt(x, now), key = x + "," + top;
    if (key !== lastT) {
      lastT = key;
      const [r, i] = rings(x - 4, YM - 3, x + 4, YM + 3, 1.2, 0.6);
      put(trolley, prism(P, front, r, i, BZ + 8, BZ + 11));
      // the cables are painted just after the stack they hang over, so nearer stacks cover them
      const near = clamp(Math.round((x - CW / 2) / (CW + GAP)), 0, N - 1);
      if (near !== cableAt) { cableAt = near; stacks[near].top.g.after(cables); }
      cables.setAttribute("d", seg(P(x, YM - 2, BZ + 4), P(x, YM - 9, top)) + seg(P(x, YM + 2, BZ + 4), P(x, YM + 9, top)));
    }
    return moving;
  });
  bag.add(B.unregister);

  // each stack's outline at rest, a little over its top: static, and nothing draws it
  const outlines = stacks.map((s) => hull([0, STACK + 4].flatMap((z) => [[s.x0, 0], [s.x0 + CW, 0], [s.x0 + CW, L], [s.x0, L]].map(([x, y]) => P(x, y, z)))));
  const inside = (pt, poly) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  /** The nearest stack whose rest outline holds the point; -1 outside them all. */
  const hit = (p) => { for (let k = N - 1; k >= 0; k--) if (inside(p, outlines[k])) return k; return -1; };

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stacks.forEach((s, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 0.75 : 0) : dd === 0 ? 1 : dd === 1 ? NEAR : 0;
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      s.top.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    tset(tx, cx(a < 0 ? FAV : a), now, 0);
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; for (const s of stacks) s.last = NaN; lastT = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "containeryard",
  means: "A container yard under a gantry: the top container of the stack under the pointer lifts on the cables.",
  rules: [1, 2, 5, 6],
  range: [6, 10, 14],
  tour: [[159, 132], [241, 172], [214, 158], null],
  mount,
});
