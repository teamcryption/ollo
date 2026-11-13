/**
 * Newton's cradle: a frame of two top bars on four posts, five steel balls
 * hung in a row, each on a V of two strings. The pointer chooses the end
 * nearer it: that ball lifts out along the row on its strings, on a spring,
 * higher the closer the pointer comes to it, and is bright. At rest the first
 * ball is held a little out, lit. The slider is the full lift, in degrees.
 *
 * The pattern: one value on a spring; the hit is the balls' resting screen x.
 */
const { Cam, clamp, facing, fit, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, BR = 6, D = 18, H = 74, LV = 50, XO = 34, REST = 16;
const X4 = (N - 1) * 2 * BR, ZB = H - LV;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let MAXA = value;
  const C = Cam(45, 0.5, 1.95);
  const far = (s, a) => [s * LV * Math.sin(rad(a)) + (s < 0 ? -BR : X4 + BR), 0, H - LV * Math.cos(rad(a)) + BR];
  fit(C, [[-XO - 4, -D - 6, -4], [X4 + XO + 4, D + 6, -4], [X4 + XO + 4, -D - 6, -4], [-XO - 4, D + 6, -4], [-XO, -D, H + 3], [X4 + XO, D, H + 3], far(-1, 55), far(1, 55)], 200, 166);
  const P = proj(C), front = facing(C);
  const sc = Math.hypot(...[0, 1].map((i) => P(BR / Math.SQRT2, -BR / Math.SQRT2, 0)[i] - P(0, 0, 0)[i]));
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const side = (y) => { block(-XO - 1.5, y - 1.5, -XO + 1.5, y + 1.5, 1, 0.4, 0, H + 3); block(-XO - 1.5, y - 1.4, X4 + XO + 1.5, y + 1.4, 1, 0.4, H, H + 3); };
  const post = (y) => block(X4 + XO - 1.5, y - 1.5, X4 + XO + 1.5, y + 1.5, 1, 0.4, 0, H + 3);
  block(-XO - 6, -D - 6, X4 + XO + 6, D + 6, 3, 1.2, -4, 0);
  side(-D); post(-D);
  const balls = Array.from({ length: N }, (_, k) => {
    const x = k * 2 * BR, s = k === 0 ? -1 : k === N - 1 ? 1 : 0;
    const b = { k, x, s, farS: mk("path", { class: "nf" }, g), ball: mk("ellipse", { class: "sil", rx: sc, ry: sc }, g), nearS: mk("path", { class: "nf" }, g), sp: spring(k === 0 ? REST : 0, { eps: 0.02 }), drawn: NaN };
    return b;
  });
  side(D); post(D);

  function draw(b) {
    const a = clamp(b.sp.x, 0, 60);
    if (a === b.drawn) return;
    b.drawn = a;
    const sa = Math.sin(rad(a)) * b.s, ca = Math.cos(rad(a));
    const c = [b.x + LV * sa, 0, H - LV * ca], pc = P(...c);
    b.ball.setAttribute("cx", pc[0].toFixed(2)); b.ball.setAttribute("cy", pc[1].toFixed(2));
    b.farS.setAttribute("d", seg(P(b.x, -D, H), pc));
    const L = Math.hypot(LV, D), att = [c[0] - (sa * LV / L) * BR, (D / L) * BR, c[2] + (ca * LV / L) * BR];
    b.nearS.setAttribute("d", seg(P(b.x, D, H), P(...att)));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of balls) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  const e0 = P(0, 0, ZB), e4 = P(X4, 0, ZB), half = (e4[0] - e0[0]) / 2 + 40;
  let act = -2;
  function update(p) {
    let a = -1, near = 0;
    if (p && Math.abs(p[1] - (e0[1] + e4[1]) / 2) < 70 && p[0] > e0[0] - 40 && p[0] < e4[0] + 40) {
      a = p[0] < (e0[0] + e4[0]) / 2 ? 0 : N - 1;
      near = 1 - clamp(Math.abs(p[0] - (a ? e4 : e0)[0]) / half, 0, 1);
    }
    for (const b of balls) {
      b.sp.t = a < 0 ? (b.k === 0 ? REST : 0) : b.k === a ? MAXA * (0.4 + 0.6 * near) : 0;
      if (a !== act) b.ball.classList.toggle("hi", b.k === (a < 0 ? 0 : a));
    }
    if (a !== act) { act = a; read.textContent = a < 0 ? "rest" : "ball " + (a + 1); }
    B.wake();
  }
  let last = null;
  bag.add(pointer(stage, { move: (p) => { last = p; update(p); }, leave: () => { last = null; update(null); } }));
  bag.add(() => svg.replaceChildren());
  update(null);
  return { set: (v) => { MAXA = v; update(last); }, destroy: bag.dispose };
}

hairline({
  name: "newtonscradle",
  means: "A Newton's cradle of five steel balls on V-strings: the end ball nearer the pointer lifts out, higher as it nears.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 55],
  tour: [[167, 167], [233, 200], [215, 185], null],
  mount,
});
