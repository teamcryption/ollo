/**
 * Soda fountain: a tower on a counter with four taps along its face, a drip
 * tray under them. The pointer picks a tap by where it stands: its handle
 * pulls forward and a stream drops to the tray; the handles beside it give a
 * little, staggered from it. At rest one tap is half pulled, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 24, X0 = 15, PY = 16, PZ = 40, HL_ = 22, PULL = 58, FAV = 1;
const REST = [6, 26, 10, 3];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  const XN = X0 + (N - 1) * STEP + X0;
  fit(C, [[-6, -2, 0], [XN + 6, 40, 0], [XN + 6, -2, 0], [-6, 40, 0], [0, 0, 56], [XN, 0, 56], [X0, PY + HL_, PZ + 24]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [tr, ti] = rings(0, 0, XN, 14, 6, 1.8);
  put(solid(g), prism(P, front, tr, ti, 0, 50));
  const [cr, ci] = rings(-3, -2, XN + 3, 16, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 50, 55));
  const [dr, di] = rings(-4, 14, XN + 4, 38, 5, 2.2);
  put(solid(g), prism(P, front, dr, di, 0, 4));
  for (let k = 0; k < 9; k++) { const x = 6 + k * (XN - 12) / 8; mk("path", { d: seg(P(x, 18, 4), P(x, 34, 4)), class: "nf lo" }, g); }

  const taps = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const stream = mk("path", { class: "nf dash" }, grp);
    const [sr, si] = rings(x - 3, 13, x + 3, 25, 2.2, 0.8);
    put(solid(grp), prism(P, front, sr, si, 33, 37.5));
    put(solid(grp), prism(P, front, disc(x, 22.5, 1.8), disc(x, 22.5, 1), 29.5, 33));
    const h = solid(grp);
    h.sil.classList.add("sil");
    taps.push({ k, x, stream, h, a: tween(REST[k]), last: NaN });
  }

  function draw(t, a) {
    if (a === t.last) return;
    t.last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), pts = [];
    for (let i = 0; i <= 6; i++) {
      const d = (i / 6) * HL_, r = 1.6 + 1.6 * (i / 6) * (i / 6);
      const ring = ringAt(P, disc(t.x, PY + d * s, r), PZ + d * c);
      pts.push(...ring);
    }
    t.h.sil.setAttribute("d", poly(hull(pts)));
    t.h.cr.setAttribute("d", "");
    t.stream.setAttribute("d", a > 30 ? seg(P(t.x, 22.5, 29), P(t.x, 22.5, 4)) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of taps) { draw(t, tval(t.a, now)); if (!tdone(t.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = taps.map((t) => P(t.x, 14, 34));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    taps.forEach((t, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? PULL : dd === 1 ? 16 : 3;
      tset(t.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      t.h.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sodafountain",
  means: "A soda fountain with four taps: the handle under the pointer pulls forward and pours into the tray; its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[172, 120], [218, 130], [250, 150], null],
  mount,
});
