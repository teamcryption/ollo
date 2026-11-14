/**
 * Fish net: a glass aquarium tank with water and two fish, and a hand net on
 * a long handle hinged above its right end. The pointer over the tank swings
 * the net down into the water, its hoop following the pointer along the
 * tank; leaving lifts it back out. At rest the net hangs poised above the
 * water, hoop bright. The slider is how deep it dips.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, clamp, lerp, rad, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 110, D = 50, H = 54, WZ = 42, HR = 22, L = 92;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = value;
  const C = Cam(45, 0.5, 1.75);
  const PV = [W + 18, D / 2, H + 34];
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, 0, H], [PV[0] + 4, PV[1], PV[2] + 6], [10, D / 2, H + 60], [10, 0, H + 60], [10, D, H + 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // stand under the tank
  const [sr, si] = rings(-4, -4, W + 4, D + 4, 5, 1.5);
  put(solid(g), prism(P, front, sr, si, 0, 6));
  // glass tank: open, so the net reads through it
  const [tr] = rings(0, 0, W, D, 4, 1.5);
  const tank = prism(P, front, tr, tr, 6, 6 + H);
  mk("path", { d: tank.sil, class: "sil nf" }, g);
  mk("path", { d: poly(ringAt(P, tr, 6 + H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, rings(1.5, 1.5, W - 1.5, D - 1.5, 3, 1)[0], 6 + WZ)), class: "nf lo" }, g);
  const fish = [[30, 30, 22], [70, 18, 30]].map(([x, y, z]) => {
    const body = [P(x - 7, y, 6 + z), P(x, y - 0.5, 6 + z + 3), P(x + 6, y, 6 + z), P(x, y + 0.5, 6 + z - 3)];
    const tail = [P(x + 6, y, 6 + z), P(x + 10, y, 6 + z + 3), P(x + 10, y, 6 + z - 3)];
    mk("path", { d: poly(body) + poly(tail), class: "nf lo" }, g);
    const e = P(x - 4, y, 6 + z + 0.6); return mk("circle", { cx: e[0], cy: e[1], r: 1.2, class: "dot off" }, g);
  });
  // the net
  const handle = mk("path", { class: "nf" }, g), pocket = mk("path", { class: "nf lo" }, g), hoop = mk("path", { class: "sil nf hi" }, g);
  const pv = P(...PV); const pin = mk("circle", { cx: pv[0], cy: pv[1], r: 2, class: "dot m" }, g);
  const th = spring(-8), hy = spring(D / 2);
  let lt = NaN, ly = NaN;
  function draw(t, y) {
    if (t === lt && y === ly) return; lt = t; ly = y;
    const a = rad(t), cx = PV[0] - L * Math.cos(a), cz = Math.max(24, PV[2] - L * Math.sin(a));
    const cy = lerp(PV[1], y, clamp((t + 8) / 50, 0, 1));
    const hp = ringAt(P, disc(cx, cy, HR), 6 + cz);
    const bag2 = ringAt(P, disc(cx + 2, cy, HR * 0.5, 16), 6 + cz - 22);
    pocket.setAttribute("d", poly(hull(hp.concat(bag2))) + open(hull(bag2)));
    hoop.setAttribute("d", poly(hp));
    const e = P(cx + HR, cy, 6 + cz);
    handle.setAttribute("d", open([e, pv]));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt) | stepS(hy, dt); draw(th.x, hy.x); return !!m; });
  bag.add(B.unregister);
  let on = null;
  function set(t, y, a) {
    th.t = t; hy.t = y;
    if (a !== on) { on = a; fish.forEach((f) => f.setAttribute("class", a ? "dot m" : "dot off")); }
    read.textContent = a ? "dip " + Math.round(t + 8) : "rest";
    B.wake();
  }
  draw(-8, D / 2); set(-8, D / 2, false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      if (x < -30 || x > W + 30 || y < -30 || y > D + 30) return set(-8, D / 2, false);
      const k = clamp(1 - Math.abs(x - W * 0.4) / (W * 0.9), 0.2, 1);
      set(Math.round(-8 + (deep + 8) * k), clamp(y, 14, D - 14), true);
    },
    leave: () => set(-8, D / 2, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { deep = v; }, destroy: bag.dispose };
}

hairline({
  name: "fishnet",
  means: "A hand net hinged over a glass fish tank: the pointer over the tank swings the net down into the water, following along.",
  rules: [1, 3, 5, 8],
  range: [20, 46, 50],
  tour: [[107, 200], [186, 240], [268, 281], null],
  mount,
});
