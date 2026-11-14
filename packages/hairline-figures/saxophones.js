/**
 * Saxophones: three saxophones resting on pegs along a low stand, each a
 * curved brass tube with a flared bell. The pointer picks one by where it
 * stands: it lifts off its peg and its neighbours rise a little, staggered
 * from it. At rest the middle one is half raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 34, LIFT = 16, FAV = 1, BZ = 4, PEG = 5;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// the centreline in the sax's own plane: [x, z, half-width]
const LINE = [];
for (let i = 0; i <= 4; i++) { const t = i / 4; LINE.push([-7 + 7 * Math.sin(t * Math.PI / 2), 68 - 6 * t, 1.2 + 0.4 * t]); }
for (let i = 1; i <= 8; i++) { const t = i / 8; LINE.push([0, 62 - 48 * t, 1.6 + 2.2 * t]); }
for (let i = 1; i <= 8; i++) { const a = Math.PI - (i / 8) * Math.PI; LINE.push([6 + 6 * Math.cos(a), 14 - 6 * Math.sin(a), 3.8 + 0.3 * i / 8]); }
for (let i = 1; i <= 6; i++) { const t = i / 6; LINE.push([12 + 4 * t, 14 + 22 * t, 4.1 + 1.6 * t * t]); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const Y1 = (N - 1) * STEP;
  fit(C, [[-16, -12, 0], [30, Y1 + 12, 0], [-16, Y1 + 12, 0], [30, -12, 0], [-9, 0, 70 + LIFT + BZ + PEG], [-9, Y1, 70 + BZ + PEG]], 200, 166);
  const P = proj(C), front = facing(C), S = 2.2;
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-16, -12, 30, Y1 + 12, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const y = k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(6, y, 3), disc(6, y, 2), BZ, BZ + PEG));
    const body = mk("path", { class: "sil" }, grp), bell = mk("path", { class: "lo" }, grp), keys = mk("path", { class: "nf lo" }, grp);
    items.push({ k, y, grp, body, bell, keys, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + PEG - 8 + lift, pts = LINE.map(([x, z]) => P(x, it.y, z0 + z)), L = [], R = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b[0] - a[0], ty = b[1] - a[1], d = Math.hypot(tx, ty) || 1, w = LINE[i][2] * S;
      L.push([p[0] - (ty / d) * w, p[1] + (tx / d) * w]); R.push([p[0] + (ty / d) * w, p[1] - (tx / d) * w]);
    });
    const top = LINE[LINE.length - 1], rim = ringAt(P, disc(top[0], it.y, 7, 28), z0 + top[1]);
    it.body.setAttribute("d", poly(L.concat(R.reverse())));
    it.bell.setAttribute("d", poly(rim));
    let k = "";
    for (const zz of [24, 32, 40, 48]) { const c = P(0, it.y, z0 + zz); k += `M${c[0] + 2.4},${c[1]}a2.4,1.2 0 1,0 0.01,0z`; }
    it.keys.setAttribute("d", k);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(6, it.y, BZ + PEG + 36));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "sax " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "saxophones",
  means: "Three saxophones on pegs along a stand: the one under the pointer lifts off its peg, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[251, 136], [198, 163], [146, 189], null],
  mount,
});
