/**
 * Chip tray: a low rimmed tray holding five stacks of chips, each a different
 * height, every chip a seam round the stack's front. The pointer chooses a
 * stack and it slides out of the tray toward the player, the stacks beside it
 * edging out less, the motion spreading out from the one chosen. At rest the
 * stacks sit a little out of line, the second bright. The slider is how far
 * the chosen stack slides.
 *
 * The pattern: a single row picked by its rest centre's screen x; the slide is
 * a discrete choice on 700ms tweens, staggered by distance.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, run, ringAt, open, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, DX = 21, R = 8.6, T = 2.3, Z0 = 4, OUT = 24, FAV = 1;
const H = [6, 9, 4, 8, 6], JIT = [1.5, -1, 2.5, 0, -2];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  const W = (N * DX) / 2 + 3;
  fit(C, [[-W, -16, 0], [W, 16 + OUT, 0], [-W, -16, Z0 + 9 * T + 2], [W, 16, Z0 + 9 * T]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-W, -15, W, 15, 7, 1.6), 0, Z0 + 3));
  for (let i = 0; i < N; i++) mk("path", { class: "nf lo", d: open(ringAt(P, run(disc(-W + 3 + (i + 0.5) * DX, 0, R + 1.2), front), Z0)) }, g);
  const stacks = [];
  for (let i = 0; i < N; i++) {
    const x = -W + 3 + (i + 0.5) * DX;
    const s = { i, x, h: H[i] * T, tw: tween(JIT[i]), drawn: NaN, g: mk("g", {}, g), cx: P(x, 0, Z0)[0] };
    s.body = solid(s.g);
    s.seams = mk("path", { class: "nf lo", d: "" }, s.g);
    stacks.push(s);
  }
  function draw(s, now) {
    const y = tval(s.tw, now);
    if (Math.abs(y - s.drawn) < 1e-3) return;
    s.drawn = y;
    const d = disc(s.x, y, R), fr = run(d, front);
    put(s.body, prism(P, front, d, disc(s.x, y, R - 1.3), Z0, Z0 + s.h));
    let p = "";
    for (let k = 1; k < H[s.i]; k++) p += open(ringAt(P, fr, Z0 + k * T));
    s.seams.setAttribute("d", p);
  }
  const B = register(stage, (dt, now) => { let m = false; for (const s of stacks) { draw(s, now); if (!tdone(s.tw, now)) m = true; } return m; });
  bag.add(B.unregister);

  let cur = -2;
  function choose(a) {
    if (a === cur) return;
    cur = a;
    const now = performance.now();
    for (const s of stacks) {
      const d = Math.abs(s.i - a), f = a < 0 ? 0 : d === 0 ? 1 : d === 1 ? 0.38 : 0.12;
      tset(s.tw, a < 0 ? JIT[s.i] : f * OUT * value + JIT[s.i] * (1 - f), now, a < 0 ? 0 : d * 40);
      s.body.sil.classList.toggle("hi", a < 0 ? s.i === FAV : s.i === a);
    }
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const top = P(0, -24, Z0 + 10 * T)[1], bot = P(0, 24 + OUT, 0)[1];
      const xs = stacks.map((s) => s.cx), slope = (p[1] - P(0, 0, Z0)[1]);
      if (p[1] < top + slope * 0 - 30 || p[1] > bot + 40 || p[0] < xs[0] - 40 || p[0] > xs[N - 1] + 40) return choose(-1);
      let a = 0, bd = Infinity;
      stacks.forEach((s, i) => { const d = Math.abs(p[0] - s.cx); if (d < bd) { bd = d; a = i; } });
      choose(a);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  choose(-1);
  return { set: (v) => { value = v; const a = cur; cur = -2; choose(a); }, destroy: bag.dispose };
}

hairline({
  name: "pokerchips",
  means: "A chip tray of five stacks: the stack the pointer chooses slides out toward the player, its neighbours edging out less.",
  rules: [1, 2, 5, 8],
  range: [0.4, 1, 1],
  tour: [[94, 125], [158, 156], [295, 225], null],
  mount,
});
