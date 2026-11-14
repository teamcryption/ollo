/**
 * Trumpets: a trumpet resting on two pegs over a case lid, its lead pipe
 * running into a flared bell, a lower loop under it and three piston
 * valves standing on top. The pointer picks a valve by where it stands: its
 * finger button presses down, and the buttons beside it dip a little,
 * staggered from it. At rest the middle valve is pressed, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (keys).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 30, VX = [-4, 8, 20], PRESS = 9, FAV = 1, BZ = 3;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function tube(P, line, S) {
  const pts = line.map(([x, z]) => P(x, 0, z)), L = [], R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], d = Math.hypot(tx, ty) || 1, w = line[i][2] * S;
    L.push([p[0] - (ty / d) * w, p[1] + (tx / d) * w]); R.push([p[0] + (ty / d) * w, p[1] - (tx / d) * w]);
  });
  return poly(L.concat(R.reverse()));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const S = 2.45, C = Cam(45, 0.5, S);
  fit(C, [[-56, -16, 0], [78, 16, 0], [-56, 16, 0], [78, -16, 0], [72, 0, H + 13], [20, 0, H + 21]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-56, -16, 78, 16, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 0, BZ));
  for (const x of [-34, 40]) put(solid(g), prism(P, front, disc(x, 0, 2.4), disc(x, 0, 1.6), BZ, H - 13));

  // the lower loop, then the lead pipe and bell
  const loop = [];
  for (let i = 0; i <= 6; i++) { const a = Math.PI / 2 + (i / 6) * Math.PI; loop.push([-14 + 6 * Math.cos(a), H - 6 + 6 * Math.sin(a), 1.8]); }
  for (let i = 1; i <= 6; i++) loop.push([-14 + (i / 6) * 50, H - 12, 1.8]);
  for (let i = 1; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; loop.push([36 + 6 * Math.cos(a), H - 6 + 6 * Math.sin(a), 1.8]); }
  mk("path", { d: tube(P, loop, S), class: "sil" }, g);
  const lead = [];
  for (let i = 0; i <= 12; i++) { const x = -48 + i * 9.5; lead.push([x, H, 1.6 + (x > 40 ? Math.pow((x - 40) / 28, 2.4) * 9 : 0)]); }
  mk("path", { d: tube(P, lead, S), class: "sil" }, g);
  const rim = [];
  for (let i = 0; i < 32; i++) { const a = (i / 32) * 2 * Math.PI; rim.push(P(66, 10.6 * Math.cos(a), H + 10.6 * Math.sin(a))); }
  mk("path", { d: poly(rim), class: "lo" }, g);

  const items = VX.map((x, k) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, 3.6), disc(x, 0, 2.8), H - 12, H + 6));
    const stem = mk("path", { class: "nf lo" }, grp), cap = solid(grp);
    return { k, x, stem, cap, z: tween(k === FAV ? PRESS : 0), last: NaN };
  });

  function draw(it, p) {
    if (p === it.last) return;
    it.last = p;
    const top = H + 17 - p;
    it.stem.setAttribute("d", poly([P(it.x - 0.8, 0, H + 6), P(it.x - 0.8, 0, top), P(it.x + 0.8, 0, top), P(it.x + 0.8, 0, H + 6)]));
    put(it.cap, prism(P, front, disc(it.x, 0, 3.2), disc(it.x, 0, 2.2), top, top + 2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, H + 8));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 14 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? PRESS : 0) : dd === 0 ? PRESS : dd === 1 ? 1.5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "valve " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "trumpets",
  means: "A trumpet on pegs over its case: the valve under the pointer presses down, and the valves beside it dip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[174, 82], [195, 93], [216, 103], null],
  mount,
});
