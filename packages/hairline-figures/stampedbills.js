/**
 * Money clip: a fanned stack of folded notes held by a sprung metal clip.
 * The pointer picks a note by where it stands: that note slides out of the
 * clip, and the notes beside it slide a little, staggered from it. At rest
 * one note stands drawn out, bright, and the others sit unevenly. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, DX = 8, DY = 4, L = 60, D = 30, T = 1.4, OUT = 26, FAV = 2;
const REST = [0, 3, 10, 2, 1];
const CX0 = 36, CX1 = 46, TOP = N * T + 0.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.4);
  const XM = (N - 1) * DX + L + OUT, YM = (N - 1) * DY + D;
  fit(C, [[-2, -6, -2], [XM, YM, -2], [XM, -6, -2], [-2, YM, -2], [XM, YM, TOP + 3], [-2, -6, TOP + 3]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(CX0, -4, CX1, YM + 1, 1.5, 0.6);
  put(solid(g), prism(P, front, lr, li, -1.6, -0.2));
  const items = [];
  for (let k = 0; k < N; k++) items.push({ k, s: solid(g), x: tween(REST[k]), last: NaN });
  const top = solid(g);
  put(top, prism(P, front, lr, li, TOP, TOP + 1.4));
  const [br, bi] = rings(CX0, -5.6, CX1, -4, 0.6, 0.5);
  put(solid(g), prism(P, front, br, bi, -1.6, TOP + 1.4));

  function draw(now) {
    for (const it of items) {
      const o = tval(it.x, now);
      if (o === it.last) continue;
      it.last = o;
      const x0 = it.k * DX + o, y0 = it.k * DY;
      const [r, i] = rings(x0, y0, x0 + L, y0 + D, 2, 1.6);
      put(it.s, prism(P, front, r, i, it.k * T, it.k * T + T * 0.8));
    }
  }

  const B = register(stage, (_dt, now) => { draw(now); return items.some((it) => !tdone(it.x, now)); });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.k * DX + L - 6, it.k * DY + D / 2, it.k * T));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), x = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 7 : 2;
      tset(it.x, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "note " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stampedbills",
  means: "A fanned stack of notes in a money clip: the note under the pointer slides out of the clip, and its neighbours slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[222, 190], [202, 170], [241, 211], null],
  mount,
});
