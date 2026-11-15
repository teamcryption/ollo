/**
 * Upright piano: a tall case on two front posts, a keybed and a fallboard
 * over the keys, a top lid on a back hinge. The pointer opens it: the
 * fallboard swings up off the keys, the top lid tips open, and the key under
 * the pointer goes down. At rest the fallboard is ajar with its lock bright.
 * The slider is how far the lids open.
 */
const { Cam, clamp, fit, facing, fillet, poly, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 52, D = 16, TOP = 84, KY0 = D + 1, KY1 = 36, KZ = 44, NK = 14, KW = (2 * W - 10) / NK;
const REST = { f: 28, l: 5 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-W, -D, 0], [W, KY1, 0], [W, -D, 0], [-W, KY1, 0], [-W, -D, TOP + 30], [W, D, TOP + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-W, -D, W, D, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, TOP));
  for (const x of [-W + 5, W - 5]) {
    const [pr, pi] = rings(x - 3, KY1 - 6, x + 3, KY1, 1.5, 0.6);
    put(solid(g), prism(P, front, pr, pi, 0, KZ - 6));
  }
  const [kr, ki] = rings(-W + 1, D - 2, W - 1, KY1 + 1, 2, 0.8);
  put(solid(g), prism(P, front, kr, ki, KZ - 6, KZ));
  const plate = (x0, x1, y0, y1, z) => poly(fillet([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], [0.8, 0.8, 0.8, 0.8]));
  const keys = Array.from({ length: NK }, (_, i) => {
    const x0 = -W + 5 + i * KW;
    return { i, x0, cx: x0 + KW / 2, el: mk("path", { class: "sil" }, g), last: NaN };
  });
  const blacks = mk("path", { class: "" }, g);
  let bd = "";
  keys.forEach((k, i) => { if (i < NK - 1 && [0, 1, 3, 4, 5].includes(i % 7)) bd += plate(k.x0 + KW * 0.68, k.x0 + KW * 1.32, KY0, KY0 + 9, KZ + 1.2); });
  const fall = mk("path", { class: "sil" }, g), fallEdge = mk("path", { class: "nf lo" }, g);
  const lock = mk("circle", { r: 2.6, class: "dot" }, g);
  const lid = mk("path", { class: "sil" }, g), lidEdge = mk("path", { class: "nf lo" }, g);
  let reach = value, sel = -1, last = "";
  const sf = spring(REST.f), sl = spring(REST.l), press = keys.map(() => spring(0));

  function draw() {
    const key = [sf.x, sl.x, ...press.map((s) => s.x)].map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    keys.forEach((k, i) => k.el.setAttribute("d", plate(k.x0 + 0.3, k.x0 + KW - 0.3, KY0, KY1, KZ + 0.4 - press[i].x)));
    blacks.setAttribute("d", bd);
    // fallboard: hinged at the back of the keybed, swings from flat over the keys up toward the case
    const t = (sf.x * Math.PI) / 180, L = KY1 - KY0 + 1, hz = KZ + 2.5;
    const fp = (x, s) => P(x, KY0 + Math.cos(t) * L * s, hz + Math.sin(t) * L * s);
    fall.setAttribute("d", poly(fillet([fp(-W + 3, 0), fp(W - 3, 0), fp(W - 3, 1), fp(-W + 3, 1)], [1, 1, 1.5, 1.5])));
    fallEdge.setAttribute("d", poly([fp(-W + 5, 0.86), fp(W - 5, 0.86)]));
    const [lx, ly] = fp(0, 0.93); lock.setAttribute("cx", lx); lock.setAttribute("cy", ly);
    // top lid: hinged along the back edge of the case
    const u = (sl.x * Math.PI) / 180, LD = 2 * D + 2;
    const lp = (x, s) => P(x, -D - 1 + Math.cos(u) * LD * s, TOP + 0.5 + Math.sin(u) * LD * s);
    lid.setAttribute("d", poly(fillet([lp(-W - 1, 0), lp(W + 1, 0), lp(W + 1, 1), lp(-W - 1, 1)], [1, 1, 2, 2])));
    lidEdge.setAttribute("d", poly([lp(-W + 2, 0.92), lp(W - 2, 0.92)]));
  }

  const B = register(stage, (dt) => {
    let m = stepS(sf, dt); m = stepS(sl, dt) || m;
    for (const s of press) m = stepS(s, dt) || m;
    draw(); return m;
  });
  bag.add(B.unregister);

  function update(over, p) {
    sel = -1;
    if (over) {
      let bd2 = Infinity;
      keys.forEach((k) => { const d = Math.abs(P(k.cx, (KY0 + KY1) / 2, KZ)[0] - p[0]); if (d < bd2) { bd2 = d; sel = k.i; } });
    }
    sf.t = over ? clamp(108 * reach, 40, 112) : REST.f;
    sl.t = over ? clamp(34 * reach, 10, 40) : REST.l;
    press.forEach((s, i) => { s.t = i === sel ? 1.6 : 0; });
    keys.forEach((k) => k.el.classList.toggle("hi", k.i === sel));
    lock.setAttribute("class", over ? "dot off" : "dot");
    read.textContent = over ? `key ${String(sel + 1).padStart(2, "0")}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); update(Math.abs(x) < W + 30 && y > -D - 40 && y < KY1 + 60, p); },
    leave: () => update(false),
  }));
  bag.add(() => svg.replaceChildren());
  update(false);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pianolid",
  means: "An upright piano: the pointer swings the fallboard up off the keys, tips the top lid open and presses the key beneath it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.05],
  tour: [[180, 262], [113, 234], [237, 296], null],
  mount,
});
