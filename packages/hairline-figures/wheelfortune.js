/**
 * Fortune wheel: a big upright wheel on a post, twelve spokes and a peg at
 * each rim gap, a fixed flapper at the top. The wheel spins with the pointer
 * across the frame; one spoke, the winner, is bright at rest. The slider is
 * how far a sweep spins it.
 *
 * The pattern: one part turning to follow the pointer (spotlights).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 56, ZC = 74, TH = 8, N = 12, REST = 0.35;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-R, -30, 0], [R, 16, 0], [-R, 0, ZC + R + 8], [R, -TH, ZC + R + 8], [R, 16, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-34, -34, 34, 14, 6, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const [pr, pi] = rings(-5, -22, 5, -12, 2, 0.8);
  put(solid(g), prism(P, front, pr, pi, 5, ZC));
  const W = (r, t, y) => P(r * Math.cos(t), y, ZC + r * Math.sin(t));
  const back = [], fr = [], inner = [];
  for (let i = 0; i < 64; i++) { const t = (i / 64) * 2 * Math.PI; back.push(W(R, t, -TH)); fr.push(W(R, t, 0)); inner.push(W(R - 7, t, 0)); }
  mk("path", { d: poly(hull(back.concat(fr))), class: "sil" }, g);
  mk("path", { d: poly(fr), class: "nf" }, g);
  mk("path", { d: poly(inner), class: "nf lo" }, g);
  const spokes = mk("path", { class: "nf lo" }, g), win = mk("path", { class: "nf hi" }, g);
  const pegs = [];
  for (let k = 0; k < N; k++) pegs.push(mk("circle", { r: 1.6, class: "dot off" }, g));
  const hub = [];
  for (let i = 0; i < 24; i++) hub.push(W(7, (i / 24) * 2 * Math.PI, 2));
  mk("path", { d: poly(hub), class: "" }, g);
  // the flapper: a small wedge pointing down at the rim
  mk("path", { d: poly([W(0, 0, 2).map((v, j) => v), P(-4, 2, ZC + R + 9), P(4, 2, ZC + R + 9)].slice(0, 0).concat([P(0, 2, ZC + R - 6), P(-5, 2, ZC + R + 8), P(5, 2, ZC + R + 8)])), class: "" }, g);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    let s = "";
    for (let k = 1; k < N; k++) { const t = a + (k * 2 * Math.PI) / N; s += seg(W(7, t, 0), W(R - 7, t, 0)); }
    spokes.setAttribute("d", s);
    win.setAttribute("d", seg(W(7, a, 0), W(R - 7, a, 0)) + seg(W(7, a + 0.04, 0), W(R - 7, a + 0.04, 0)));
    pegs.forEach((el, k) => { const p = W(R - 3.5, a + ((k + 0.5) * 2 * Math.PI) / N, 0); el.setAttribute("cx", p[0]); el.setAttribute("cy", p[1]); });
  }
  const sp = spring(REST, { k: 60, c: 13 });
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t, r) {
    sp.t = t;
    const k = ((Math.round(((Math.PI / 2 - t) * N) / (2 * Math.PI)) % N) + N) % N;
    read.textContent = r ? "rest" : "no " + (k + 1);
    B.wake();
  }
  aim(REST, 1);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 200) / 140, -1, 1) * Math.PI * gain), leave: () => aim(REST, 1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "wheelfortune",
  means: "A fortune wheel on a post: it spins as the pointer sweeps across, the bright winning spoke turning past the flapper.",
  rules: [3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[90, 150], [320, 160], [240, 110], null],
  mount,
});
