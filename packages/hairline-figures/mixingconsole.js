/**
 * Fader bank: eight channel faders in a sloped desk. The pointer rides the
 * bank: the fader under it slides to the pointer, its neighbours follow less
 * the farther they are, each on its own spring. At rest the faders sit in an
 * uneven mix, one bright. The slider is the reach, in channels.
 *
 * The hit is on the desk's top plane, which never moves; channel by world x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, W = 13, Y0 = 8, Y1 = 64, L = 72, CW = 4.8, CL = 4, CH = 7;
const X1 = N * W, REST = [44, 30, 36, 22, 50, 40, 28, 46], FAV = 3;
const falloff = (u) => (u <= 0 ? 1 : u <= 1 ? 1 - u * 0.8 : 0.2 * Math.max(0, 1.6 - u));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-5, -16, -6], [X1 + 5, L + 4, -6], [X1 + 5, -16, -6], [-5, L + 4, -6], [-5, -16, 16], [X1 + 5, -16, 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the desk, a meter bridge behind it, and the slots
  const desk = block(-5, -4, X1 + 5, L + 4, 3, 1.4, -6, 0);
  block(-5, -16, X1 + 5, -6, 2.5, 1.2, 0, 16);
  let d = "";
  for (let i = 0; i < N; i++) {
    const cx = i * W + W / 2;
    d += seg(P(cx, Y0 - 2, 0), P(cx, Y1 + 2, 0));
    for (let t = 0; t <= 4; t++) d += seg(P(cx + 4, Y0 + t * 14, 0), P(cx + 5.6, Y0 + t * 14, 0));
  }
  mk("path", { class: "nf lo", d }, desk.g);

  const caps = [];
  for (let i = 0; i < N; i++) caps.push({ i, cx: i * W + W / 2, rest: REST[i], sp: spring(REST[i], { eps: 0.05 }), el: solid(g), drawn: NaN });

  function draw(c) {
    const y = clamp(c.sp.x, Y0, Y1);
    if (y === c.drawn) return;
    c.drawn = y;
    block(c.cx - CW, y - CL, c.cx + CW, y + CL, 1.2, 0.8, 0, CH, c.el);
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const c of caps) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const a = over ? clamp(Math.floor(over[0] / W), 0, N - 1) : -1;
    for (const c of caps) {
      if (a < 0) c.sp.t = c.rest;
      else c.sp.t = clamp(c.rest + (over[1] - c.rest) * falloff(Math.abs(c.i - a) / RAD), Y0, Y1);
      c.el.sil.classList.toggle("hi", a < 0 ? c.i === FAV : c.i === a);
    }
    read.textContent = a < 0 ? "rest" : "ch " + (a + 1) + " · " + Math.round(100 * (Y1 - clamp(over[1], Y0, Y1)) / (Y1 - Y0));
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x > -4 && x < X1 + 4 && y > -4 && y < L + 4 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "mixingconsole",
  means: "A bank of eight faders in a desk: the one under the pointer slides to it, its neighbours follow by distance.",
  rules: [1, 3, 5, 9],
  range: [0.5, 1.5, 4],
  tour: [[103, 165], [214, 158], [284, 191], null],
  mount,
});
