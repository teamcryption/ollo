/**
 * Bread slicer: a sliced loaf standing on a board. The pointer picks a slice
 * by where it stands: it slides out of the loaf toward the viewer and leans
 * away, and the slices beside it slide a little after it, staggered by
 * distance. At rest the end slice stands loose, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row, answering with a slide.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, T = 5, GAP = 1.2, BZ = 4, OUT = 24, FAV = N - 1;
const X0 = 10, Y = 22, L = X0 * 2 + N * (T + GAP);
// a slice's face, in (v, z): a flat foot and a domed crust
const FACE = [[11, 0], [12.5, 1.5], [-12.5, 1.5], [-11, 0]];
for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; FACE.push([13 * Math.cos(t), 15 + 9 * Math.sin(t)]); }
const INNER = FACE.map(([v, z]) => [v * 0.8, 2.5 + (z - 1) * 0.8]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[0, 0, 0], [L, 2 * Y, 0], [L, 0, 0], [0, 2 * Y, 0], [X0, Y, BZ + 25], [L - X0, Y + OUT + 14, BZ + 20]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, 2 * Y, 6, 2);
  put(solid(g), prism(P, facing(C), br, bi, 0, BZ));

  const rest = (k) => (k === FAV ? [6, 10] : [0, 0]);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * (T + GAP), grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cre = mk("path", { class: "nf lo" }, grp);
    const [s, a] = rest(k);
    items.push({ k, x, grp, sil, cre, s: tween(s), a: tween(a), last: "" });
  }

  function draw(it, s, a) {
    const key = s.toFixed(2) + "," + a.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const sn = Math.sin(a * Math.PI / 180), cs = Math.cos(a * Math.PI / 180);
    // leans away from the loaf, about its foot
    const t = (dx, v, z) => P(it.x + dx * cs + z * sn, Y + s + v, BZ + z * cs - dx * sn);
    const pts = [];
    for (const [v, z] of FACE) pts.push(t(0, v, z), t(T, v, z));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cre.setAttribute("d", open(INNER.slice(4).map(([v, z]) => t(T, v, z))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now), tval(it.a, now)); if (!tdone(it.s, now) || !tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + T / 2, Y, BZ + 12));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const tg = items.map((it, k) => {
      const dd = Math.abs(k - a);
      return a < 0 ? rest(k) : dd === 0 ? [OUT, 14] : dd === 1 ? [5, 3] : [0, 0];
    });
    // nearer slices paint later: order by x + slide target
    items.slice().sort((p, q) => p.x + tg[p.k][0] - q.x - tg[q.k][0]).forEach((it) => g.appendChild(it.grp));
    items.forEach((it, k) => {
      const d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.s, tg[k][0], now, d);
      tset(it.a, tg[k][1], now, d);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slice " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "breadslicer",
  means: "A sliced loaf on a board: the slice under the pointer slides out toward you and leans away, its neighbours follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 118], [183, 133], [245, 164], null],
  mount,
});
