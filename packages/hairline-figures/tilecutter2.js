/**
 * Brick tongs: a bricklayer's clamp gripping a row of bricks stood on edge,
 * a jaw at each end of its bar and a handle on top. The pointer lifts it:
 * the higher the pointer stands over the row, the higher the tongs carry
 * the bricks off the board. At rest the handle is bright. The slider is reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PB = 4, BH = 24, LIFT = 40, REST = 0.05, N = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-48, -24, 0], [48, 24, 0], [-36, 0, PB + BH + LIFT + 32], [36, 0, PB + BH + LIFT + 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-48, -24, 48, 24, 3, 2);
  put(solid(g), prism(P, front, br, bi, 0, PB));
  const jawB = solid(g), bricks = [];
  for (let i = 0; i < N; i++) bricks.push(solid(g));
  const jawF = solid(g);
  const bar = mk("path", { class: "sil" }, g);
  const legs = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2]))));
  const W = 9.6, X0 = -(N * W) / 2;

  const lift = spring(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const z = PB + l * LIFT, t = z + BH;
    bricks.forEach((b, i) => {
      const [r, n] = rings(X0 + i * W + 0.4, -10, X0 + (i + 1) * W - 0.4, 10, 1.4, 1);
      put(b, prism(P, front, r, n, z, t));
    });
    for (const [s, jaw] of [[-1, jawB], [1, jawF]]) {
      const x = s * (-X0 + 2.2);
      const [r, n] = rings(x - 1.8, -8, x + 1.8, 8, 1.2, 0.6);
      put(jaw, prism(P, front, r, n, t - 15, t + 6));
    }
    bar.setAttribute("d", rod([X0 - 3, 0, t + 6], [-X0 + 3, 0, t + 6], 2.6));
    legs.setAttribute("d", rod([-12, 0, t + 7], [-6, 0, t + 26], 1.8) + " " + rod([12, 0, t + 7], [6, 0, t + 26], 1.8));
    grip.setAttribute("d", rod([-9, 0, t + 27], [9, 0, t + 27], 3.4));
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0], cy = P(0, 0, PB)[1];
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - cx) < 140 && p[1] > cy - 200 && p[1] < cy + 80;
    const l = inside ? clamp((cy + 40 - p[1]) / 190, 0.2, 1) * reach : REST;
    lift.t = Math.max(l, REST);
    const act = !!inside;
    if (act !== on) {
      on = act;
      grip.classList.toggle("hi", !act);
      for (const el of [jawB.sil, jawF.sil, bar, legs]) el.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round(l * LIFT) + "cm" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "tilecutter2",
  means: "Brick tongs clamping a row of bricks on a board: the higher the pointer, the higher the tongs lift the row.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[200, 151], [200, 80], [220, 250], null],
  mount,
});
