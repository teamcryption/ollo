/**
 * Hard hats: four site helmets on a wall shelf, each a dome with a raised
 * crest over a brim that runs out to a peak at the front. The pointer picks
 * a hat by where it stands: it lifts off the shelf, and the hats beside it
 * rise a little, staggered from it. At rest one hat is lifted, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, BR = 14, DR = 10.5, SZ = 4, LIFT = 22, FAV = 1, WALL = 40;
const X1 = (N - 1) * STEP + 2 * BR + 4;
const disc = (x, y, r, n = 28, sy = 1, dy = 0) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v * sy + y + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -4, -6], [X1 + 4, 34, 0], [X1 + 4, -4, WALL], [-4, -4, WALL], [-4, 40, 0], [X1 - BR, 16, SZ + LIFT + DR + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-4, -5, X1 + 4, -1, 1.5, 0.6);
  put(solid(g), prism(P, front, wr, wi, -6, WALL));
  const [sr, si] = rings(-4, -1, X1 + 4, 38, 3, 1.4);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + 2 + k * STEP, y = 15, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, BR + 1, 28, 1.3, 4), SZ)), class: "nf dash" }, grp);
    const brim = solid(grp), dome = mk("path", { class: "sil" }, grp), crest = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, brim, dome, crest, z: tween(k === FAV ? LIFT * 0.65 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y } = it, b = SZ + 0.4 + lift;
    put(it.brim, prism(P, front, disc(x, y, BR, 32, 1.3, 4), disc(x, y, BR - 1.2, 32, 1.3, 4), b, b + 1.4));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, DR * Math.cos(t) + 0.01, 28, 1.1), b + 1.4 + DR * 1.05 * Math.sin(t))); }
    it.dome.setAttribute("d", poly(hull(pts)));
    const cr = [];
    for (let i = 1; i < 12; i++) { const t = (i / 12) * Math.PI; cr.push(P(x, y - DR * 1.1 * Math.cos(t), b + 1.4 + DR * 1.05 * Math.sin(t) + 2)); }
    it.crest.setAttribute("d", open(cr));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + DR / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.65 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.dome.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hardhats",
  means: "Four hard hats on a wall shelf: the hat under the pointer lifts off the shelf, and the hats beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 140], [200, 165], [250, 190], null],
  mount,
});
