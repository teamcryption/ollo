/**
 * Knee braces: four sleeve braces stood on pegs along a physio shelf, each a
 * different height, each with the round patella opening on its front. The
 * pointer picks a brace by where it stands: it lifts up its peg, and the
 * braces beside it rise a little, staggered from it. At rest one brace is
 * half lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, rings, ringAt, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, BR = 10, SZ = 5, LIFT = 18, FAV = 1, HT = [24, 30, 26, 32];
const X1 = (N - 1) * STEP + 2 * BR + 8, Y1 = 2 * BR + 8;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let stag = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [BR + 4, BR + 4, SZ + 32 + LIFT], [X1 - BR - 4, BR + 4, SZ + 32 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, X1, Y1, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + 4 + k * STEP, y = BR + 4, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 1.6, 12), disc(x, y, 0.8, 12), SZ, SZ + HT[k] + 4));
    const sil = mk("path", { class: "sil" }, grp), mouth = mk("path", { class: "nf lo" }, grp), cap = mk("path", { class: "nf lo" }, grp), strap = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, h: HT[k], sil, mouth, cap, strap, z: tween(k === FAV ? LIFT * 0.5 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, h } = it, z0 = SZ + lift, z1 = z0 + h;
    it.sil.setAttribute("d", poly(hull(ringAt(P, disc(x, y, BR), z0).concat(ringAt(P, disc(x, y, BR + 1), z1)))));
    it.mouth.setAttribute("d", poly(ringAt(P, disc(x, y, BR - 1.5), z1)));
    // the patella opening: a ring on the face toward the viewer
    const s = Math.SQRT1_2, cx = x + (BR + 0.5) * s, cy = y + (BR + 0.5) * s, cz = z0 + h * 0.5, pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(cx - 4 * Math.cos(t) * s, cy + 4 * Math.cos(t) * s, cz + 4 * Math.sin(t))); }
    it.cap.setAttribute("d", poly(pts));
    const band = [];
    for (let i = 0; i <= 12; i++) { const t = Math.PI / 4 + (i / 12 - 0.5) * 2.4; band.push(P(x + (BR + 0.3) * Math.cos(t), y + (BR + 0.3) * Math.sin(t), z0 + h * 0.84)); }
    it.strap.setAttribute("d", "M" + band.map((p) => p.join(",")).join("L"));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "brace " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "braces",
  means: "Four knee braces on pegs along a physio shelf: the brace under the pointer lifts up its peg, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 135], [176, 159], [273, 208], null],
  mount,
});
