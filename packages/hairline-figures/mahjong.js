/** mahjong: round 92 figure. */
const { Cam, fit, hull, poly, open, seg, proj, rrect, circ, ringAt, run, facing, tdone, tset, tval, tween, spring, stepS, clamp, disposer, mk, pointer, put, register, solid } = HL;
const VIEW = [0.61, 0.61, 0.5];
const blkOf = (P) => (T, w, d, h, r, b) => {
  const ring = rrect(-w / 2, -d / 2, w / 2, d / 2, r, 3), inn = rrect(-w / 2 + b, -d / 2 + b, w / 2 - b, d / 2 - b, Math.max(r - b, 0.3), 3);
  const pts = [];
  for (const q of ring) pts.push(P(...T(q.u, q.v, 0)), P(...T(q.u, q.v, h)));
  const o = T(0, 0, 0), t = T(0, 0, 1), dn = (t[0] - o[0]) * VIEW[0] + (t[1] - o[1]) * VIEW[1] + (t[2] - o[2]) * VIEW[2];
  const zf = dn > 0.02 ? h : dn < -0.02 ? 0 : -1;
  return { sil: poly(hull(pts)), crease: zf < 0 ? "" : poly(inn.map((q) => P(...T(q.u, q.v, zf)))) };
};
const boxOf = (blk) => (x0, y0, x1, y1, z0, z1, r = 3, b = 1.5) => blk((u, v, w) => [(x0 + x1) / 2 + u, (y0 + y1) / 2 + v, z0 + w], x1 - x0, y1 - y0, z1 - z0, r, b);
const rowHit = (mids, dxMax, dyMax) => ([sx, sy]) => {
  let best = -1, bd = Infinity;
  mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
  return bd < dxMax && Math.abs(mids[best][1] - sy) < dyMax ? best : -1;
};

const N = 7, STEP = 14, TW = 12, TH = 17, TT = 7, RZ = 5, FAV = 4, X1 = (N - 1) * STEP;
const restA = (k) => (k === FAV ? 64 : 5 + (k % 3) * 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-10, -16, 0], [X1 + 10, 13, 0], [-10, 13, 0], [X1 + 10, -16, RZ + TH], [-10, 1, RZ + TH]], 200, 166);
  const P = proj(C), blk = blkOf(P), box = boxOf(blk);
  const g = mk("g", {}, svg);
  put(solid(g), box(-10, -2, X1 + 10, 12, 0, RZ, 3, 1.5));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp), pip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: k * STEP, s, pip, a: tween(restA(k)), last: NaN });
  }
  put(solid(g), box(-10, 9, X1 + 10, 12, RZ, RZ + 2.4, 1, 0.5));
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
    const T = (u, v, w) => { const dy = w, dz = TH / 2 + v; return [it.x + u, 1 + dy * c - dz * sn, RZ + dy * sn + dz * c]; };
    put(it.s, blk(T, TW, TH, TT, 2, 1.2));
    it.pip.setAttribute("d", poly(circ(2.6, 16).map((q) => P(...T(q.u, q.v + 2, TT)))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const hit = rowHit(items.map((it) => P(it.x, 4.5, RZ + TH / 2)), 18, 50);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? restA(k) : dd === 0 ? 80 : dd === 1 ? 30 : dd === 2 ? 15 : 4;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tile " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mahjong",
  means: "Seven tiles standing on a rack: the tile under the pointer tips back to lie face up, and its neighbours lean after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[129, 111], [189, 140], [246, 170], null],
  mount,
});
