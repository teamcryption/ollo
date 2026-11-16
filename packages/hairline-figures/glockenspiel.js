/**
 * Glockenspiel: eleven metal bars, long to short, resting on two felt rails
 * in a low case. The pointer strikes: the bars near it dip and slide toward the reader,
 * each on its own spring, the one under it deepest and bright. At rest one
 * bar rings, bright and tipped. The slider is the reach, in bars.
 *
 * The pattern: a continuous field along one row; the hit is on the plane of
 * the bars' resting tops, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 11, BW = 8, GAP = 2.2, BH = 3, TOP = 8, FAV = 4, DMAX = 7;
const LEN = Array.from({ length: N }, (_, k) => 64 - k * 3.4);
const X1 = N * (BW + GAP), MID = 34;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * (BW + GAP), over = null;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, 0, -4], [X1 + 6, 68, -4], [X1 + 6, 0, -4], [-6, 72, -4], [X1 + 6, 72, -4], [-6, 0, TOP + BH + 2], [X1 + 6, 0, TOP + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the case floor and the far felt rail, which runs on the long bars' ends to the short ones'
  block(-6, 0, X1 + 6, 68, 3, 1.2, -4, 0);
  const railY = (k, s) => MID + s * (LEN[k] / 2 - 5);
  block(-3, railY(0, -1) - 2, X1 + 3, railY(0, -1) + 2, 1.5, 0.6, 0, TOP);
  const bars = LEN.map((len, k) => {
    const x0 = k * (BW + GAP) + GAP / 2;
    const rest = k === FAV ? DMAX * 0.6 : k === FAV - 1 || k === FAV + 1 ? DMAX * 0.2 : 0;
    return { k, x0, len, cx: x0 + BW / 2, el: solid(g), rest, sp: spring(rest, { eps: 0.02 }), drawn: NaN };
  });
  // the near rail goes in front of the bars
  block(-3, railY(0, 1) - 2, X1 + 3, railY(0, 1) + 2, 1.5, 0.6, 0, TOP - DMAX - 0.5);

  function draw(b) {
    const d = clamp(b.sp.x, 0, DMAX);
    if (d === b.drawn) return;
    b.drawn = d;
    const sy = d * 1.3, [ring, inner] = rings(b.x0, MID - b.len / 2 + sy, b.x0 + BW, MID + b.len / 2 + sy, 1.6, 0.8);
    put(b.el, prism(P, front, ring, inner, TOP - d, TOP + BH - d));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bars) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const hit = over ? bars[clamp(Math.floor(over[0] / (BW + GAP)), 0, N - 1)] : null;
    for (const b of bars) {
      b.sp.t = !over ? b.rest : b === hit ? DMAX : DMAX * 0.9 * falloff(Math.abs(b.cx - over[0]) / RAD);
      b.el.sil.classList.toggle("hi", over ? b === hit : b.k === FAV);
    }
    read.textContent = hit ? "bar " + String(hit.k + 1).padStart(2, "0") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP + BH);
      over = x > -3 && x < X1 + 3 && y > 0 && y < 68 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * (BW + GAP); if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "glockenspiel",
  means: "Eleven glockenspiel bars on felt rails: the bars near the pointer dip and slide as struck, the one under it deepest.",
  rules: [1, 3, 5, 9],
  range: [2, 4, 6],
  tour: [[231, 167], [165, 138], [268, 186], null],
  mount,
});
