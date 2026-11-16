/** puzzlebox: round 92 figure. */
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

const N = 4, SW = 16, L = 64, BZ = 16, SZ = 9, FAV = 2;
const restS = (k) => [3, 0, 24, 6][k];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-2, -2, 0], [L + 2, L + 40, 0], [-2, L + 40, 0], [L + 2, -2, BZ + SZ], [-2, -2, BZ + SZ]], 200, 166);
  const P = proj(C), blk = blkOf(P), box = boxOf(blk);
  const g = mk("g", {}, svg);
  put(solid(g), box(0, 0, L, L, 0, BZ, 4, 1.8));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp), pin = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: k * SW + SW / 2, s, pin, y: tween(restS(k)), last: NaN });
  }
  function draw(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    put(it.s, box(it.x - SW / 2 + 0.8, dy, it.x + SW / 2 - 0.8, L + dy, BZ, BZ + SZ, 2.5, 1.4));
    it.pin.setAttribute("d", poly(circ(2.2, 14).map((q) => P(it.x + q.u, L + dy - 7 + q.v, BZ + SZ))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const hit = rowHit(items.map((it) => P(it.x, L / 2, BZ + SZ)), 16, 80);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? restS(k) : dd === 0 ? 38 : dd === 1 ? 12 : 3;
      tset(it.y, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "puzzlebox",
  means: "A puzzle box with four slats on its lid: the slat under the pointer slides out of its track, and its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[190, 96], [252, 126], [282, 142], null],
  mount,
});
