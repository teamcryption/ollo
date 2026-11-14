/**
 * Harmonium: a box organ with a keyboard along its top and a hand-pumped
 * bellows on its back, a hinged board with pleated sides. The pointer's
 * place across the figure sets how far the bellows board swings open, on a
 * spring; leaving lets it fall back to a slight open. The board is the
 * bright mark. The slider is the widest opening.
 *
 * The pattern: one part following the pointer (swing).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 130, D = 52, H = 40, HZ = 8, L = 62, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -L, 0], [W, D, 0], [W, 0, H + 6], [0, -L, HZ + L], [W, -L, HZ + L], [0, D, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const plate = mk("path", { class: "sil hi" }, g);
  const side = mk("path", { class: "nf lo" }, g);
  const fan = mk("path", {}, g);
  const body = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 5, 1.8);
  put(solid(body), prism(P, front, br, bi, 0, H));
  const [kr, ki] = rings(8, D - 24, W - 8, D - 5, 2, 1);
  put(solid(body), prism(P, front, kr, ki, H, H + 4));
  let keys = "";
  for (let x = 14; x < W - 10; x += 8) keys += seg(P(x, D - 24, H + 4), P(x, D - 5, H + 4)) + " ";
  mk("path", { d: keys, class: "nf lo" }, body);
  for (let x = 18; x < W - 14; x += 16) {
    const [rr, ri] = rings(x - 2, D - 24, x + 2, D - 14, 1, 0.5);
    put(solid(body), prism(P, front, rr, ri, H + 4, H + 7));
  }

  const ang = spring(REST);
  let last = NaN;
  const at = (x, a, t, off = 0) => P(x, -Math.sin(rad(a)) * t - Math.cos(rad(a)) * off, HZ + Math.cos(rad(a)) * t - Math.sin(rad(a)) * off);
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const x of [4, W - 4]) for (const t of [0, L]) for (const o of [0, 3]) pts.push(at(x, a, t, o));
    plate.setAttribute("d", poly(hull(pts)));
    // the pleated side: a fan from the hinge, folding in and out
    const n = 6, zig = [at(W - 6, 0, 0)];
    for (let i = 0; i <= n; i++) zig.push(at(W - 6, (a * i) / n, i % 2 ? L * 0.86 : L));
    fan.setAttribute("d", poly(zig));
    let folds = "";
    for (let i = 1; i < n; i++) folds += seg(at(8, (a * i) / n, i % 2 ? L * 0.86 : L), at(W - 6, (a * i) / n, i % 2 ? L * 0.86 : L)) + " ";
    side.setAttribute("d", folds);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(sx) {
    const a = clamp(((sx - 90) / 220) * amax, 0, amax);
    ang.t = a;
    read.textContent = Math.round(a) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => aim(sx),
    leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; }, destroy: bag.dispose };
}

hairline({
  name: "harmoniums",
  means: "A harmonium with a hinged bellows board on its back: the pointer's place across the figure swings the bellows open.",
  rules: [3, 5, 6, 8],
  range: [30, 50, 70],
  tour: [[89, 194], [170, 230], [237, 269], null],
  mount,
});
