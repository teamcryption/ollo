/**
 * Dental tray: a dentist's instrument tray with a raised lip, holding six
 * instruments side by side: a mouth mirror, a probe with its hook, a double
 * ended scaler, forceps, a syringe with its plunger and needle, and a cotton
 * roll. The pointer picks the instrument nearest it along the tray: it lifts
 * and turns, and its neighbours lift a little, staggered from it. At rest the
 * mirror sits a little askew, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the
 * instrument whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

// parts: [u0, v0, u1, v1, r, height], u across the instrument, v along it
const H = [-1.3, -22, 1.3, 14, 1.3, 2.4];
const TOOLS = [
  [H, [-0.6, 13, 0.6, 20, 0.6, 1.6], [-4, 19, 4, 27, 4, 1.6]],
  [H, [-0.5, 13, 0.5, 26, 0.5, 1.4], [-2.6, 24.6, 0.4, 26, 0.7, 1.4]],
  [[-1.3, -16, 1.3, 14, 1.3, 2.4], [-0.5, -26, 0.5, -15, 0.5, 1.4], [-0.5, 13, 0.5, 24, 0.5, 1.4], [-0.5, 23, 2.6, 24.4, 0.7, 1.4]],
  [[-3, -24, 3, -17, 2, 2.4], [-2.6, -18, -1, 25, 0.8, 1.8], [1, -18, 2.6, 25, 0.8, 1.8]],
  [[-0.8, -25, 0.8, -15, 0.8, 2.6], [-4.5, -15.5, 4.5, -13.5, 1, 4.4], [-3, -14, 3, 14, 3, 6], [-0.35, 13.5, 0.35, 27, 0.35, 1.2]],
  [[-4, -11, 4, 11, 4, 7.5]],
];
const N = TOOLS.length, PIT = 13, X1 = N * PIT + 4, Y0 = -34, Y1 = 34, LIFT = 12, TURN = 22;
const REST_A = [9, -2, 3, 0, -4, 6], REST_Z = [4, 0, 0, 0, 0, 0], FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-4, Y0, -4], [X1, Y1, -4], [X1, Y0, -4], [-4, Y1, -4], [8, Y0, LIFT + 8], [X1 - 8, Y0, LIFT + 8]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the tray: a slab with a lip ring inset from its edge
  const tray = solid(g);
  { const [r, i] = rings(-4, Y0, X1, Y1, 5, 1.2); put(tray, prism(P, front, r, i, -4, 0)); }
  { const [r] = rings(-1, Y0 + 3, X1 - 3, Y1 - 3, 3.5, 1); const lip = r.map((q) => P(q.u, q.v, 0)); mk("path", { class: "nf lo", d: "M" + lip.map((p) => p.join(",")).join("L") + "Z" }, tray.g); }

  const tools = TOOLS.map((parts, k) => {
    const grp = mk("g", {}, g);
    return { k, cx: 4 + PIT / 2 + k * PIT, grp, parts: parts.map((p) => ({ p, el: solid(grp), rr: rings(p[0], p[1], p[2], p[3], p[4], Math.min(0.5, (p[2] - p[0]) / 4)) })),
      z: tween(REST_Z[k]), a: tween(REST_A[k]), last: "" };
  });

  // turn a ring about the instrument's middle, then set it on the tray
  const turn = (ring, cx, deg) => { const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
    return ring.map((q) => ({ ...q, u: cx + q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  function draw(t, z, a) {
    const key = z.toFixed(2) + "," + a.toFixed(2);
    if (key === t.last) return;
    t.last = key;
    for (const q of t.parts) put(q.el, prism(P, front, turn(q.rr[0], t.cx, a), turn(q.rr[1], t.cx, a), z, z + q.p[5]));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tools) { draw(t, tval(t.z, now), tval(t.a, now)); if (!tdone(t.z, now) || !tdone(t.a, now)) moving = true; }
    const order = tools.slice().sort((a, b) => a.cx * 0.1 + tval(a.z, now) - (b.cx * 0.1 + tval(b.z, now)));
    const key = order.map((t) => t.k).join();
    if (key !== painted) { painted = key; for (const t of order) g.appendChild(t.grp); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tools.map((t) => P(t.cx, 0, 0));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tools.forEach((t, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(t.z, a < 0 ? REST_Z[k] : d === 0 ? LIFT : d === 1 ? 3.5 : d === 2 ? 1 : 0, now, delay);
      tset(t.a, a < 0 ? REST_A[k] : d === 0 ? TURN : REST_A[k] * 0.5, now, delay);
      for (const q of t.parts) q.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dentaltray",
  means: "A dentist's tray of six instruments: the one under the pointer lifts and turns, its neighbours lift a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[157, 162], [196, 182], [236, 204], null],
  mount,
});
