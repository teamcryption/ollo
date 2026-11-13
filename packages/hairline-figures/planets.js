/**
 * Planets: five spheres of different sizes floating in a row above a faint
 * dashed orbit, one of them ringed, one banded. The pointer picks a planet by
 * where it stands on screen: it rises, and its neighbours rise a little,
 * staggered from it; the ringed one also tilts its ring toward the reader.
 * At rest the ringed planet floats highest, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, proj, ringAt, run, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, register,
} = HL;

const R = [8, 13, 6, 12, 9], ZR = [24, 30, 22, 30, 26], RING = 3, FAV = 3, LIFT = 16, GAP = 9;
const xs = []; { let x = 0; R.forEach((r, k) => { x += (k ? R[k - 1] : 0) + r + (k ? GAP : 0); xs.push(x); }); }
const X1 = xs[xs.length - 1] + R[R.length - 1], XM = X1 / 2, OA = XM + 26, OB = 40;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[XM - OA, 0, 0], [XM + OA, 0, 0], [XM, -OB, 0], [XM, OB, 0], [xs[1], 0, ZR[1] + LIFT + 14], [xs[3], 0, ZR[3] + LIFT + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const orbit = [];
  for (let i = 0; i <= 72; i++) { const t = (i / 72) * Math.PI * 2; orbit.push(P(XM + OA * Math.cos(t), OB * Math.sin(t), 0)); }
  mk("path", { d: open(orbit), class: "dash nf" }, g);

  const items = R.map((r, k) => {
    const grp = mk("g", {}, g), x = xs[k];
    place(flatDot(grp, C, 1.2, "dot off"), P(x, 0, 0));
    const it = { k, r, x, grp, last: NaN, lastT: NaN, z: tween(k === FAV ? 8 : 0), tilt: tween(k === FAV ? 26 : 14) };
    if (k === RING) it.back = mk("path", { class: "nf lo" }, grp);
    it.sil = mk("path", { class: "sil" }, grp);
    if (k === 1 || k === 4) it.band = mk("path", { class: "nf lo" }, grp);
    if (k === RING) it.front = mk("path", { class: "nf sil" }, grp);
    return it;
  });

  function ringPts(it, zc, a, rr, half) {
    const pts = [], ca = Math.cos(a), sa = Math.sin(a);
    for (let i = 0; i <= 36; i++) {
      const t = (half ? 0 : Math.PI) + (i / 36) * Math.PI;
      pts.push(P(it.x + rr * Math.cos(t) * ca, rr * Math.sin(t), zc + rr * Math.cos(t) * sa));
    }
    return pts;
  }
  function draw(it, lift, tilt) {
    if (lift === it.last && tilt === it.lastT) return;
    it.last = lift; it.lastT = tilt;
    const zc = ZR[it.k] + lift, pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, 0, it.r * Math.cos(t) + 0.01), zc + it.r * Math.sin(t))); }
    it.sil.setAttribute("d", poly(hull(pts)));
    if (it.band) it.band.setAttribute("d", open(ringAt(P, run(disc(it.x, 0, it.r * 0.92, 36), front), zc + it.r * 0.38)) + open(ringAt(P, run(disc(it.x, 0, it.r * 0.98, 36), front), zc - it.r * 0.2)));
    if (it.back) {
      const a = (tilt * Math.PI) / 180;
      it.back.setAttribute("d", open(ringPts(it, zc, a, it.r + 10, false)) + open(ringPts(it, zc, a, it.r + 5, false)));
      it.front.setAttribute("d", open(ringPts(it, zc, a, it.r + 10, true)) + open(ringPts(it, zc, a, it.r + 5, true)));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now), tval(it.tilt, now)); if (!tdone(it.z, now) || !tdone(it.tilt, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, ZR[it.k]));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? 8 : 0) : d === 0 ? LIFT : d === 1 ? 4 : 0;
      const dl = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, z, now, dl);
      tset(it.tilt, a < 0 ? 14 + (k === FAV ? 12 : 0) : d === 0 ? -16 : 14, now, dl);
      const on = k === (a < 0 ? FAV : a);
      it.sil.classList.toggle("hi", on);
      if (it.front) it.front.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "planet " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "planets",
  means: "Five planets float in a row over an orbit: the one under the pointer rises, its neighbours a little, and the ring tilts.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 110], [233, 145], [271, 166], null],
  mount,
});
