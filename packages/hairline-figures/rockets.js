/**
 * Rockets: three rockets of different sizes, each on its own launch pad with
 * a lattice service tower and an arm reaching across to it. The pointer picks
 * a rocket by where it is along the row: that one lifts off its pad on a short
 * exhaust plume, its neighbours rise a little, staggered from it. At rest the
 * big middle rocket is just lifting, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (toaster); the hit is the nearest
 * rest centre by screen x, so a rising rocket never moves its own hit area.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PAD = 3, LIFT = 30, FAV = 1;
const RK = [{ x: -36, r: 5, h: 32 }, { x: 0, r: 7.5, h: 56 }, { x: 34, r: 6, h: 42 }];
const REST = [0, 6, 0];
const D = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-48, -22, 0], [48, -22, 0], [48, 12, 0], [-48, 12, 0], [0, 0, PAD + LIFT + 56 + 17]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  RK.forEach((o, k) => {
    items.push({ kind: "tower", k, x: o.x, y: -o.r - 9 }, { kind: "rocket", k, x: o.x, y: 0 });
  });
  items.sort((a, b) => a.x + a.y - (b.x + b.y));
  const rockets = [];
  for (const it of items) {
    const o = RK[it.k];
    if (it.kind === "tower") {
      const th = o.h * 0.78, [tr, ti] = rings(it.x - 2.2, it.y - 2.2, it.x + 2.2, it.y + 2.2, 0.8, 0.5);
      const tw = solid(g);
      put(tw, prism(P, front, tr, ti, 0, th));
      let zz = "";
      for (let z = 4; z < th - 4; z += 6) zz += seg(P(it.x + 2.2, it.y - 1.6, z), P(it.x + 2.2, it.y + 1.6, z + 6));
      zz += seg(P(it.x, it.y + 2.2, th * 0.72), P(it.x, -o.r - 0.5, th * 0.72));
      mk("path", { class: "nf lo", d: zz }, tw.g);
      continue;
    }
    const grp = mk("g", {}, g);
    const [pr, pi] = rings(it.x - o.r - 7, -o.r - 6, it.x + o.r + 7, o.r + 7, 3, 1.2);
    put(solid(grp), prism(P, front, pr, pi, 0, PAD));
    rockets.push({
      k: it.k, o, plume: mk("path", { class: "lo" }, grp), finB: mk("path", {}, grp), body: solid(grp),
      finF: mk("path", { class: "nf lo" }, grp), z: tween(REST[it.k]), last: NaN,
    });
  }
  rockets.sort((a, b) => a.k - b.k);
  const ring = (r, x) => circ(r, 28).map((q) => ({ ...q, u: q.u + x }));

  function fin(o, z0, a) {
    const c = Math.cos(a), s = Math.sin(a), q = (rr, z) => P(o.x + rr * c, rr * s, z);
    return fillet([q(o.r - 0.5, z0 + o.h * 0.3), q(o.r + 4.5, z0 + 3), q(o.r + 4.5, z0 - 1.5), q(o.r - 0.5, z0 + 1)], [0.5, 1.5, 1, 0.5], 3);
  }
  function draw(s, L) {
    if (L === s.last) return;
    s.last = L;
    const o = s.o, z0 = PAD + L, zs = z0 + o.h, nose = o.r * 2.2;
    const pts = ringAt(P, ring(o.r, o.x), z0).concat(ringAt(P, ring(o.r, o.x), zs), ringAt(P, ring(0.7, o.x), zs + nose));
    s.body.sil.setAttribute("d", poly(hull(pts)));
    s.body.cr.setAttribute("d", open(ringAt(P, run(ring(o.r - 0.3, o.x), front), zs)) + open(ringAt(P, run(ring(o.r - 0.3, o.x), front), z0 + o.h * 0.42)));
    s.finB.setAttribute("d", poly(fin(o, z0, -Math.PI / 4)) + poly(fin(o, z0, (3 * Math.PI) / 4)));
    s.finF.setAttribute("d", seg(P(o.x + o.r * D, o.r * D, z0 + o.h * 0.3), P(o.x + (o.r + 4.5) * D, (o.r + 4.5) * D, z0 - 1.5)));
    const pl = Math.min(L - 0.5, 4 + L * 0.5), w = o.r * 0.85;
    if (L < 1.5) { s.plume.setAttribute("d", ""); return; }
    const q = (t, z) => P(o.x + t * w * D, -t * w * D, z);
    s.plume.setAttribute("d", poly(fillet([q(-0.8, z0), q(-1, z0 - pl * 0.4), q(0, z0 - pl), q(1, z0 - pl * 0.4), q(0.8, z0)], [0.5, 2, 1.5, 2, 0.5], 4)));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const s of rockets) { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  // the hit: the rest centre nearest the pointer's screen x, inside the row's rest band
  const cx = RK.map((o) => P(o.x, 0, PAD + o.h / 2)[0]);
  const top = P(0, 0, PAD + 56 + 17)[1] - 8, bot = P(48, 12, 0)[1] + 6;
  function hit([sx, sy]) {
    if (sy < top || sy > bot) return -1;
    let a = -1, bd = 44;
    cx.forEach((c, k) => { const d = Math.abs(sx - c); if (d < bd) { bd = d; a = k; } });
    return a;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rockets.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(8 - 3 * Math.abs(k - a), 0, 8);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rocket " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rockets",
  means: "Three rockets on launch pads: the one under the pointer lifts off on a plume, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 168], [191, 168], [252, 209], null],
  mount,
});
