/**
 * Hanger rail: a shop's clothes rail on two uprights with flat feet, nine
 * garments hanging on wire hangers. The pointer parts the clothes: the garment
 * under it holds still and the rest slide away along the rail, nearest first,
 * opening a gap round the chosen one, which goes bright. At rest the garments
 * hang in two loose clusters, one bright. The slider is how wide the gap opens.
 *
 * The pattern: a discrete pick (which garment) on 700ms tweens staggered by
 * distance; the hit is each garment's rest centre on screen, which never moves.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, open, clamp,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const REST = [-46, -37, -29, -20, -4, 6, 15, 25, 36], LOW = [20, 26, 16, 24, 18, 28, 22, 17, 25];
const FAV = 4, RX = 64, RZ = 70;
const shift = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-RX - 4, -20, 0], [RX + 4, 20, 0], [-RX, 0, RZ + 4], [RX, 0, RZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let gap = 14 * value;

  const upright = (x) => {
    put(solid(g), prism(P, front, ...rings(x - 3.5, -20, x + 3.5, 20, 3, 1.2), 0, 2.6));
    put(solid(g), prism(P, front, ...rings(x - 1.6, -1.6, x + 1.6, 1.6, 1.2, 0.5), 2.6, RZ + 2));
  };
  upright(-RX);
  put(solid(g), prism(P, front, ...rings(-RX, -1.1, RX, 1.1, 1, 0.4), RZ - 2, RZ));

  const [GR, GI] = rings(-1.3, -12, 1.3, 12, 1.1, 0.5);
  const items = REST.map((x, i) => {
    const grp = mk("g", {}, g);
    const body = solid(grp);
    const wire = mk("path", { class: "nf sil" }, grp);
    return { i, x, body, wire, tw: tween(0), drawn: NaN };
  });
  upright(RX);

  function draw(it, now) {
    const x = it.x + tval(it.tw, now);
    if (Math.abs(x - it.drawn) < 1e-3) return;
    it.drawn = x;
    put(it.body, prism(P, front, shift(GR, x), shift(GI, x), LOW[it.i], RZ - 12));
    it.wire.setAttribute("d",
      open([P(x, -12, RZ - 11), P(x, 0, RZ - 4), P(x, 12, RZ - 11)]) +
      open([P(x, 0, RZ - 4), P(x, 0, RZ + 1.5), P(x, -2.2, RZ + 3), P(x, -3.4, RZ + 1)]));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const it of items) { draw(it, now); if (!tdone(it.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let a = null;
  function retarget() {
    const now = performance.now();
    for (const it of items) {
      let to = 0;
      if (a !== null && it.i !== a) {
        const d = it.i - a, f = clamp(1.25 - Math.abs(d) * 0.15, 0.45, 1);
        to = Math.sign(d) * gap * f;
        to = clamp(to, -RX + 6 - it.x, RX - 6 - it.x);
      }
      tset(it.tw, to, now, a === null ? 0 : Math.abs(it.i - a) * 40);
      it.body.sil.classList.toggle("hi", a === null ? it.i === FAV : it.i === a);
    }
    read.textContent = a === null ? "rest" : "hanger " + (a + 1);
    B.wake();
  }

  const cx = items.map((it) => P(it.x, 0, 40)[0]);
  const top = P(0, 0, RZ + 6)[1] - 30, bot = P(0, 0, 0)[1] + 40;
  bag.add(pointer(stage, {
    move: (p) => {
      let best = null, bd = Infinity;
      cx.forEach((x, i) => { const d = Math.abs(p[0] - x); if (d < bd) { bd = d; best = i; } });
      const nx = bd < 24 && p[1] > top && p[1] < bot ? best : null;
      if (nx !== a) { a = nx; retarget(); }
    },
    leave: () => { a = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { gap = 14 * v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "clotheshanger",
  means: "A clothes rail of nine hanging garments: the pointer parts them, the rest slide away along the rail and the chosen one is bright.",
  rules: [1, 2, 3, 5],
  range: [0.5, 1, 1.4],
  tour: [[194, 150], [137, 121], [250, 177], null],
  mount,
});
