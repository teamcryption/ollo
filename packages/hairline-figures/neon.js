/**
 * Neon sign: a backing panel on a weighted foot with a bent tube standing off
 * its face. The pointer tips the panel back on its foot hinge, as if to
 * catch the light. At rest it leans slightly, its tube bright.
 * The slider is how far it can tip.
 */
const { Cam, fit, facing, proj, rings, prism, put, solid, mk, poly, open, seg, fillet, hull, spring, stepS, clamp, rad, register, pointer, disposer } = HL;

const W = 56, H = 74, T = 2, Z = 7, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-W, -10, 0], [W, 10, 0], [-W, 0, Z + H], [W, 0, Z + H], [-W, -50, Z + 50], [W, -50, Z + 50]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-W + 6, -12, W - 6, 12, 6, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, Z));
  const plate = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const legs = mk("path", { class: "nf lo" }, g), tube = mk("path", { class: "nf sil hi" }, g);

  const tx = (u) => -W + 18 + u * (2 * W - 36) - 9 * Math.sin(u * Math.PI * 8), th = (u) => H * 0.5 + 12 * Math.cos(u * Math.PI * 8) * (0.5 + 0.5 * Math.sin(u * Math.PI));
  const sp = spring(REST);
  let last = NaN;
  const pt = (x, t, h, b) => { const c = Math.cos(rad(b)), s = Math.sin(rad(b)); return P(x, t * c - h * s, Z + h * c + t * s); };
  const wave = (t, b) => {
    const q = [];
    for (let i = 0; i <= 90; i++) { const u = i / 90; q.push(pt(tx(u), t, th(u), b)); }
    return q;
  };
  function draw(b) {
    if (b === last) return;
    last = b;
    const pts = [];
    for (const x of [-W, W]) for (const t of [-T, T]) for (const h of [0, H]) pts.push(pt(x, t, h, b));
    const hp = hull(pts);
    plate.setAttribute("d", poly(fillet(hp, hp.map(() => 6))));
    const q = [pt(-W + 5, T, 5, b), pt(W - 5, T, 5, b), pt(W - 5, T, H - 5, b), pt(-W + 5, T, H - 5, b)];
    rim.setAttribute("d", poly(fillet(q, [4, 4, 4, 4])));
    let l = "";
    for (const u of [0.12, 0.5, 0.88]) l += seg(pt(tx(u), T, th(u), b), pt(tx(u), T + 5, th(u), b));
    legs.setAttribute("d", l);
    tube.setAttribute("d", open(wave(T + 5, b)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const mid = P(0, 0, Z + H / 2);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const t = clamp(Math.hypot(sx - mid[0], sy - mid[1]) / 180, 0, 1);
      sp.t = REST + (amp - REST) * (1 - 0.6 * t);
      read.textContent = Math.round(sp.t) + "°";
      B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "neon",
  means: "A neon sign on a weighted foot: the pointer tips the panel back on its hinge, its bent tube riding along.",
  rules: [3, 4, 5, 8],
  range: [30, 48, 60],
  tour: [[159, 153], [68, 195], [250, 125], null],
  mount,
});
