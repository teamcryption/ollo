/**
 * Piggy banks: four piggy banks of different sizes in a row, each a round
 * body on four short legs, a snout, two ears and a coin slot on its back,
 * with a few coins lying in front of them. The pointer picks a pig by where
 * it stands: a coin rises above its slot and the pig hops, and its
 * neighbours hop a little, staggered from it. At rest one coin sits half in
 * the third pig's slot, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the pig
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, poly, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SC = [1.15, 0.75, 1.0, 0.62], A = 10, BL = 13, CZ = 9, LEG = 4, GAP = 6, FAV = 2, RC = 4.4;
const HOP = [9, 3.5, 1.2], RISE = 13;
const XS = []; { let x = 0; for (const s of SC) { XS.push(x + A * s); x += 2 * A * s + GAP; } }
const X1 = XS[3] + A * SC[3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-4, -BL * 1.2, 0], [X1 + 4, -BL * 1.2, 0], [X1, 34, 0], [-4, 34, 0], [XS[0], 0, 2 * (LEG + CZ) * SC[0] + HOP[0] + RISE + RC * 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const pigs = SC.map((s, k) => {
    const grp = mk("g", {}, g), legs = mk("g", {}, grp), body = mk("path", { class: "sil" }, grp);
    const ears = mk("path", { class: "sil" }, grp), snout = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    const slot = mk("path", { class: "nf lo" }, grp), coin = mk("path", { class: "sil" }, grp), coinCr = mk("path", { class: "nf lo" }, grp);
    return { k, s, cx: XS[k], legs, body, ears, snout, face, slot, coin, coinCr, hop: tween(0), rise: tween(k === FAV ? 0 : -RC), last: "" };
  });

  function ell(cx, cy, zc, a, b, c) {
    const pts = [];
    for (let i = 0; i < 16; i++) for (let j = 0; j <= 8; j++) {
      const t = (i / 16) * Math.PI * 2, f = (j / 8) * Math.PI - Math.PI / 2;
      pts.push(P(cx + a * Math.cos(f) * Math.cos(t), cy + b * Math.cos(f) * Math.sin(t), zc + c * Math.sin(f)));
    }
    return poly(hull(pts));
  }
  const disc = (x, y, z, r, n = 20) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [x + r * Math.cos(t), y, z + r * Math.sin(t)]; });

  function draw(p, hz, rz) {
    const key = hz.toFixed(2) + "," + rz.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const s = p.s, a = A * s, b = BL * s, c = CZ * s, zc = hz + (LEG + CZ) * s, cx = p.cx;
    p.legs.replaceChildren();
    for (const [lx, ly] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) put(solid(p.legs), prism(P, front, circ(2.3 * s, 16).map((q) => ({ ...q, u: q.u + cx + lx * a * 0.5, v: q.v + ly * b * 0.5 })), null, hz, zc - c * 0.5));
    p.body.setAttribute("d", ell(cx, 0, zc, a, b, c));
    const ear = (sg) => poly(fillet([[cx + sg * a * 0.75, b * 0.38, zc + c * 0.6], [cx + sg * a * 0.18, b * 0.38, zc + c * 0.9], [cx + sg * a * 0.62, b * 0.5, zc + c * 1.4]].map((q) => P(...q)), [1.2 * s, 1.2 * s, 1.6 * s], 3));
    p.ears.setAttribute("d", ear(-1) + ear(1));
    const zs = zc - c * 0.1, r = 3.6 * s, back = disc(cx, b * 0.85, zs, r), fr = disc(cx, b + 2.6 * s, zs, r);
    p.snout.setAttribute("d", poly(hull(back.concat(fr).map((q) => P(...q)))));
    p.face.setAttribute("d", poly(fr.map((q) => P(...q))) + poly(disc(cx - r * 0.38, b + 2.6 * s, zs, 0.8 * s, 8).map((q) => P(...q))) + poly(disc(cx + r * 0.38, b + 2.6 * s, zs, 0.8 * s, 8).map((q) => P(...q))));
    const top = zc + c, sy = -b * 0.12;
    p.slot.setAttribute("d", poly([[-3.4, -0.7], [3.4, -0.7], [3.4, 0.7], [-3.4, 0.7]].map(([u, v]) => P(cx + u, sy + v, top - 0.2))));
    if (rz <= -RC + 0.05) { p.coin.setAttribute("d", ""); p.coinCr.setAttribute("d", ""); return; }
    const cz = top + rz, f0 = disc(cx, sy - 0.8, cz, RC, 24), f1 = disc(cx, sy + 0.8, cz, RC, 24);
    const cut = (q) => [q[0], q[1], Math.max(q[2], top)];
    p.coin.setAttribute("d", poly(hull(f0.concat(f1).map((q) => P(...cut(q))))));
    p.coinCr.setAttribute("d", poly(disc(cx, sy + 0.8, cz, RC * 0.68, 20).map((q) => P(...cut(q)))));
  }

  // a few coins lying in front: a stack of three and two loose ones
  for (const [x, y, n] of [[XS[0] + 6, 24, 1], [XS[1] + 9, 29, 3], [XS[3] - 2, 25, 1]]) {
    for (let i = 0; i < n; i++) put(solid(g), prism(P, front, circ(RC, 24).map((q) => ({ ...q, u: q.u + x + i * 0.4, v: q.v + y })), circ(RC - 1, 24).map((q) => ({ ...q, u: q.u + x + i * 0.4, v: q.v + y })), i * 1.3, i * 1.3 + 1.1));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pigs) { draw(p, tval(p.hop, now), tval(p.rise, now)); if (!tdone(p.hop, now) || !tdone(p.rise, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The pig whose resting middle is nearest the pointer's x on screen; -1 off the row. */
  const mids = pigs.map((p) => P(p.cx, 0, (LEG + CZ) * p.s));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pigs.forEach((p, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(p.hop, a < 0 ? 0 : HOP[d] ?? 0, now, delay);
      tset(p.rise, a < 0 ? (k === FAV ? 0 : -RC) : d === 0 ? RISE : -RC, now, delay);
      const on = k === (a < 0 ? FAV : a);
      p.coin.classList.toggle("hi", on);
      p.body.classList.toggle("hi", on && a >= 0);
    });
    read.textContent = a < 0 ? "rest" : "pig " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "piggybanks",
  means: "Four piggy banks in a row: a coin rises over the pig under the pointer and it hops, its neighbours hop a little after.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 152], [245, 188], [292, 222], null],
  mount,
});
