/**
 * Guitars: an acoustic, an electric and a bass, each standing on its own
 * floor stand with a back post and a yoke. A body is two bouts joined at the
 * waist, drawn as a thin plate (a front outline and its thickness), with a
 * neck and a headstock. The pointer picks a guitar by where it stands: it
 * lifts off its stand and tilts, and the guitars beside it lift a little,
 * staggered from it. At rest each leans its own way and the electric sits a
 * touch high, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the
 * guitar whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fillet, fit, open, poly, prism, proj, facing, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const KIND = [
  { lo: [0, 14, 14], up: [0, 31, 10.5], neck: [40, 74, 1.8], head: [74, 84, 2.8], T: 5, hole: [0, 26, 4.2] },
  { lo: [0, 12, 12], up: [2.5, 25, 8.5], neck: [30, 68, 1.6], head: [68, 77, 2.5], T: 3, pick: [9, 17] },
  { lo: [0, 12, 12.5], up: [-2, 25, 9], neck: [30, 88, 1.7], head: [88, 96, 2.6], T: 3.5, pick: [14] },
];
const GX = [0, 46, 92], Y = 10, FAV = 1, REST_T = [-3, 2, -4];
const ring2 = (c, n = 44) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [c[0] + c[2] * Math.cos(t), c[1] + c[2] * Math.sin(t)]; });
function outside(pts, c) {
  const k = pts.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1]) > c[2]), n = pts.length, out = [];
  let i = k.findIndex((v, j) => v && !k[(j + n - 1) % n]);
  while (k[i % n] && out.length < n) out.push(pts[i++ % n]);
  return out;
}
const rect = (w, a, b, r) => fillet([[-w, a], [w, a], [w, b], [-w, b]], [r, r, r, r], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-16, Y - 8, 0], [108, Y + 14, 0], [-20, Y, 112], [110, Y, 112], [-16, Y + 14, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const gs = KIND.map((K, k) => {
    const gx = GX[k], grp = mk("g", {}, g);
    const [br, bi] = rings(gx - 15, Y - 9, gx + 15, Y + 13, 4, 1.2);
    put(solid(grp), prism(P, front, br, bi, 0, 2));
    put(solid(grp), prism(P, front, rings(gx - 1.2, Y - 7, gx + 1.2, Y - 4.6, 0.6, 0.3)[0], null, 2, 56));
    const [yr, yi] = rings(gx - 6, Y - 7.4, gx + 6, Y - 3.4, 1.4, 0.6);
    put(solid(grp), prism(P, front, yr, yi, 54, 57));
    const body = fillet(outside(ring2(K.lo), K.up).concat(outside(ring2(K.up), K.lo)), Array(80).fill(2.5), 3);
    const shapes = [rect(K.neck[2], K.neck[0], K.neck[1], 0.6), rect(K.head[2], K.head[0], K.head[1], 1.4), body];
    const parts = shapes.map((s) => ({ s, back: mk("path", { class: "lo" }, grp), face: mk("path", { class: "sil" }, grp) }));
    const marks = mk("path", { class: "nf lo" }, grp);
    return { k, K, gx, parts, marks, L: tween(k === FAV ? 3 : 0), A: tween(REST_T[k]), last: "" };
  });

  function draw(G, L, a) {
    const key = L.toFixed(2) + "," + a.toFixed(2);
    if (key === G.last) return false;
    G.last = key;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), K = G.K;
    const W = (u, w, y) => P(G.gx + u * c + w * s, y, 2 + L + w * c - u * s);
    for (const p of G.parts) {
      p.back.setAttribute("d", poly(p.s.map(([u, w]) => W(u, w, Y))));
      p.face.setAttribute("d", poly(p.s.map(([u, w]) => W(u, w, Y + K.T))));
    }
    let d = "";
    if (K.hole) d += poly(ring2(K.hole, 24).map(([u, w]) => W(u, w, Y + K.T)));
    for (const w of K.pick || []) d += poly(rect(5.5, w - 1.2, w + 1.2, 0.8).map(([u, ww]) => W(u, ww, Y + K.T)));
    d += open([W(0, 5, Y + K.T), W(0, K.neck[1], Y + K.T)]);
    G.marks.setAttribute("d", d);
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const G of gs) { draw(G, tval(G.L, now), tval(G.A, now)); if (!tdone(G.L, now) || !tdone(G.A, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = gs.map((G) => P(G.gx, Y, 40));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    gs.forEach((G, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(G.L, a < 0 ? (k === FAV ? 3 : 0) : d === 0 ? 14 : d === 1 ? 4 : 1, now, delay);
      tset(G.A, a < 0 ? REST_T[k] : d === 0 ? (k === 2 ? -9 : 9) : REST_T[k] * 1.6, now, delay);
      for (const p of G.parts) p.face.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "guitar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "guitars",
  means: "Three guitars on stands: the one under the pointer lifts off its stand and tilts, and its neighbours lift a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[150, 160], [200, 170], [250, 190], null],
  mount,
});
