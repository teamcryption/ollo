/**
 * Sofa cushions: a three-seat sofa with its arms, back panel, three seat
 * cushions and three back cushions. The pointer sits down near them: the
 * cushions near it puff up, each on its own spring, the one under it puffiest
 * and bright. At rest the cushions are left unevenly plumped, the middle one
 * bright. The slider is the reach, in cushion widths.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is on the
 * plane of the seat cushions' resting tops, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 30, X1 = N * W, AR = 9, D = 40, BASE = 12, SEAT = 18, BACK = 33, PANEL = 36, ARM = 26;
const PMAX = 6, REST = [2.2, 4, 1.2], FAV = 1;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * W, over = null;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-AR, 0, 0], [X1 + AR, D, 0], [-AR, D, 0], [X1 + AR, 0, PANEL], [-AR, 0, PANEL], [X1 + AR, D, ARM]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  block(-AR, 0, 0, D, 3.5, 1.2, 0, ARM);
  block(0, 0, X1, D, 2, 1, 0, BASE);
  block(0, 0, X1, 9, 3, 1.2, BASE, PANEL);
  const cush = [];
  for (let k = 0; k < N; k++) {
    const [o, i] = rings(k * W + 0.8, 9.5, (k + 1) * W - 0.8, 16, 3, 1);
    cush.push({ k, cx: (k + 0.5) * W, back: { el: solid(g), o, i }, sp: spring(REST[k], { eps: 0.02 }), drawn: NaN });
  }
  for (const c of cush) {
    const [o, i] = rings(c.k * W + 0.8, 16.5, (c.k + 1) * W - 0.8, D - 0.5, 4, 1.4);
    c.seat = { el: solid(g), o, i };
  }
  block(X1, 0, X1 + AR, D, 3.5, 1.2, 0, ARM);

  function draw(c) {
    const p = clamp(c.sp.x, 0, PMAX);
    if (p === c.drawn) return;
    c.drawn = p;
    put(c.back.el, prism(P, front, c.back.o, c.back.i, BASE, BACK + p * 0.8));
    put(c.seat.el, prism(P, front, c.seat.o, c.seat.i, BASE, SEAT + p));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cush) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const hit = over ? cush[clamp(Math.floor(over[0] / W), 0, N - 1)] : null;
    for (const c of cush) {
      c.sp.t = !over ? REST[c.k] : c === hit ? PMAX : PMAX * 0.8 * falloff(Math.abs(c.cx - over[0]) / RAD);
      const on = over ? c === hit : c.k === FAV;
      c.seat.el.sil.classList.toggle("hi", on);
      c.back.el.sil.classList.toggle("hi", on);
    }
    read.textContent = hit ? "cushion " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], SEAT);
      over = x > -AR && x < X1 + AR && y > -30 && y < D + 8 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * W; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "sofacushions",
  means: "A three-seat sofa: the cushions near the pointer puff up, the one under it puffiest and bright.",
  rules: [1, 3, 5, 9],
  range: [0.5, 1, 1.6],
  tour: [[112, 139], [187, 177], [261, 214], null],
  mount,
});
