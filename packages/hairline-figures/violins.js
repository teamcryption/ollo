/**
 * Violins: three violins hung by their scrolls on a wall panel, each a carved
 * body with its waist, a neck, a fingerboard and strings. The pointer takes
 * one down to look at it: the violin under it tilts out off the wall on its
 * hook, bright, and the others settle back flat. At rest they hang a little
 * askew, the first bright. The slider is how far the chosen violin tilts.
 *
 * The pattern: a discrete choice (a tween per violin, staggered by distance);
 * the hit is the nearest rest centre on screen x, which never moves.
 */
const {
  Cam, clamp, fit, mk, poly, proj, rad, seg, solid, open, rings, prism, facing,
  tween, tset, tval, tdone, disposer, pointer, put, register,
} = HL;

const N = 3, GAP = 36, HOOK = 96, WL = -62, WR = 62, WH = 112, REST = [12, 4, 7], FAV = 0, LIFT = 30;
const KW = [27, 28.5, 31, 35, 39, 43, 47, 51, 56, 61, 64.5, 66], KH = [1.7, 6.5, 9, 9.6, 8.2, 6, 6.4, 10, 11.6, 11, 8, 3];
const bout = (w) => { let i = 0; while (KW[i + 1] < w) i++; const t = (w - KW[i]) / (KW[i + 1] - KW[i]); return KH[i] + (KH[i + 1] - KH[i]) * (0.5 - 0.5 * Math.cos(Math.PI * t)); };
// half-width down the violin, w measured from the hook
const half = (w) => w < 7 ? 2.8 * Math.sin(Math.PI * clamp(w / 7, 0.05, 0.95)) + 0.6
  : w < 27 ? 1.7
  : w < 66 ? bout(w)
  : 0;
const WS = []; for (let w = 0; w <= 66; w += 1.5) WS.push(w);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value * LIFT;
  const C = Cam(45, 0.5, 1.75);
  const tiltMax = rad(LIFT * 1.4);
  fit(C, [[WL, -4, 0], [WR, -4, 0], [WR, 0, 0], [WL, -4, WH], [WR, -4, WH], [WR, 66 * Math.sin(tiltMax) + 3, HOOK - 66 * Math.cos(tiltMax)]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(WL, -4, WR, 0, 2.5, 1.2);
  put(solid(g), prism(P, front, wr, wi, 0, WH));

  const vs = [];
  for (let k = 0; k < N; k++) {
    const cx = (k - 1) * GAP;
    const el = mk("g", {}, g), back = mk("path", { d: "" }, el), face = solid(el);
    mk("circle", { class: "dot off", r: 1.3, cx: P(cx, 0, HOOK + 2)[0], cy: P(cx, 0, HOOK + 2)[1] }, g).before(el);
    vs.push({ k, cx, back, face, tw: tween(REST[k]), drawn: NaN, sx: P(cx, 0, HOOK - 40)[0] });
  }

  function draw(v, now) {
    const t = rad(tval(v.tw, now));
    if (t === v.drawn) return;
    v.drawn = t;
    const at = (u, w, d) => P(v.cx + u, 0.6 + w * Math.sin(t) + d * Math.cos(t), HOOK - w * Math.cos(t) + d * Math.sin(t));
    const outline = (d) => WS.map((w) => at(half(w), w, d)).concat(WS.slice().reverse().map((w) => at(-half(w), w, d)));
    v.back.setAttribute("d", poly(outline(0)));
    v.face.sil.setAttribute("d", poly(outline(3.2)));
    v.face.cr.setAttribute("d", open([at(-1, 8, 3.6), at(-1.3, 46, 3.6), at(1.3, 46, 3.6), at(1, 8, 3.6)]) + seg(at(-0.5, 46, 3.6), at(-1.6, 62, 3.6)) + seg(at(0.5, 46, 3.6), at(1.6, 62, 3.6)) + seg(at(-4.5, 52, 3.6), at(4.5, 52, 3.6)));
  }
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const v of vs) { draw(v, now); if (!tdone(v.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let hit = null;
  function retarget(now = performance.now()) {
    for (const v of vs) {
      tset(v.tw, hit ? (v === hit ? lift : 2) : REST[v.k], now, hit ? Math.abs(v.k - hit.k) * 45 : 0);
      v.face.sil.classList.toggle("hi", hit ? v === hit : v.k === FAV);
    }
    read.textContent = hit ? "violin " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      let best = null, bd = Infinity;
      for (const v of vs) { const d = Math.abs(p[0] - v.sx); if (d < bd) { bd = d; best = v; } }
      const nh = bd < GAP && p[1] > 30 && p[1] < 290 ? best : null;
      if (nh !== hit) { hit = nh; retarget(); }
    },
    leave: () => { hit = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { lift = v * LIFT; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "violins",
  means: "Three violins hung by their scrolls on a wall: the one under the pointer tilts out off the wall on its hook.",
  rules: [1, 2, 4, 5],
  range: [0.5, 1, 1.4],
  tour: [[148, 140], [200, 130], [252, 120], null],
  mount,
});
