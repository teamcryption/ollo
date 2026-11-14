/**
 * Stacking chairs: five classroom chairs nested in a stack, each a seat on
 * four splayed legs with a backrest panel, each sitting a little forward of
 * the one under it. The pointer picks a chair by its height in the stack:
 * every chair above it lifts off together, staggered from it, and the chosen
 * chair's seat lies open. At rest the stack is a little uneven and the top
 * chair is bright. The slider is how high the chairs lift.
 *
 * The pattern: stepped parts; the hit is the nearest rest seat by screen y,
 * read from the rest pose so a lifted chair never moves its own hit.
 */
const {
  Cam, clamp, fit, proj, rings, prism, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, W = 24, D = 22, Z0 = 17, DZ = 5, DY = 2, BACK = 16, SPL = 1.6;
const OFF = [0, 1.2, -0.6, 0.9, -0.2], REST = [0, 0, 0, 0, 1.5], FAV = N - 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 3.45);
  const zTop = Z0 + (N - 1) * DZ;
  fit(C, [[-3, -3, 0], [W + 4, -3, 0], [W + 4, D + N * DY + 3, 0], [-3, D + N * DY + 3, 0],
    [0, (N - 1) * DY, zTop + BACK + 26], [W, (N - 1) * DY, zTop + BACK + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const chairs = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const backLegs = mk("path", { class: "nf" }, grp);
    const rest = solid(grp), seat = solid(grp);
    const frontLegs = mk("path", { class: "nf" }, grp);
    chairs.push({ k, x0: OFF[k], y0: k * DY, z0: Z0 + k * DZ, backLegs, rest, seat, frontLegs, z: tween(REST[k]), last: NaN });
  }

  function draw(c, up) {
    if (up === c.last) return;
    c.last = up;
    const { x0, y0 } = c, z = c.z0 + up, x1 = x0 + W, y1 = y0 + D;
    const leg = (x, y, sx, sy) => seg(P(x, y, z - 1.6), P(x + sx * SPL, y + sy * SPL, z - Z0));
    c.backLegs.setAttribute("d", leg(x0 + 1, y0 + 1, -1, -1) + leg(x1 - 1, y0 + 1, 1, -1) + leg(x0 + 1, y1 - 1, -1, 1));
    c.frontLegs.setAttribute("d", leg(x1 - 1, y1 - 1, 1, 1));
    // the backrest: a thin panel on two posts at the back edge
    const [br, bi] = rings(x0 + 1.5, y0 - 0.4, x1 - 1.5, y0 + 1.2, 0.7, 0.3);
    const bp = prism(P, front, br, bi, z + 6, z + BACK);
    bp.crease += seg(P(x0 + 3, y0 + 0.4, z), P(x0 + 3, y0 + 0.4, z + 6)) + seg(P(x1 - 3, y0 + 0.4, z), P(x1 - 3, y0 + 0.4, z + 6));
    put(c.rest, bp);
    const [sr, si] = rings(x0, y0, x1, y1, 3, 1);
    put(c.seat, prism(P, front, sr, si, z - 1.6, z));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    chairs.forEach((c) => { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest seat by screen y, inside the stack's span on screen
  const cyk = chairs.map((c) => P(c.x0 + W / 2, c.y0 + D / 2, c.z0)[1]);
  const xs = [P(-2, D + N * DY, 0)[0], P(W + 2, 0, 0)[0]];
  const yTop = P(W / 2, (N - 1) * DY, zTop + BACK)[1], yBot = P(W, D, 0)[1];
  function hit([sx, sy]) {
    if (sx < xs[0] || sx > xs[1] || sy < yTop || sy > yBot) return -1;
    let best = 0;
    cyk.forEach((y, k) => { if (Math.abs(sy - y) < Math.abs(sy - cyk[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const L = clamp(lift, 8, 26);
    chairs.forEach((c, k) => {
      const up = a < 0 ? REST[k] : k > a ? L : k === a && a === N - 1 ? L * 0.6 : 0;
      tset(c.z, up, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      c.seat.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "chair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "stackchairs",
  means: "A stack of classroom chairs: the chairs above the one under the pointer lift off together, opening its seat.",
  rules: [1, 2, 3, 5],
  range: [8, 18, 26],
  tour: [[209, 214], [207, 192], [205, 165], null],
  mount,
});
