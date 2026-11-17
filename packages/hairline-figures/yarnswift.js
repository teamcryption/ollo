/**
 * Yarn swift: an umbrella swift clamped to a table, its slats hinged at the
 * top hub round a pole, a skein of yarn stretched round their tips. The
 * pointer near it opens the umbrella and turns it to face the pointer; away,
 * it folds back to half open. The skein is bright. The slider is how wide it
 * opens.
 *
 * The pattern: a continuous aim on two springs, hit on the ground plane.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, poly, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, L = 48, TOP = 78, wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-L, -L, TOP - 10], [L, L, TOP - 10], [L, -L, TOP - 10], [-L, L, TOP - 10], [0, 0, 0], [0, 0, TOP + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-12, -9, 12, 9, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 8));
  put(solid(g), prism(P, front, circ(2.4, 20), null, 8, TOP));
  const back = mk("path", { class: "nf sil" }, g);
  put(solid(g), prism(P, front, circ(4, 24), null, TOP - 2, TOP + 4));
  const skein = mk("path", { class: "nf sil" }, g);
  const fore = mk("path", { class: "nf sil" }, g);
  skein.classList.add("hi");
  const op = spring(0.7), sp = spring(0.3);
  let drawn = "";
  function draw() {
    const key = op.x.toFixed(4) + sp.x.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const th = (12 + op.x * 76 * wide) * Math.PI / 180, hub = P(0, 0, TOP);
    let bk = "", fr = "";
    const tips = [], loop = [];
    for (let k = 0; k < N; k++) {
      const f = sp.x + (k / N) * Math.PI * 2, c = Math.cos(f), s = Math.sin(f);
      const r = L * Math.sin(th), z = TOP - L * Math.cos(th);
      const tip = P(r * c, r * s, z), mid = P(r * 0.5 * c, r * 0.5 * s, z + (TOP - z) * 0.5);
      const sl = P(0, 0, TOP - 26), line = seg(hub, tip) + seg(sl, mid);
      if (c + s > 0) fr += line; else bk += line;
      tips.push([r * c, r * s, z]);
    }
    for (let i = 0; i <= 36; i++) {
      const f = sp.x + (i / 36) * Math.PI * 2, r = L * Math.sin(th) * 0.92, z = TOP - L * Math.cos(th) + 2;
      loop.push(P(r * Math.cos(f), r * Math.sin(f), z));
    }
    back.setAttribute("d", bk);
    fore.setAttribute("d", fr);
    skein.setAttribute("d", poly(loop) + poly(loop.map(([x, y]) => [x, y + 5])));
  }
  const B = register(stage, (dt) => { const a = stepS(op, dt), b = stepS(sp, dt); draw(); return a || b; });
  bag.add(B.unregister);
  function set(p) {
    if (!p) { op.t = 0.7; read.textContent = "rest"; }
    else {
      const [x, y] = unproj(C, p[0], p[1], TOP - 20), r = Math.hypot(x, y);
      op.t = r < L * 1.6 ? 1 : 0.7;
      if (r > 4) sp.t = sp.t + wrap(Math.atan2(y, x) - sp.t);
      read.textContent = op.t === 1 ? "open" : "rest";
    }
    B.wake();
  }
  draw();
  read.textContent = "rest";
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; drawn = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "yarnswift",
  means: "An umbrella yarn swift: near the pointer its slats open wide and turn to it, the skein stretching round them.",
  rules: [1, 3, 4, 5],
  range: [0.4, 0.8, 1],
  tour: [[254, 173], [272, 160], [150, 175], null],
  mount,
});
