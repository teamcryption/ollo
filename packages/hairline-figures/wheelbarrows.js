/**
 * Wheelbarrows: three barrows parked side by side on a site, each a flared
 * tray on one front wheel, two legs and two handles. The pointer picks a
 * barrow by where it stands: its handles rise and the tray tips forward over
 * the wheel to dump its load, and the barrows beside it tip a little,
 * staggered from it. At rest one barrow is half tipped, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, hull, open, poly, proj, rad, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 3, STEP = 46, YA = 22, ZA = 7, WR = 7, TIP = 38, FAV = 1;
const disc = (cx, r, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [cx, YA + r * Math.cos(t), ZA + r * Math.sin(t)]; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const X1 = (N - 1) * STEP;
  fit(C, [[-16, -38, 0], [X1 + 16, YA + 10, 0], [X1 + 16, -38, 0], [-16, YA + 10, 0], [0, -30, 34], [X1, -30, 34]], 200, 170);
  const P = proj(C);

  // one barrow's parts in world space, before the tip
  const bot = (cx) => rrect(cx - 9, -14, cx + 9, 12, 4, 3).map((q) => [q.u, q.v, 9]);
  const top = (cx) => rrect(cx - 14, -20, cx + 14, 17, 6, 3).map((q) => [q.u, q.v, 21]);
  const inner = (cx) => rrect(cx - 12.5, -18.5, cx + 12.5, 15.5, 5, 3).map((q) => [q.u, q.v, 20.4]);

  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const cx = k * STEP, grp = mk("g", {}, g);
    const frame = mk("path", { class: "nf" }, grp);
    const tray = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    const load = mk("path", { class: "nf lo" }, grp);
    const w0 = disc(cx - 2, WR).map((p) => P(...p)), w1 = disc(cx + 2, WR).map((p) => P(...p));
    mk("path", { d: poly(hull(w0.concat(w1))), class: "sil" }, grp);
    mk("path", { d: poly(disc(cx + 2, WR - 2.5).map((p) => P(...p))), class: "nf lo" }, grp);
    items.push({ k, cx, frame, tray, rim, load, a: tween(k === FAV ? TIP * 0.45 : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const R = ([x, y, z]) => { const dy = y - YA, dz = z - ZA; return P(x, YA + dy * c + dz * s, ZA - dy * s + dz * c); };
    const cx = it.cx;
    it.tray.setAttribute("d", poly(hull(bot(cx).concat(top(cx)).map(R))));
    it.rim.setAttribute("d", poly(inner(cx).map(R)));
    // the load: a low heap of earth in the tray
    const heap = [];
    for (const [r, z] of [[9, 20.4], [6, 23], [3, 24.5]]) heap.push(...rrect(cx - r, -3 - r, cx + r, -3 + r, r, 3).map((q) => R([q.u, q.v, z])));
    it.load.setAttribute("d", poly(hull(heap)));
    let d = "";
    for (const sx of [-8, 8]) {
      d += seg(R([cx + sx, -12, 10]), R([cx + sx * 1.1, -40, 13]));   // handle
      d += seg(R([cx + sx, -10, 9]), R([cx + sx, -11, 0]));            // leg
      d += seg(R([cx + sx * 0.4, 12, 9]), P(cx + sx * 0.25, YA, ZA));  // fork to the axle
    }
    it.frame.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, 0, 12));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 36 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? TIP * 0.45 : 0) : dd === 0 ? TIP : dd === 1 ? 8 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tray.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "barrow " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "wheelbarrows",
  means: "Three wheelbarrows side by side: the one under the pointer tips forward over its wheel, and its neighbours tip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[129, 135], [196, 169], [262, 202], null],
  mount,
});
