/**
 * Mash tun: a round brewing vessel on a low plinth, its lid hinged at the
 * back. The pointer over the tun swings the lid open; away, it settles back
 * ajar. At rest the lid sits a little open, its rim bright. The slider is how
 * far the lid opens.
 *
 * The pattern: one discrete choice on a tween; the hit is on the ground plane.
 */
const { Cam, fit, proj, facing, circ, rings, prism, put, solid, mk, poly, hull, tween, tset, tval, tdone, register, pointer, disposer, unproj, rad } = HL;

const R = 40, H = 62, LR = 42, REST = 20;
const S2 = Math.SQRT1_2, HG = [-S2 * LR, -S2 * LR, H + 2], HX = [S2, -S2, 0], W = [S2, S2, 0];

function lidRings(P, a) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  const w = [W[0] * c, W[1] * c, s], n = [-W[0] * s, -W[1] * s, c];
  const ctr = HG.map((v, j) => v + LR * w[j]);
  const ring = (o) => circ(LR, 40).map((q) => P(...[0, 1, 2].map((j) => ctr[j] + o * n[j] + q.u * HX[j] + q.v * w[j])));
  return [ring(0), ring(4), ctr];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.55);
  let amax = 40 + 45 * value;
  fit(C, [[-56, -56, -6], [56, 56, -6], [56, -56, -6], [-56, 56, -6], [0, 0, H + 6], HG.map((v, j) => v + LR * [0, 0, 1][j] + (j < 2 ? 0 : 0)), [HG[0], HG[1], H + 2 + 2 * LR]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-56, -56, 56, 56, 14, 2);
  put(solid(g), prism(P, front, pr, pi, -6, 0));
  put(solid(g), prism(P, front, circ(R, 48), circ(R - 3, 48), 0, H));
  const [br, bi] = rings(R - 2, -5, R + 10, 5, 2, 1);
  put(solid(g), prism(P, front, br, bi, 10, 16));
  const lid = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "lo nf" }, g);
  const tw = tween(REST);
  let last = "", open = false;
  function draw(now) {
    const a = tval(tw, now), key = a.toFixed(2);
    if (key === last) return;
    last = key;
    const [r0, r1] = lidRings(P, a);
    lid.setAttribute("d", poly(hull(r0.concat(r1))));
    top.setAttribute("d", poly(r1));
  }
  const L = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(L.unregister);
  function choose(on) {
    if (on === open) return;
    open = on;
    tset(tw, on ? amax : REST, performance.now(), 0);
    read.textContent = on ? `lid ${Math.round(amax)}°` : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); choose(Math.hypot(x, y) < 72); },
    leave: () => choose(false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw(performance.now());
  return { set: (v) => { amax = 40 + 45 * v; if (open) { tset(tw, amax, performance.now(), 0); read.textContent = `lid ${Math.round(amax)}°`; L.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "brewkettle",
  means: "A mash tun with a hinged lid: the pointer over the vessel swings the lid open, and it settles back ajar when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 249], [240, 230], [160, 230], null],
  mount,
});
