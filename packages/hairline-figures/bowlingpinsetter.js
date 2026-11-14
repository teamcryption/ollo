/**
 * Shuttlecocks: three tubes of shuttlecocks standing on the floor, each
 * with a cap. The pointer picks a tube by where it stands: its cap lifts
 * and the top shuttlecock rises out of it, cork first in the tube, and the
 * tubes beside it ease their caps a little, staggered from it. At rest one
 * cap is ajar, bright, with a skirt peeking out. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, R = 10, H = 54, CAPL = 42, SHL = 23, FAV = 1, REST = 0.4;
const XS = [0, 30, 60], YS = [5, -5, 3];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R - 5, 0], [60 + R, R + 5, 0], [60 + R, -R - 5, 0], [-R, R + 5, 0], [0, 5, H + CAPL + 8], [60, 3, H + CAPL + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = XS[k], y = YS[k], grp = mk("g", {}, g);
    const ring = disc(x, y, R), fr = run(ring, front);
    put(solid(grp), prism(P, front, ring, disc(x, y, R - 1.6), 0, H));
    const sh = mk("g", {}, grp);
    const skirt = mk("path", { class: "" }, sh), lip = mk("path", { class: "nf lo" }, sh);
    const quills = mk("path", { class: "nf lo" }, sh), cork = mk("path", { class: "" }, sh);
    const wall = mk("path", { class: "sil" }, grp);
    wall.setAttribute("d", poly(ringAt(P, fr, H).concat(ringAt(P, fr, 0).reverse())));
    const cap = solid(grp);
    items.push({ k, x, y, skirt, lip, quills, cork, cap, t: tween(k === FAV ? REST : 0), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const { x, y } = it, z = H - 26 + t * SHL;
    // cork down, skirt opening upward
    const cork = ringAt(P, disc(x, y, 2.2, 16), z).concat(ringAt(P, disc(x, y, 3.8, 20), z + 1.5), ringAt(P, disc(x, y, 3.8, 20), z + 4.5));
    it.cork.setAttribute("d", poly(hull(cork)));
    const top = disc(x, y, 8.6, 36);
    it.skirt.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 3.6, 20), z + 4).concat(ringAt(P, top, z + 24)))));
    it.lip.setAttribute("d", poly(ringAt(P, disc(x, y, 7.4, 36), z + 22)));
    let d = "";
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * (0.05 + i * 0.18);
      d += open([P(x + 3.6 * Math.cos(a), y + 3.6 * Math.sin(a), z + 4), P(x + 8.6 * Math.cos(a), y + 8.6 * Math.sin(a), z + 24)]);
    }
    it.quills.setAttribute("d", d);
    const cz = H - 4 + t * CAPL;
    put(it.cap, prism(P, front, disc(x, y, R + 1.2), disc(x, y, R - 0.6), cz, cz + 8));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 95 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? 1 : dd === 1 ? 0.12 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bowlingpinsetter",
  means: "Three shuttlecock tubes: the tube under the pointer lifts its cap and a shuttlecock rises out, cork first.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 135], [209, 153], [248, 186], null],
  mount,
});
