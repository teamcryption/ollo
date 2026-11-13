/**
 * Mixing desk: an eight-channel audio console, a meter bridge at the back, two
 * gain knobs per channel and a long fader slot in each strip. The pointer is
 * the engineer's hand: the faders near it slide up their slots in a falloff,
 * the one under it furthest and bright. At rest the faders sit at a rough
 * mix, one bright. The slider is the reach, in channels.
 *
 * The pattern: a continuous field (terrain) along one row of strips; the hit is
 * on the plane of the desk's top, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, CW = 12, X1 = N * CW, Y1 = 66, TOP = 7, BR = -12, BH = 20;
const DOWN = 58, UP = 24, MIX = [0.3, 0.45, 0.2, 0.55, 0.35, 0.15, 0.5, 0.3], FAV = 3;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-3, BR, 0], [X1 + 3, BR, 0], [-3, Y1 + 3, 0], [X1 + 3, Y1 + 3, 0], [-3, BR, BH], [X1 + 3, BR, BH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the meter bridge, its row of meter windows, then the desk itself
  const bridge = block(-3, BR, X1 + 3, -1, 2.5, 1.2, 0, BH);
  let lines = "";
  for (let k = 0; k < N; k++) { const cx = (k + 0.5) * CW; lines += seg(P(cx, -1, BH - 4), P(cx, -1, 8)); }
  mk("path", { class: "nf lo", d: lines }, bridge.g);
  const desk = block(-3, -1, X1 + 3, Y1 + 3, 3, 1.4, 0, TOP);

  // slots and strip dividers, painted on the desk's top
  let slots = "";
  for (let k = 0; k < N; k++) {
    const cx = (k + 0.5) * CW;
    slots += seg(P(cx, UP - 3, TOP), P(cx, DOWN + 3, TOP));
    if (k) slots += seg(P(k * CW, 3, TOP), P(k * CW, Y1 - 1, TOP));
  }
  mk("path", { class: "nf lo", d: slots }, desk.g);

  const ch = [];
  for (let k = 0; k < N; k++) {
    const cx = (k + 0.5) * CW;
    for (const ky of [6, 14]) put(solid(g), prism(P, front, disc(cx, ky, 2.6), disc(cx, ky, 1.8), TOP, TOP + 2.6));
    const [ring, inner] = rings(-4.5, -3, 4.5, 3, 1.3, 0.8);
    ch.push({ k, cx, ring, inner, el: solid(g), sp: spring(MIX[k], { eps: 0.003 }), drawn: NaN });
  }

  function draw(c) {
    const v = clamp(c.sp.x, 0, 1);
    if (v === c.drawn) return;
    c.drawn = v;
    const y = DOWN - v * (DOWN - UP), sh = (r) => r.map((q) => ({ ...q, u: q.u + c.cx, v: q.v + y }));
    put(c.el, prism(P, front, sh(c.ring), sh(c.inner), TOP, TOP + 6));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const c of ch) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const hit = over ? ch[clamp(Math.floor(over[0] / CW), 0, N - 1)] : null;
    for (const c of ch) {
      c.sp.t = over ? Math.max(c === hit ? 1 : 0, MIX[c.k] * 0.2 + falloff(Math.abs(c.cx - over[0]) / (RAD * CW)) * 0.95) : MIX[c.k];
      c.sp.t = clamp(c.sp.t, 0, 1);
      c.el.sil.classList.toggle("hi", over ? c === hit : c.k === FAV);
    }
    read.textContent = hit ? "ch " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP);
      over = x > -3 && x < X1 + 3 && y > -6 && y < Y1 + 8 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "mixingdesk",
  means: "An eight-channel mixing desk: the faders near the pointer slide up their slots, the one under it furthest and bright.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[140, 176], [184, 181], [260, 170], null],
  mount,
});
