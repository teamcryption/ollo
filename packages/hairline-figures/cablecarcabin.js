/**
 * Funicular: a long embankment climbing a slope, two rails with sleepers on
 * its top, and one stepped car riding them. The car follows the pointer up
 * and down the track, on a spring, its floor steps keeping level. At rest it
 * waits a third of the way up, bright. The slider caps how high it may go.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 180, W = 22, H = 80, CW = 15, REST = 0.3;
const h = (x) => ((L - x) / L) * H;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let cap = value / 100;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, H + 26], [L, 0, 26], [L, W, 0], [0, W, H + 26], [0, W, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { d: poly(hull([P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0), P(0, 0, H), P(0, W, H), P(L, 0, 0.1), P(L, W, 0.1)])) }, g);
  mk("path", { class: "sil nf", d: open([P(L, W, 0), P(0, W, H), P(0, W, 0)]) }, g);
  let rl = "";
  for (let x = 6; x < L; x += 10) rl += seg(P(x, 4, h(x)), P(x, W - 4, h(x)));
  mk("path", { class: "lo nf", d: rl }, g);
  mk("path", { class: "nf", d: seg(P(0, 7, H), P(L, 7, 0)) + seg(P(0, W - 7, H), P(L, W - 7, 0)) }, g);
  const steps = [solid(mk("g", {}, g)), solid(mk("g", {}, g))];

  const sp = spring(REST * L);
  let last = NaN;
  function draw(c) {
    if (c === last) return;
    last = c;
    // two stepped halves: the uphill one stands higher, both stay level
    [[c - CW, c], [c, c + CW]].forEach(([x0, x1], i) => {
      const z0 = h(x0) + 3, [o, n] = rings(x0, 2, x1, W - 2, 3, 1.4);
      put(steps[1 - i], prism(P, front, o, n, z0, z0 + 22 + (i ? 0 : -1)));
    });
    steps[0].g.after(steps[1].g);
    steps[1].sil.classList.add("hi"); steps[0].sil.classList.add("hi");
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const marks = [];
  for (let x = 0; x <= L; x += 2) marks.push([x, P(x, W / 2, h(x))[0]]);
  function aim([sx]) {
    let best = marks[0], bd = Infinity;
    for (const m of marks) { const d = Math.abs(m[1] - sx); if (d < bd) { bd = d; best = m; } }
    sp.t = clamp(best[0], CW, Math.min(L - CW, cap * L));
    read.textContent = Math.round((sp.t / L) * 100) + "%";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST * L);
  bag.add(pointer(stage, { move: aim, leave: () => { sp.t = REST * L; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { cap = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "cablecarcabin",
  means: "A funicular on a sloped embankment: the stepped car rides its rails up and down to follow the pointer.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[121, 105], [200, 188], [268, 259], null],
  mount,
});
