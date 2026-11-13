/**
 * Knife block: a wooden block leaning back, six slots cut in its top and six
 * knives in them, each handle its own size, a ferrule at its foot. The
 * pointer picks a knife by where it stands: it slides up along the slot and
 * shows its blade, and the knives beside it rise a little, staggered from it.
 * Sizes fall from the chef's knife at the back to the paring
 * knife in front. At rest the bread knife stands half drawn, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the knife
 * whose resting handle is nearest the pointer's x on screen.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

// handle thickness (x), grip height (y), handle length, blade length, blade width
const TW = [5.6, 5, 4.4, 4.2, 3.6, 3.4], HD = [9, 8, 6.6, 7, 5.6, 5.2], HL_ = [21, 19, 17, 16, 13, 12];
const BL = [34, 31, 28, 24, 18, 16], BW = [10, 7, 4.6, 6, 4, 3.6];
const L = 54, D = 26, H = 32, T = 0.26, FAV = 1, RISE = 24;
const XS = TW.map((_, k) => 7 + k * 8), YA = TW.map((_, k) => (k % 2 ? 14.5 : 12));
const shY = (ring, dy) => ring.map((q) => ({ ...q, v: q.v + dy }));
/** Keeps the part of a polygon of [z, dy] points at or above zc. */
function clipZ(pts, zc) {
  const o = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], ia = a[0] >= zc, ib = b[0] >= zc;
    if (ia) o.push(a);
    if (ia !== ib) { const t = (zc - a[0]) / (b[0] - a[0]); o.push([zc, a[1] + t * (b[1] - a[1])]); }
  });
  return o;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  const zTop = H + RISE + 21;
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, -T * zTop + 4, zTop], [L, -T * zTop + 4, zTop], [0, -T * H, H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const axisY = (k, z) => YA[k] - T * z;

  // the block: an oblique solid, its top shifted back along the lean
  {
    const [foot] = rings(0, 0, L, D, 4, 1.6), [top, inner] = rings(0, -T * H, L, D - T * H, 4, 1.6);
    put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, H)))), crease: open(ringAt(P, run(inner, front), H)) });
    let slots = "";
    XS.forEach((x, k) => { const y = axisY(k, H); slots += poly(ringAt(P, rings(x - 0.8, y - BW[k] * 0.35 - 0.6, x + 0.8, y + BW[k] * 0.65 + 0.6, 0.8, 0.3)[0], H)); });
    mk("path", { class: "nf lo", d: slots }, g);
  }

  const knives = XS.map((x, k) => {
    const grp = mk("g", {}, g), blade = mk("path", { class: "sil" }, grp), handle = solid(grp), fer = mk("path", { class: "nf lo" }, grp);
    const max = Math.min(RISE, BL[k] - 5);
    return { k, x, grp, blade, handle, fer, max, z: tween(k === FAV ? max * 0.45 : 0), last: "" };
  });

  function draw(n, lift) {
    const key = lift.toFixed(2);
    if (key === n.last) return;
    n.last = key;
    const k = n.k, x = n.x, zb = H + lift, z1 = zb + HL_[k], bw = BW[k], s = -bw * 0.35, e = s + bw, tip = zb - BL[k];
    const pts = clipZ([[zb, s], [tip + BL[k] * 0.1, s], [tip, s + bw * 0.12], [tip + BL[k] * 0.32, s + bw * 0.78], [tip + BL[k] * 0.7, e], [zb, e]], H + 0.2);
    n.blade.setAttribute("d", pts.length > 2 ? poly(pts.map(([z, dy]) => P(x, axisY(k, z) + dy, z))) : "");
    const [hr, hi] = rings(x - TW[k] / 2, -HD[k] / 2, x + TW[k] / 2, HD[k] / 2, 3, 0.7);
    const a = ringAt(P, shY(hr, axisY(k, zb)), zb), b = ringAt(P, shY(hr, axisY(k, z1)), z1);
    put(n.handle, { sil: poly(hull(a.concat(b))), crease: open(ringAt(P, run(shY(hi, axisY(k, z1)), front), z1)) });
    const zf = zb + 3, xf = x + TW[k] / 2;
    n.fer.setAttribute("d", seg(P(xf, axisY(k, zf) - HD[k] / 2 + 0.8, zf), P(xf, axisY(k, zf) + HD[k] / 2 - 0.8, zf)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const n of knives) { draw(n, tval(n.z, now)); if (!tdone(n.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The knife whose resting handle is nearest the pointer's x on screen; -1 off the block. */
  const mids = knives.map((n) => { const z = H + HL_[n.k] / 2; return P(n.x, axisY(n.k, z), z); });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 11 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    knives.forEach((n, k) => {
      const d = Math.abs(k - a);
      const z = a < 0 ? (k === FAV ? n.max * 0.45 : 0) : d === 0 ? n.max : d === 1 ? 4 : d === 2 ? 1.5 : 0;
      tset(n.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      n.handle.sil.classList.toggle("hi", on); n.blade.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "knife " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "knifeblock",
  means: "Six knives in a leaning block: the one under the pointer slides up out of its slot and shows its blade, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[172, 150], [226, 175], [200, 162], null],
  mount,
});
