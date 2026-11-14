/**
 * Button tin: three round sewing tins along a shelf, each holding a few
 * buttons. The pointer picks a tin by where it stands: its lid rises and
 * swings back off the rim to show the buttons, and the tins beside it ease
 * their lids a little, staggered from it. At rest one lid sits ajar, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 58, R = 24, H = 16, LIFT = 26, BACK = 22, FAV = 1, SZ = 4;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BTN = [[-9, -6, 6], [7, -9, 5], [10, 7, 6.5], [-6, 10, 5], [1, 1, 4.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-8, -8 - BACK, 0], [X1 + 8, 2 * R + 8, 0], [X1 + 8, -8 - BACK, 0], [-8, 2 * R + 8, 0], [R, R - BACK, SZ + H + LIFT + 6], [X1 - R, R, SZ + H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -8, X1 + 8, 2 * R + 8, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.6), SZ, SZ + H));
    mk("path", { d: poly(ringAt(P, disc(x, y, R - 2.5), SZ + H)), class: "nf lo" }, grp);
    for (const [bx, by, br] of BTN) {
      const b = mk("g", {}, grp);
      mk("path", { d: poly(ringAt(P, disc(x + bx, y + by, br, 20), SZ + H - 1)) }, b);
      mk("path", { d: poly(ringAt(P, disc(x + bx, y + by, br * 0.3, 8), SZ + H - 1)), class: "nf lo" }, b);
    }
    const lid = solid(grp);
    items.push({ k, x, y, lid, z: tween(k === FAV ? 0.4 : 0), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const z0 = SZ + H - 3 + LIFT * t, y = it.y - BACK * t, x = it.x;
    put(it.lid, prism(P, front, disc(x, y, R + 1.2), disc(x, y, R - 0.6), z0, z0 + 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.4 : 0) : dd === 0 ? 1 : dd === 1 ? 0.15 : 0;
      tset(it.z, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "buttonbox",
  means: "Three sewing tins on a shelf: the lid under the pointer rises and swings back to show the buttons; its neighbours ease open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 130], [188, 162], [253, 195], null],
  mount,
});
