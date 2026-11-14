/**
 * Hotel bed: a low frame under a mattress, a padded headboard, two pillows
 * and a duvet turned down at the top. The pointer, moving along the bed,
 * sets how far the duvet is turned back: the flap folds over itself toward
 * the foot and the sheet shows beneath. At rest a short turndown, its flap
 * bright. The slider is how far the turndown may reach.
 *
 * The pattern: one continuous value on one object (a spring), read off the ground.
 */
const {
  Cam, clamp, fit, facing, proj, prism, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, W = 64, FZ = 9, MZ = 19, F = 26, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxD = 20 + value * 0.13;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-6, -2, 0], [L + 2, W + 2, 0], [L + 2, -2, 0], [-6, W + 2, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, cls) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1)); if (cls) s.sil.classList.add(cls); return s; };
  // headboard, then the frame and the mattress
  box(-6, -2, 0, W + 2, 2.5, 1, 0, 40);
  box(0, 0, L, W, 4, 1.6, 0, FZ);
  box(1, 1, L - 1, W - 1, 6, 2, FZ, MZ);
  // the two pillows, plump: a wide low solid under a narrower top
  for (const y of [5, W / 2 + 2]) { box(4, y, 21, y + W / 2 - 9, 7, 1.6, MZ, MZ + 4); box(6, y + 2, 19, y + W / 2 - 11, 6, 1.4, MZ + 4, MZ + 7); }
  const duvet = solid(g), flap = solid(g);
  flap.sil.classList.add("hi");

  const d = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    put(duvet, prism(P, front, ...rings(F + v, -1.5, L + 1.5, W + 1.5, 4, 1.8), MZ, MZ + 3));
    put(flap, prism(P, front, ...rings(F + v, -1.5, F + 2 * v, W + 1.5, Math.min(4, v / 2), Math.min(1.6, v / 3)), MZ + 3, MZ + 5.5));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(d, dt); draw(d.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [ux, uy] = unproj(C, sx, sy, MZ);
    if (ux < -10 || ux > L + 10 || uy < -16 || uy > W + 16) return leave();
    d.t = clamp((ux - F) * 0.8, 3, maxD);
    read.textContent = "turn " + Math.round((d.t / 33) * 100) + "%";
    B.wake();
  }
  function leave() { d.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxD = 20 + v * 0.13; }, destroy: bag.dispose };
}

hairline({
  name: "hotelbed",
  means: "A made hotel bed with two pillows: the pointer moving along it turns the duvet back further, its flap folding toward the foot.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[176, 131], [250, 168], [213, 150], null],
  mount,
});
