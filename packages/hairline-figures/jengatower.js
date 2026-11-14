/**
 * Block tower: a stacked tower of wooden blocks, three to a layer, each layer
 * turned a quarter from the one below. The pointer picks a layer by its
 * height: that layer's middle block slides out of the tower, and the layers
 * beside it nudge theirs a little, staggered. At rest one block sits half
 * pushed, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column, picked by rest height.
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, W = 45, BW = 15, H = 9, OUT = 32, FAV = 3, G = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [W + OUT + 2, W + 4, 0], [W + 4, W + OUT + 2, 0], [-4, -4, N * H], [W, W, N * H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, W + 6, W + 6, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, -3, 0));

  const layers = [];
  for (let L = 0; L < N; L++) {
    const z0 = L * H, z1 = z0 + H - G, along = L % 2 === 0;
    const lay = { L, z0, z1, along, mid: null, off: tween(L === FAV ? OUT * 0.5 : 0), last: NaN };
    for (let j = 0; j < 3; j++) {
      const s = solid(g);
      const a = j * BW + G, b = (j + 1) * BW - G;
      if (j === 1) { lay.mid = s; lay.a = a; lay.b = b; continue; }
      const [r, i] = along ? rings(0, a, W, b, 2, 1.2) : rings(a, 0, b, W, 2, 1.2);
      put(s, prism(P, front, r, i, z0, z1));
    }
    layers.push(lay);
  }

  function draw(lay, d) {
    if (d === lay.last) return;
    lay.last = d;
    const [r, i] = lay.along ? rings(d, lay.a, W + d, lay.b, 2, 1.2) : rings(lay.a, d, lay.b, W + d, 2, 1.2);
    put(lay.mid, prism(P, front, r, i, lay.z0, lay.z1));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const lay of layers) { draw(lay, tval(lay.off, now)); if (!tdone(lay.off, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = layers.map((lay) => P(W / 2, W / 2, lay.z0 + H / 2));
  const half = Math.abs(P(W, 0, 0)[0] - P(0, W, 0)[0]) / 2;
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < H * 2.5 && Math.abs(mids[best][0] - sx) < half + 10 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    layers.forEach((lay, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 9 : 0;
      tset(lay.off, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      lay.mid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "row " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jengatower",
  means: "A stacked block tower: the layer under the pointer slides its middle block out, and the layers beside it nudge theirs.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 145], [200, 85], [200, 215], null],
  mount,
});
