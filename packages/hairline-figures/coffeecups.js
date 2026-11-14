/**
 * Cup stack: three stacks of nested takeaway cups on a counter, the top cup
 * of each wearing its lid. The pointer picks a stack by where it stands: the
 * stack draws apart like an accordion, every cup lifting clear of the one
 * below, and the stacks beside it open a little, staggered from it. At rest
 * the middle stack stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, open, poly, proj, ringAt, run, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const COUNTS = [5, 7, 4], STEP = 34, RF = 7.5, RT = 11, H = 20, G0 = 3.4, G1 = 10, FAV = 1, CZ = 3;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const RESTG = [G0 + 0.6, G0 + 3.2, G0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const X1 = 2 * STEP + 2 * RT;
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * RT + 6, 0], [X1 + 6, -6, 0], [-6, 2 * RT + 6, 0], [RT + STEP, RT, CZ + H + 6 * G1 + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cs = solid(g);
  const slab = [];
  for (const [x, y] of [[-6, -6], [X1 + 6, -6], [X1 + 6, 2 * RT + 6], [-6, 2 * RT + 6]]) slab.push(P(x, y, 0), P(x, y, CZ));
  cs.sil.setAttribute("d", poly(hull(slab)));

  const stacks = COUNTS.map((n, s) => {
    const x = RT + s * STEP, y = RT, grp = mk("g", {}, g), cups = [];
    for (let k = 0; k < n; k++) {
      const c = mk("g", {}, grp);
      cups.push({ sil: mk("path", { class: "sil" }, c), cr: mk("path", { class: "nf lo" }, c), band: mk("path", { class: "nf lo" }, c) });
    }
    const lid = mk("path", { class: "sil" }, grp), lidc = mk("path", { class: "nf lo" }, grp);
    return { s, n, x, y, cups, lid, lidc, gap: tween(RESTG[s]), last: NaN };
  });

  function draw(st, gap) {
    if (gap === st.last) return;
    st.last = gap;
    st.cups.forEach((c, k) => {
      const z0 = CZ + k * gap, z1 = z0 + H;
      const pts = ringAt(P, disc(st.x, st.y, RF), z0).concat(ringAt(P, disc(st.x, st.y, RT), z1));
      c.sil.setAttribute("d", poly(hull(pts)));
      c.cr.setAttribute("d", open(ringAt(P, run(disc(st.x, st.y, RT - 1.2), (q) => !front(q)), z1 - 0.4)));
      const rb = lerp3(RF, RT, 0.72);
      c.band.setAttribute("d", open(ringAt(P, run(disc(st.x, st.y, rb), front), z0 + H * 0.72)));
    });
    const zt = CZ + (st.n - 1) * gap + H;
    const lp = ringAt(P, disc(st.x, st.y, RT + 0.8), zt).concat(ringAt(P, disc(st.x, st.y, RT + 0.8), zt + 2.2), ringAt(P, disc(st.x, st.y, RT - 2.5), zt + 4.4));
    st.lid.setAttribute("d", poly(hull(lp)));
    st.lidc.setAttribute("d", poly(ringAt(P, disc(st.x - 3, st.y - 3, 1.6, 12), zt + 4.4)));
  }
  function lerp3(a, b, t) { return a + (b - a) * t; }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of stacks) { draw(st, tval(st.gap, now)); if (!tdone(st.gap, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = stacks.map((st) => P(st.x, st.y, CZ + H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 34 && sy > mids[best][1] - 140 && sy < mids[best][1] + 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stacks.forEach((st, k) => {
      const d = Math.abs(k - a), gp = a < 0 ? RESTG[k] : d === 0 ? G1 : G0 + 1.4;
      tset(st.gap, gp, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      st.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1) + "·" + stacks[a].n;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coffeecups",
  means: "Stacks of nested takeaway cups: the stack under the pointer draws apart like an accordion, cup by cup, under its lid.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 160], [200, 114], [249, 209], null],
  mount,
});
