/**
 * Lat pulldown: a seat and knee pad under a tall frame, a top beam with a
 * cable running over it, the long bar hanging above the seat and the weight
 * stack in its guide rods at the back. The pointer's height is how far the
 * bar is pulled: it comes down on a spring and the top of the stack rises on
 * the cable. The bar is bright. The slider sets how far a pull carries it.
 */
const { Cam, fit, facing, prism, proj, rings, spring, stepS, clamp, disposer, mk, pointer, put, register, solid, seg } = HL;

const REST = 0.18, BAR0 = 70, MAX = 34, N = 9, LIFT = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-46, -28, 0], [22, 28, 0], [-46, 28, 0], [22, -28, 0], [-46, 0, 94], [14, 0, 94], [12, -27, BAR0 + 4], [12, 27, BAR0 + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  box(solid(g), -46, -16, 22, 16, 0, 3, 3);
  const cable = mk("path", { class: "nf lo" }, g);
  mk("path", { class: "nf lo", d: seg(P(-36, -7, 3), P(-36, -7, 82)) + seg(P(-36, 7, 3), P(-36, 7, 82)) }, g);
  const plates = [];
  for (let i = 0; i < N; i++) plates.push(solid(g));
  box(solid(g), -28, -4, -22, 4, 3, 88, 1.5);
  box(solid(g), -42, -5, 16, 5, 86, 92, 2);
  const lines = mk("path", { class: "nf lo" }, g);
  box(solid(g), 6, -6, 18, 6, 3, 16, 2);
  box(solid(g), 4, -9, 20, 9, 16, 20, 3);
  box(solid(g), 1, -10, 5, 10, 27, 32, 2);
  mk("path", { class: "nf lo", d: seg(P(3, 0, 20), P(3, 0, 27)) }, g);
  const bar = solid(g);
  bar.sil.classList.add("hi");
  const sp = spring(REST);
  let gain = value / 1.4, drawn = NaN;
  function draw() {
    const t = sp.x * gain;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const bz = BAR0 - MAX * t, lift = MAX * t;
    for (let i = 0; i < N; i++) {
      const z = 3 + i * 3 + (i >= N - LIFT ? lift : 0);
      box(plates[i], -42, -10, -30, 10, z, z + 2.6, 1.5);
    }
    const top = 3 + N * 3 + lift;
    cable.setAttribute("d", seg(P(-36, 0, top), P(-36, 0, 86)));
    lines.setAttribute("d", seg(P(12, 0, 86), P(12, 0, bz + 4)) + seg(P(12, -24, bz + 1), P(12, -24, bz - 6)) + seg(P(12, 24, bz + 1), P(12, 24, bz - 6)));
    box(bar, 10, -27, 14, 27, bz, bz + 3.5, 1.7);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const a = P(12, 0, BAR0)[1], b = P(12, 0, BAR0 - MAX)[1];
      sp.t = clamp((p[1] - a) / (b - a), 0, 1);
      read.textContent = Math.round(sp.t * 100) + "%"; B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { gain = v / 1.4; drawn = NaN; draw(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "latpulldown",
  means: "A lat pulldown: the bar comes down as far as the pointer pulls it, and the weight stack rises on the cable.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[268, 111], [206, 206], [237, 168], null],
  mount,
});
