/**
 * Tree stand: a hunter's platform strapped to a trunk, folded up against the
 * bark. The pointer near the tree swings the platform down level, its brace
 * following; away, it folds back up. At rest it hangs half folded, bright.
 * The slider is how far it drops.
 *
 * The pattern: one discrete choice on a tween; the hit is on the ground plane.
 */
const { Cam, fit, proj, facing, circ, rings, prism, put, solid, mk, poly, hull, rrect, tween, tset, tval, tdone, register, pointer, disposer, unproj, rad } = HL;

const TR = 12, TH = 150, HZ = 70, PL = 44, PW = 34, REST = 55;
const W = [1, 0, 0], HX = [0, 1, 0];

function plate(P, a) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  const w = [W[0] * c, W[1] * c, s], n = [-W[0] * s, -W[1] * s, c];
  const o = [W[0] * TR, W[1] * TR, HZ];
  const ring = rrect(-PW / 2, 0, PW / 2, PL, 3, 4);
  const at = (k) => ring.map((q) => P(...[0, 1, 2].map((j) => o[j] + q.u * HX[j] + q.v * w[j] + k * n[j])));
  const tipz = o.map((v, j) => v + PL * w[j]);
  return [poly(hull(at(0).concat(at(-3)))), poly(at(0)), tipz, o];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.5);
  let amin = 30 - 30 * value;
  fit(C, [[-50, -50, -5], [50, 50, -5], [50, -50, -5], [-50, 50, -5], [0, 0, TH], [W[0] * (TR + PL), W[1] * (TR + PL), HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-50, -50, 50, 50, 12, 2);
  put(solid(g), prism(P, front, gr, gi, -5, 0));
  put(solid(g), prism(P, front, circ(TR, 32), circ(TR - 2, 32), 0, TH));
  const [sr, si] = rings(-TR - 1, -TR - 1, TR + 1, TR + 1, TR, 1);
  put(solid(g), prism(P, front, sr, si, HZ + 18, HZ + 22));
  const brace = mk("path", { class: "nf sil" }, g), pl = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = "", on = false;
  function draw(now) {
    const a = tval(tw, now), key = a.toFixed(2);
    if (key === last) return;
    last = key;
    const [sil, t, tip] = plate(P, a);
    pl.setAttribute("d", sil); top.setAttribute("d", t);
    const anc = P(W[0] * TR, W[1] * TR, HZ + 20);
    brace.setAttribute("d", `M${anc[0]},${anc[1]}L${P(...tip)[0]},${P(...tip)[1]}`);
  }
  const L = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(L.unregister);
  function choose(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? amin : REST, performance.now(), 0);
    read.textContent = v ? `drop ${Math.round(amin)}°` : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); choose(Math.abs(x) < 60 && Math.abs(y) < 60); },
    leave: () => choose(false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw(performance.now());
  return { set: (v) => { amin = 30 - 30 * v; if (on) { tset(tw, amin, performance.now(), 0); read.textContent = `drop ${Math.round(amin)}°`; L.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "treeclimb",
  means: "A tree stand strapped to a trunk: the pointer near the tree swings the platform down level, and away it folds back up.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 255], [105, 234], null],
  mount,
});
