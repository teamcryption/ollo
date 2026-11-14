/**
 * DJ decks: two turntables either side of a mixer on one long case. The
 * pointer picks a deck by where it stands: that deck's tonearm swings in onto
 * the record and the mixer's crossfader slides over to it. At rest the left
 * arm sits on its record, bright. The slider is the arm's reach.
 *
 * The pattern: one of a few in a single row (riffle), picked by screen x.
 */
const {
  Cam, circ, fit, lerp, facing, open, poly, prism, proj, rings, ringAt, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 150, D = 62, BZ = 8, PZ = 12, R = 23, LEN = 30;
const DECKS = [{ x: 30, y: 33, px: 55, py: 9 }, { x: 120, y: 33, px: 145, py: 9 }];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [W / 2, D / 2, PZ + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 0, BZ));

  const decks = DECKS.map((d, k) => {
    const grp = mk("g", {}, g);
    // platter, record, label
    put(solid(grp), prism(P, front, disc(d.x, d.y, R), disc(d.x, d.y, R - 2), BZ, PZ));
    mk("path", { d: poly(ringAt(P, disc(d.x, d.y, R - 6), PZ)), class: "nf lo" }, grp);
    mk("path", { d: poly(ringAt(P, disc(d.x, d.y, 6, 24), PZ)), class: "nf lo" }, grp);
    // tonearm pivot
    put(solid(grp), prism(P, front, disc(d.px, d.py, 4, 20), disc(d.px, d.py, 2.6, 20), BZ, PZ + 3));
    const arm = mk("path", { class: "sil nf" }, grp), head = mk("path", { class: "nf" }, grp);
    if (k === 0) d.after = mk("g", {}, g);
    return { ...d, k, grp, arm, head, a: tween(k === 0 ? 1 : 0), last: NaN };
  });

  // mixer between the decks, painted after the left deck
  const mix = decks[0].after;
  const [mr, mi] = rings(62, 8, 88, 56, 3, 1.4);
  put(solid(mix), prism(P, front, mr, mi, BZ, BZ + 5));
  const MZ = BZ + 5;
  for (const [u, v] of [[69, 16], [81, 16], [69, 25], [81, 25]]) mk("path", { d: poly(ringAt(P, disc(u, v, 2.4, 16), MZ)), class: "nf lo" }, mix);
  for (const u of [69, 81]) mk("path", { d: seg(P(u, 31, MZ), P(u, 42, MZ)), class: "lo" }, mix);
  mk("path", { d: seg(P(66, 50, MZ), P(84, 50, MZ)), class: "lo" }, mix);
  const fader = solid(mix);
  const fade = tween(0);
  let lastF = NaN;

  function drawArm(d, t) {
    if (t === d.last) return;
    d.last = t;
    const ang = rad(lerp(-25, 32 + 12 * reach, t)), z = PZ + 3;
    const ex = d.px - LEN * Math.sin(ang), ey = d.py + LEN * Math.cos(ang);
    const bx = d.px - LEN * 0.6 * Math.sin(ang + rad(8)), by = d.py + LEN * 0.6 * Math.cos(ang + rad(8));
    d.arm.setAttribute("d", open([P(d.px, d.py, z), P(bx, by, z), P(ex, ey, z)]));
    const [hr, hi] = rings(ex - 2.5, ey - 1.5, ex + 2.5, ey + 3.5, 1.2, 0.8);
    d.head.setAttribute("d", prism(P, front, hr, hi, z - 1.5, z).sil);
  }
  function drawFader(f) {
    if (f === lastF) return;
    lastF = f;
    const u = lerp(68, 82, f), [r, i] = rings(u - 2, 47.5, u + 2, 52.5, 1, 0.7);
    put(fader, prism(P, front, r, i, MZ, MZ + 2.5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of decks) { drawArm(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    drawFader(tval(fade, now)); if (!tdone(fade, now)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  const mids = decks.map((d) => P(d.x, d.y, PZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 70 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const on = a < 0 ? 0 : a;
    decks.forEach((d, k) => {
      tset(d.a, k === on ? 1 : 0, now, 0);
      d.arm.classList.toggle("hi", k === on);
    });
    tset(fade, a < 0 ? 0.2 : a, now, 0);
    read.textContent = a < 0 ? "rest" : a === 0 ? "deck A" : "deck B";
    for (const d of decks) d.last = NaN;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; for (const d of decks) d.last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "djdecks",
  means: "Two turntables and a mixer: the deck under the pointer swings its tonearm onto the record and the crossfader slides to it.",
  rules: [1, 4, 5, 8],
  range: [0, 0.5, 1],
  tour: [[143, 122], [205, 150], [252, 177], null],
  mount,
});
