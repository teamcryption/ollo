/**
 * Bird cages: three round domed cages hung at different heights from the
 * rail of a stand, each a wire drum on a tray with a domed top, a perch and
 * a little door. The pointer picks a cage by where it hangs: that cage swings
 * out toward the reader and its door opens, the others swing a little after
 * it. At rest the cages hang a touch askew, the middle door ajar and bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the hit is the
 * nearest resting middle along x, so a swinging cage never moves its target.
 */
const {
  Cam, circ, facing, fillet, fit, hull, open, poly, prism, proj, rings, run, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const ZR = 84, R = 10, X1 = 116, XS = [18, 58, 98], HANG = [6, 20, 12], HT = [22, 26, 19];
const REST = [3, -2, 5], FAV = 1, SW = 24, AJAR = 25, OPEN = 65, T0 = -10 * (Math.PI / 180), TD = 0.42, D2R = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  const ext = [[-3, -16, 0], [X1 + 3, 16, 0], [X1 + 3, -16, 0], [-3, 16, 0], [0, 0, ZR + 3], [X1, 0, ZR + 3]];
  XS.forEach((x, k) => { const l = HANG[k] + R * 0.7 + HT[k] + 3; ext.push([x, l * Math.sin(SW * D2R) + R + 6, ZR - l * Math.cos(SW * D2R)]); });
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, 1, 0.5); put(solid(g), prism(P, front, o, i, z0, z1)); };

  // the stand: two posts on feet and the rail across them
  box(-3, -14, 3, 14, 0, 3); box(-1.8, -1.8, 1.8, 1.8, 3, ZR);
  box(-2, -1.4, X1 + 2, 1.4, ZR, ZR + 2.8);
  const cages = XS.map((cx, k) => {
    const grp = mk("g", {}, g);
    place(flatDot(grp, C, 1.2, "dot off"), P(cx, 0, ZR));
    return {
      k, cx, grp, hang: mk("path", { class: "nf" }, grp), body: mk("path", { class: "sil" }, grp), wire: mk("path", { class: "nf lo" }, grp),
      tray: solid(grp), door: mk("path", {}, grp), dbar: mk("path", { class: "nf lo" }, grp),
      th: tween(REST[k]), ph: tween(k === FAV ? AJAR : 0), last: "",
    };
  });
  box(X1 - 1.8, -1.8, X1 + 1.8, 1.8, 3, ZR); box(X1 - 3, -14, X1 + 3, 14, 0, 3);

  const wrapA = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
  const ring = circ(R, 32), dome = [0, 0.3, 0.55, 0.78, 0.92, 1];
  function draw(c, thd, phd) {
    const key = thd.toFixed(2) + "," + phd.toFixed(2);
    if (key === c.last) return;
    c.last = key;
    const th = thd * D2R, ph = phd * D2R, ct = Math.cos(th), st = Math.sin(th);
    // the cage hangs from its hook on the rail and swings about it, in y–z
    const W = (x, y, z) => P(c.cx + x, y * ct - z * st, ZR + y * st + z * ct);
    const zt = -c.hang0 - R * 0.7, zb = zt - c.h, at = (t, r, z) => W(r * Math.cos(t), r * Math.sin(t), z);
    const domeZ = (f) => zt + R * 0.7 * Math.sin((f * Math.PI) / 2), domeR = (f) => R * Math.cos((f * Math.PI) / 2);
    const pts = ring.map((q) => W(q.u, q.v, zb));
    for (const f of dome) for (const q of ring) pts.push(W(q.u * domeR(f) / R, q.v * domeR(f) / R, domeZ(f)));
    c.body.setAttribute("d", poly(hull(pts)));
    c.hang.setAttribute("d", seg(W(0, 0, 0), W(0, 0, zt + R * 0.7)) + poly(circ(1.4, 10).map((q) => W(q.u, 0, zt + R * 0.7 + 1.4 + q.v))));
    // the wires facing us: bars, the dome's ribs, the top hoop, and the perch seen through them
    const d = [];
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * Math.PI * 2;
      if (!front({ nu: Math.cos(t), nv: Math.sin(t) })) continue;
      if (Math.abs(wrapA(t - T0)) < TD + 0.05) { d.push(open(dome.map((f) => at(t, domeR(f), domeZ(f))))); continue; }
      d.push(open([at(t, R, zb)].concat(dome.map((f) => at(t, domeR(f), domeZ(f))))));
    }
    d.push(open(run(ring, front).map((q) => W(q.u, q.v, zt))));
    d.push(seg(W(-R + 1.5, 0, zb + c.h * 0.4), W(R - 1.5, 0, zb + c.h * 0.4)));
    c.wire.setAttribute("d", d.join(""));
    const [tr, ti] = rings(-R - 1.5, -R - 1.5, R + 1.5, R + 1.5, R + 1.5, 0.8);
    c.tray.sil.setAttribute("d", poly(hull(tr.map((q) => W(q.u, q.v, zb - 3)).concat(tr.map((q) => W(q.u, q.v, zb))))));
    c.tray.cr.setAttribute("d", open(run(ti, front).map((q) => W(q.u, q.v, zb))));
    // the door: a flat panel on its near hinge, swung out by ph
    const hx = R * Math.cos(T0 + TD), hy = R * Math.sin(T0 + TD), ex = R * Math.cos(T0 - TD) - hx, ey = R * Math.sin(T0 - TD) - hy;
    const ox = hx + ex * Math.cos(ph) - ey * Math.sin(ph), oy = hy + ex * Math.sin(ph) + ey * Math.cos(ph);
    const z0 = zb + 1.5, z1 = zb + Math.min(c.h - 4, 15);
    c.door.setAttribute("d", poly(fillet([W(hx, hy, z0), W(ox, oy, z0), W(ox, oy, z1), W(hx, hy, z1)], [0.8, 0.8, 0.8, 0.8])));
    c.dbar.setAttribute("d", [1 / 3, 2 / 3].map((s) => seg(W(hx + (ox - hx) * s, hy + (oy - hy) * s, z0), W(hx + (ox - hx) * s, hy + (oy - hy) * s, z1))).join(""));
  }
  cages.forEach((c, k) => { c.hang0 = HANG[k]; c.h = HT[k]; });

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cages) { draw(c, tval(c.th, now), tval(c.ph, now)); if (!tdone(c.th, now) || !tdone(c.ph, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The cage whose resting middle is nearest the pointer along x; -1 off the row. */
  const mids = cages.map((c, k) => P(c.cx, 0, ZR - HANG[k] - R * 0.7 - HT[k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cages.forEach((c, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.th, a < 0 ? REST[k] : d === 0 ? SW : d === 1 ? 7 : 3, now, delay);
      tset(c.ph, a < 0 ? (k === FAV ? AJAR : 0) : d === 0 ? OPEN : 0, now, delay);
      c.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cage " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "birdcages",
  means: "Three bird cages hung from a stand rail: the cage under the pointer swings out and its door opens, the others swing a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[136, 94], [200, 157], [264, 178], null],
  mount,
});
