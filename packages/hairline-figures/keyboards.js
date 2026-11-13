/**
 * Keyboard keys: one keyboard lying on the desk, a low case holding four
 * staggered rows of keycaps and a long space bar. The pointer presses the
 * keys: the key under it goes down the deepest and is bright, and the keys
 * around it give a little, falling off with distance. At rest a few keys
 * sit half pressed in a soft ripple, one bright. The slider is the reach.
 *
 * The pattern: a field answering a point (terrain's falloff, a spring per
 * key); the hit is on the keycaps' rest top, a plane that never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 10, KS = 9, G = 1.6, CASE = 4, KT = 11, DEEP = 5, FAV = [1, 4];
const OFF = [0, 2.5, 4.5, 7];
const W = NC * (KS + G) + 7 + 2 * G + 4, Dp = 5 * (KS + G) + 2 * G + 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [W, Dp, 0], [W, 0, KT], [0, Dp, KT], [0, 0, KT], [W, Dp, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, Dp, 4, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, CASE));

  const keys = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < NC - (r === 3 ? 1 : 0); c++) {
    const x0 = 2 + G + OFF[r] + c * (KS + G), y0 = 2 + G + r * (KS + G);
    keys.push({ r, c, x0, y0, x1: x0 + KS, y1: y0 + KS });
  }
  const sx0 = 2 + G + 3 * (KS + G) - 2, sy0 = 2 + G + 4 * (KS + G);
  keys.push({ r: 4, c: 0, x0: sx0, y0: sy0, x1: sx0 + 5 * (KS + G) - G + 4, y1: sy0 + KS });
  for (const k of keys) {
    k.cx = (k.x0 + k.x1) / 2; k.cy = (k.y0 + k.y1) / 2;
    // the rest ripple: a soft wave across the board, never flat
    k.rest = clamp(0.5 + 0.45 * Math.sin(k.cx * 0.09 + k.cy * 0.14), 0, 1) * 0.9;
    k.sp = spring(k.rest);
    k.ring = rings(k.x0, k.y0, k.x1, k.y1, 1.6, 0.9);
    k.drawn = NaN;
  }
  keys.sort((a, b) => a.cx + a.cy - (b.cx + b.cy));
  for (const k of keys) k.el = solid(g);

  function draw(k) {
    const d = k.sp.x;
    if (Math.abs(d - k.drawn) < 1e-3) return;
    k.drawn = d;
    put(k.el, prism(P, front, k.ring[0], k.ring[1], CASE - 0.5, KT - d));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const k of keys) { if (stepS(k.sp, dt)) m = true; draw(k); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    if (over) for (const k of keys) {
      const dx = Math.max(k.x0 - over[0], 0, over[0] - k.x1), dy = Math.max(k.y0 - over[1], 0, over[1] - k.y1);
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; near = k; }
    }
    if (bd > 3) near = null;
    const R = 10 + 22 * reach;
    for (const k of keys) {
      let t = k.rest;
      if (near) {
        const d = Math.hypot(k.cx - near.cx, k.cy - near.cy) / R;
        t = k === near ? DEEP : d >= 1 ? 0.15 : DEEP * 0.62 * Math.pow(1 - d, 2) + 0.15;
      }
      k.sp.t = t;
      k.el.sil.classList.toggle("hi", near ? k === near : k.r === FAV[0] && k.c === FAV[1]);
    }
    read.textContent = near ? (near.r === 4 ? "space" : `key ${near.c + 1}·${near.r + 1}`) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], KT); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "keyboards",
  means: "A keyboard of staggered keycaps: the key under the pointer presses down deepest and bright, the keys around it give a little.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[160, 106], [194, 132], [243, 191], null],
  mount,
});
