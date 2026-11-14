/**
 * Letter trays: three trays stacked between two side panels, each holding a
 * pile of sheets. The pointer picks a tray by height: it slides out toward
 * the reader, and the trays beside it slide a little, staggered from it. At
 * rest the middle tray stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a stack, picked by rest pose (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 64, D = 46, TH = 8, GAP = 15, Z0 = 3, OUT = 24, FAV = 1, H = Z0 + (N - 1) * GAP + TH + 6;
const PILE = [2.4, 4, 1.4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-3, -2, 0], [W + 3, D + 2, 0], [W + 3, -2, H], [-3, -2, H], [0, D + OUT, Z0], [W, D + OUT, Z0], [-3, D + 2, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return put(solid(parent), prism(P, front, o, i, z0, z1)); };

  // far panel, the trays from the bottom up, then the near panel over them
  box(-3, -2, 0, D + 2, 1.2, 0.6, 0, H);
  box(-3, -2, W + 3, D + 2, 3, 1.4, 0, 2.4);
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, z: Z0 + k * GAP, grp, tray: solid(grp), pile: solid(grp), y: tween(k === FAV ? OUT * 0.5 : 0), last: NaN });
  }
  box(W, -2, W + 3, D + 2, 1.2, 0.6, 0, H);

  function draw(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    const [o, i] = rings(1, dy, W - 1, D + dy, 3, 2.2);
    put(it.tray, prism(P, front, o, i, it.z, it.z + TH));
    const [po, pi] = rings(7, dy + 5, W - 9, D + dy - 7, 1, 0.8);
    put(it.pile, prism(P, front, po, pi, it.z + TH, it.z + TH + PILE[it.k]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: each tray's rest front, nearest on screen
  const mids = items.map((it) => P(W / 2, D, it.z + TH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][0] - sx) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tray.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailtray",
  means: "Three stacked letter trays: the tray under the pointer slides out toward you, and the trays beside it slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[174, 222], [174, 187], [174, 151], null],
  mount,
});
